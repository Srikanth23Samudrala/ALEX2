const mongoose=require('mongoose')
//This model is for clients data
const userNotifications=new mongoose.Schema({
    channel:{
        type:String,
        enum: ['all','specific'],
        default:'all'
    },
    userId:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:false
    },
    mode:{
        type:String,
        required:true,
        enum: ['email','ingame'],
        default:'ingame'
    }
})

module.exports=mongoose.model('Notifications',userNotifications)