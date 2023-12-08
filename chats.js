const mongoose=require('mongoose')
//This model is for clients data
const chatMessage=new mongoose.Schema({
    chatId:{
        type:String,
        required:true
    },
    chatDescription:{
        type:Array,
        required:true
    }
})

module.exports=mongoose.model('Chat',chatMessage)