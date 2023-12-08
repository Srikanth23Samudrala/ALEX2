const QuestionBank = require('../models/questions-bank');
const csv = require('csv-parser');
const fs = require('fs');

const { generateQuestionId } = require('../middleware/Utility-functions');

exports.addQuestiontoBank = async (req, res) => {
  try {
    // Ensure req.body is defined and has the expected properties
    const { questionText, answers, correctAnswer, difficulty } = req.body || {};

    // If answers is undefined or not a string, set it to an empty string
    const answerArray = (typeof answers === 'string' ? answers : '').split(',').map(answer => answer.trim());

    // Create a new question object
    const newQuestion = {
      questionText,
      answers: answerArray,
      correctAnswer,
      difficulty
    };

    if (req.file) {
      const questions = [];

      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', row => {
          // Process each row from the CSV file
          const { questionText, answers, correctAnswer, difficulty } = row;

          // If answers is undefined or not a string, set it to an empty string
          const answerArray = (typeof answers === 'string' ? answers : '').split(',').map(answer => answer.trim());

          // Create a question object
          const csvQuestion = {
            questionText,
            answers: answerArray,
            correctAnswer,
            difficulty
          };

          // Log each question ID to the console
          const generateQuestionId = generateQuestionId(); // Assuming generateQuestionId is a function that generates an ID
          console.log(`Question added with ID: ${generateQuestionId}`);

          // Push the question object to the questions array
          questions.push(csvQuestion);
        })
        .on('end', async () => {
          const timestamp = Date.now().toString();
          const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
          questions.forEach(async (q, index) => {
            const generateQuestionId = `${timestamp}-${random}-${index}`;
            const question = new QuestionBank({
              questionId: generateQuestionId,
              questions: [q]
            });

            await question.save();
          });

          // Log the total number of questions added to the database
          console.log(`Total questions added: ${questions.length}`);

          fs.unlinkSync(req.file.path);

          res.status(201).send('Questions added successfully!');
        });
    } else {
      const timestamp = Date.now().toString();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const generateQuestionId = `${timestamp}-${random}`;

      const question = new QuestionBank({
        questionId: generateQuestionId,
        questions: [newQuestion]
      });

      await question.save();

      res.status(201).send('Question added successfully!');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while adding the question.');
  }
};

exports.showAllQuestions = async (req, res) => {
  try {
    const questions = await QuestionBank.find({});
    console.log(`Total number of questions: ${questions.length}`);
    res.render('view-question', { questions });
  } catch (error) {
    res.status(500).json({
      status: 'failure',
      message: 'An error occurred while fetching questions.'
    });
  }
};
