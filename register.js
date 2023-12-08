const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken')
const uuid = require('uuid');
const nodemailer=require('../middleware/nodemailer.config')
const {sendNotification}=require('../middleware/notifications')
const AuthRegister=require('../models/user-register')
const Profile=require('../models/user-profile')

//register the game player
exports.registerController = async (req, res) => {
    try {
        //check the email existence
        const emailExist = await AuthRegister.findOne({
            email: req.body.email
        })
        console.log(emailExist)
        if (emailExist) {
            return res.status(400).json({
                'error': 'Email already Exist!'
            })
        }
        //hash the password before saving it into the database.
        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const userId = uuid.v4(); // Generate a version 4 (random) UUID

        //generate confirmation code
        const confirmationCode = Math.floor(100000 + Math.random() * 900000)
        //get all the data from the sp who is registering.
        const playerDetails = new AuthRegister({
            userId: userId,
            email: req.body.email,
            password: hashedPassword,
            confirmationCode: confirmationCode
        })
        
        console.log(playerDetails)
        //create a new sp to the database.
        // const newPlayer = await playerDetails.save((err, data) => { 
        //     if (err) {
        //         return res.status(400).json({
        //             'message':'failure',
        //             'error': err
        //         })
        //     }
        //     nodemailer.sendConfirmationEmailClient(
        //         data.email,
        //         data.confirmationCode)
            
        // })
        const newPlayer = await playerDetails.save();
        nodemailer.sendConfirmationEmailClient(newPlayer.email, newPlayer.confirmationCode);
        //send the confirmation code to the email using nodemailer
                
        //save the new client to the database
        // const newClient = await CRegister.create(req.body)

        //send the response to the client
        // return res.status(200).json({
        //     'message': 'registered successfully! Check your email for activation link',
        //     newPlayer
        // })

        // return res.send("registered successfully")
        return res.render('activate-acc')

    } catch (e) {
        return res.status(400).json({
            status: 'failure',
            message: e.message
        })
    }

}
//activate the account
exports.activateAccountController = async (req, res) => {
    try {
        //get the confirmation code from the request body
        const confirmationCode  = req.body.confirmationCode
        console.log(confirmationCode)
        //check if the confirmation code is correct
        const user = await AuthRegister.findOneAndUpdate({
            confirmationCode: confirmationCode
        },
            {
                $set: {
                    accountStatus: 'active'
                }
            }
        )
        if (!user) {
            return res.status(400).json({
                'error': 'Invalid confirmation code'
            })
        }
        var notificationTitle = 'Welcome to Alex-game'
        var notificationMessage='Start quiz game and advance your knowledge'
        var channel='all'
        var mode='ingame'
        //send a notification to the user.
        const messageSent=await sendNotification(user.userId,channel,notificationMessage, notificationTitle,mode)
        const userId=user.userId
        console.log(messageSent)
        // res.status(200).json({
        //     'message': 'Account activated successfully',
        //     user
        // })
        return res.render('initial-profile',{userId})
    } catch (e) {
        res.status(400).json({
            status: 'failure',
            message: e.message
        })
    }
}

