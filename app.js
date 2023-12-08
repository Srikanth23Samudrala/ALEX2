const express=require('express')
const mongoose = require('mongoose')
const app=express()
const cors=require('cors')
const logger=require('morgan')
require('dotenv/config')
const fs=require('fs')

app.set('view engine', 'pug')
app.set('views','./views')
app.use(express.urlencoded({ extended: true }));
//use the imported packages
app.use(cors({ origin: '*' }))
app.use(express.json())
//log all the activities that take place in system.
app.use(logger('common', {
  stream: fs.createWriteStream("./logs/access.log",
  {flags:'a'})

}))
app.use(logger('dev'))



//get all routes
// const register=require('./routes/register')
const {
    registerController,
    loginController,
    activateAccountController,
    createProfileController,
    getProfileData,
    sendResetLinkToEmail
}=require('./controllers/register')

const {
    addQuestiontoBank,
    showAllQuestions 
}=require('./controllers/admin.js')
//
// app.use('/Auth',register)
// app.post('/create-new-player',)

//1.Authentication
app.post('/Auth/register-new-player',registerController)
app.post('/Auth/activate-account', activateAccountController)
app.post('/Auth/login', loginController)

//2.Profile
app.post('/Profile/create-profile/:userId', createProfileController)


const games = [
    { id:"1", name: 'Game 1', image: 'game1.jpeg', description: 'Description for Game 1' },
    { id:"2",  name: 'Game 2', image: 'game2.jpeg', description: 'Description for Game 2' },
    { id:"3",  name: 'Game 3', image: 'game3.jpeg', description: 'Description for Game 3' },
    { id:"4",  name: 'Game 4', image: 'game4.jpeg', description: 'Description for Game 4' },
    { id:"5",  name: 'Game 5', image: 'game5.png', description: 'Description for Game 5' },
    { id:"6",  name: 'Game 6', image: 'game6.png', description: 'Description for Game 6' },
    { id:"7",  name: 'Game 7', image: 'game7.jpeg', description: 'Description for Game 7' },
    { id:"8",  name: 'Game 8', image: 'https://i.pravatar.cc/150', description: 'Description for Game 8' },
    { id:"9", name: 'Game 9', image: 'https://i.pravatar.cc/150', description: 'Description for Game 9' },
    // Add more game objects as needed
];
// Define the dummyPlayers array (an example)
const dummyPlayers = [
    { name: 'Player 1' },
    { name: 'Player 2' },
    // Add more players as needed
  ];

app.get('/', (req,res)=>{
    res.render('home')
})
app.get('/Auth/register-new-player', (req,res)=>{

    res.render('register')
})
app.get('/Auth/activate-account',(req,res)=>{

    res.render('activate-acc')
})
app.get('/admin-page',(req,res)=>{
    res.render('admin-page')
})
app.get('/admin-dashboard', (req,res)=>{
    res.render('admin-dashboard')
})
app.get('/admin-dashboard/add-question', (req,res)=>{
    res.render('add-question')
})
app.post('/admin-dashboard/add-question',addQuestiontoBank)
app.get('/admin-dashboard/view-question',showAllQuestions)
app.get('/initial-profile', (req,res)=>{
    res.render('initial-profile')
})
app.get('/game-dashboard', (req,res)=>{
    res.render('dashboard',{ games, dummyPlayers})
})
app.get('/game-dashboard/profile',getProfileData);
app.get('/game-dashboard/game-quiz', (req,res)=>{
    res.render('game-quiz')
})
app.get('/forgot-password', (req,res)=>{
    res.render('forgot-password')
})
app.post('/forgot-password', sendResetLinkToEmail)
app.get('/game-dashboard/game-scores', (req,res)=>{
    res.render('game-scores')
})
app.get('/game-dashboard/game-logs', (req,res)=>{
    res.render('game-logs')
})
app.get('/game-dashboard/notifications', (req,res)=>{
    res.render('notifications')
})
app.get('/login-with-face', (req,res)=>{
    res.render('login-with-face')
})
//connect to mongodb
mongoose.connect(process.env.DB_CONNECTION)

app.listen(process.env.PORT)