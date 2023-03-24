const mongoose = require("mongoose");
const validaotr = require('validator')
const bcrypt = require('bcrypt')


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
  },
  passwordChangedAt: Date,
  passwordResetToken:String,
  passwordResetExpires:Date,
});

userSchema.pre('save',async function(next){
  if(!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password,12)
  this.passwordConfirm = undefined
  next()
})

userSchema.methods.checkPassword =async function(cureentPassword,userPassword){
return await bcrypt.compare(cureentPassword,userPassword)
}

module.exports = mongoose.model('User',userSchema)