//login with email/password
exports.loginController = async (req, res) => {
    //check if the email exists
    const emailExist = await AuthRegister.findOne({
            email: req.body.email
        })
    if (!emailExist) {
            res.status(404).json({
                'error': 'Email does not Exist!..create an account'
            })
            return 
    }
    //check if the account status is activated
    // const accountStatus = await AuthRegister.findOne({
    //     email: req.body.email
    // })
    if (emailExist.accountStatus == 'inactive') {
        return res.status(400).json({
            status:'failure',
            message: 'Account not activated! Check your email for activation code'
        })
    }
    //check wheather the user has an active profile.
    // const profileCreated = await Profile.findOne({
    //     userId:emailExist._id
    // })
    // if (!profileCreated) {
    //     return res.status(404).json({
    //         userid: emailExist._id,
    //         profile:null
    //     })  
    // }
    //check if the password is correct
    const validPassword = await bcrypt.compare(req.body.password, emailExist.password)
    if (!validPassword) {
        return res.status(400).json({
            'error': 'Invalid credentials!'
        })
    }
    //allow the user to login
    const userid = emailExist._id
    if (!res.headersSent) {
        // return res.header('userid', userid).json({
        //     'message': 'logged in successfully',
        //     'userid': userid
        //     // profile: profileCreated
        // })
        // return res.render('dashboard',{userid})
        const games = [
            { name: 'Game 1', image: 'game1.jpeg', description: 'Description for Game 1' },
            { name: 'Game 2', image: 'game2.jpeg', description: 'Description for Game 2' },
            { name: 'Game 3', image: 'game3.jpeg', description: 'Description for Game 3' },
            { name: 'Game 4', image: 'game4.jpeg', description: 'Description for Game 4' },
            { name: 'Game 5', image: 'game5.png', description: 'Description for Game 5' },
            { name: 'Game 6', image: 'game6.png', description: 'Description for Game 6' },
            { name: 'Game 7', image: 'game7.jpeg', description: 'Description for Game 7' },
            { name: 'Game 8', image: 'https://i.pravatar.cc/150', description: 'Description for Game 8' },
            { name: 'Game 9', image: 'https://i.pravatar.cc/150', description: 'Description for Game 9' },
            // Add more game objects as needed
        ];
        const dummyPlayers = [
            { name: 'Player 1' },
            { name: 'Player 2' },
            // Add more players as needed
          ];
        return res.render('dashboard',{ games, dummyPlayers})
    }
}
exports.createProfileController=async(req,res)=>{
    try {
        // Retrieve data from the form
        const userId=req.params.userId
        const { username, avatarLink,fullname, privacy } = req.body;
        
        console.log(req.body)
        // Create a new Profile document
        const newProfile = new Profile({
            userId, // You might want to use the user ID from the authenticated user
            fullname,
            username,
            // Assuming 'avatar' is a file upload, save the link to the uploaded file
            avatarLink: req.file ? req.file.path : null,
            privacy: privacy || 'public', // Set privacy to 'public' by default if not specified
        });
        console.log(newProfile)


        // Save the new profile to the database
        await newProfile.save();

        // Send a response indicating success
        res.status(200).json({
            message: 'Profile created successfully',
        });
    } catch (e) {
        // Handle any errors
        res.status(400).json({
            status: 'failure',
            message: e.message
        })
    }
}
exports.getProfileData=async (req, res) => {
    try {
      const userId = "405aeb82-c5f1-4e1f-8f6d-378ba5f2d81c";
  
      // Retrieve the user's profile data from the database based on userId
      const user = await Profile.findOne({ userId });
  
      if (!user) {
        return res.status(404).json({ message: 'Profile not found' });
      }
  
      // Render the profile template and pass the user data to it
      res.render('profile', { user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  exports.sendResetLinkToEmail = async (req, res) => {
    try {
        // console.log(req.body)
                //check for email address existence
                const playerEmail = await AuthRegister.findOne({
                    email:req.body.email
                })
                console.log(playerEmail)
                //generate a alphanumeric token that is validated
                const payload = {
                    user: {
                        id:playerEmail.userId
                    }
                }
                

                jwt.sign(payload, "anystring", { expiresIn: 1000 }, function (err, token) {
                    if (err) {
                        res.send(err)
                    }
                    res.status(200).json({
                        token,
                        playerEmail
                    })
                })

                console.log(jwt)
                
                const confirmationCode = Math.floor(100000 + Math.random() * 900000)
    
                if (!playerEmail) {
                    res.status(400).json({
                        'error':'Email does not Exist'
                    })
                } else {
                    nodemailer.sendPasswordResetEmail(
                        playerEmail.email,
                        confirmationCode)
                    res.status(200).json({
                        status: 'success',
                        message: 'Password reset link sent to your email'
                    })
                }
    } catch (e) {
        res.status(400).json({
            status: 'failure',
            message:e.message
        })
    }
}





  exports.resetPassword = async (req, res) => {
    try {
            //get the new password and email
        const password = req.body.newpassword
        
        const email = req.body.email
        //send the credentials to the resetPassword to the middleware 
        const resetSuccessful = await resetPassword(email, password)
        
        console.log(resetSuccessful=='success')
        if (resetSuccessful == 'success') {
            return res.status(201).json({
                status: 'success',
                message:'Password Updated successfully'
            })
        }
        
        return res.status(400).json({
            status: 'failure',
            message:'Error when updating Password'
        })
    
    } catch (error) {
        return res.status(400).json({
            status: 'failure',
            message:error.message
        })
        
    }
    
    }