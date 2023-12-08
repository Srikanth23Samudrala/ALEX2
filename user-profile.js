const mongoose=require('mongoose')
const userProfile=new mongoose.Schema({
    userId:{
        type:String,
        required:true

    },
    fullname:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    avatarLink:{
        type:String,
        required:false
    },
    privacy:{
        type:String,
        required:true,
        enum:['public','private']
    }
})
module.exports=mongoose.model('Profile',userProfile)
