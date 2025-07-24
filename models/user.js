const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema({
    firstName :{type:String,required:true},
    lastName : String,
    email : {type:String,required:true},
    password : {type:String,required:true},
    userType :{type:String, enum:['guest','host'],required:true},
    favourites : [{type: mongoose.Schema.Types.ObjectId,ref:'Home'}]
})

module.exports = mongoose.model("Users",userSchema);
