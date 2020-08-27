const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
name:{
    type:String,
    min:6
},
email:{
    type:String,
    required:true,
    min:6,
    unique:true
},
password:{
    type:String,
    required:true,
    min:6,
    max:202
}


});
module.exports=User=mongoose.model('user',userSchema);