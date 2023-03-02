const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: true,
      },
    email: {
        type: String,
        minlength: 1,
        maxlength: 40,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
      },
      role:{
        type:String,
        enum:["user","guide","lead-guide","admin"],
        default:"user"
      },
    password:{
        type:String,
        required:[true,"Please enter your password"],
        min:[8,'minimun 8 digit password']
    },
    passwordConfirm:{
        type:String,
        validate:{
            validator:function(el){
                return this.password === el
            },
            message:'password and confirmpassword are not same'
        }
    },
    passwordChangedAt:Date
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next()
  });

userSchema.methods.checkPassword= async function(currentPassword,userPassword){
return await bcrypt.compare(currentPassword,userPassword)

}
userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changeTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10)
        return JWTTimestamp < changeTimestamp
    }
    return false
}

module.exports = mongoose.model('User',userSchema)