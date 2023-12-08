const mongoose=require('mongoose')
const questionBank=new mongoose.Schema({
    questionId:{
        type:String,
        required:true
    },
    questions:{
        type:Array,
        required:true
    }
})
module.exports=mongoose.model('questionBank',questionBank)
