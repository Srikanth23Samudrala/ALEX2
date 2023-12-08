const mongoose=require('mongoose')
//This model is for clients data
const gameConfig=new mongoose.Schema({
    gameId:{
        type:String,
        required:true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'User',  // Reference to the User model
        required: true
    },
    settings:{
        type:Array,
        required:true
    }
})
module.exports=mongoose.model('GameConfig',gameConfig)