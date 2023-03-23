const mongoose = require("mongoose");
const validaotr = require('validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "Username is required"],
    required:true

  },
  role:{
    type:String,
   enum:['user','admin'],
   default:'user'
  },
  email:{
    type:String,
    unique:true,
    lowecase:true,
    validate:[validaotr.isEmail,'Please provide valid email']   ,
    required:true
  },
  password:{
    type:String,
    required:[true,'please provide a password'],
    minLength:8,
    select:false

  },
  passwordConfirm:{
    type:String,
    require:[true,'plese confirm your password'],
    minLength:8,
    validate:{
      validator:function(el){
        return el === this.password
      },
      message:'Password are not the same'
    }
  },
  active:{
    type:Boolean,
    default:true,
    select:false
  }
});


module.exports = mongoose.model('User',userSchema)