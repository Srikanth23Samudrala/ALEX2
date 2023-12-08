const mongoose=require('mongoose')
const games=new mongoose.Schema({
    gameId:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    time:{
        type:TimeRanges,
        required:true
    },
    gameName:{
        type:String,
        required:true
    },
    questionId:{
        type:String,
        required:true
    }
})
module.exports=mongoose.model('Game',games)