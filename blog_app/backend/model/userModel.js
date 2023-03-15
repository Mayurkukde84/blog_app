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
        default:"admin"
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
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
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
        const changeTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000,10)
        return JWTTimestamp < changeTimeStamp
    }
    return false
}

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(64).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10*60*1000
    return resetToken

}
userSchema.pre(/^find/,function(next){
    //this points to be current querry
    this.find({
      active:{$ne:false}  //user with active:false not show in all method that use find
    })
    next()
  })
  

module.exports = mongoose.model('User',userSchema)