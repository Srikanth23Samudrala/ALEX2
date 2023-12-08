const mongoose=require('mongoose')
//This model is for clients data
const gameScore=new mongoose.Schema({
    gameId:{
        type:String,
        required:true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'User',  // Reference to the User model
        required: true
    },
    score:{
        type:String,
        required:true
    }
})
module.exports=mongoose.model('GameScore',gameScore)