const mongoose=require('mongoose')
//This model is for clients data
const topScore=new mongoose.Schema({
    gameId:{
        type:String,
        required:true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'User',  // Reference to the User model
        required: true
    },
    topScore:{
        type:String,
        required:true
    },
    gameCategory:{
        type:String,
        required:true
    }
})
module.exports=mongoose.model('TopScore',topScore)