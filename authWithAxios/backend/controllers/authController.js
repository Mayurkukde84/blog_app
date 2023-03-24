const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const {promisify} = require('util')

const signup = asyncHandler(async (req, res) => {
  const { username, role, email, password, passwordConfirm } = req.body;

  const user = await User.create({
    username,
    email,
    password,
    passwordConfirm,
    role,
  });

  const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: false,
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;

  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

const login = asyncHandler(async(req,res)=>{
  const {email,password} = req.body

  if(!email || !password){
    return res.status(400).json({message:'please filled login and password'})
  }

  const user = await User.findOne({email}).select('+password')

  if(!user || !(await user.checkPassword(password,user.password))){
    res.status(400).json({
      status:"failed",
      message:'Incorrect wmail or password'
    })
  }
 const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
  expiresIn: process.env.JWT_EXPIRES_IN
 })

const cookieOptions = {
  expiresIn: new Date(
    Date.now() + process.env.JWT_EXPIRES_IN*24*60*60*1000
  ) ,
   secure: false,
  httpOnly: true,
}
res.cookie("jwt",token,cookieOptions)
user.password = undefined

res.status(200).json({
  status:'success',
  token,
  user
})

})

const protect = asyncHandler(async(req,res,next)=>{
  let token;
  if(
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ){
    token = req.headers.authorization.split(" ")[1];
  }

  if(!token){
    return res.status(401).json({message:"your are not logged in to get access"})
  }
  const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
  console.log(decoded)

  const currentUser = await User.findById(decoded.id);

  if(!currentUser){
    return res.status(401).json({
      message:"The user belongig to the token does not exist"
    })
  }
  if(currentUser.changedPasswordAfter(decoded.iat)){
    return res.status(401).json({message:'User recently changed password ! Please log in again'})
  }
  req.user = currentUser
  next()

})

module.exports = {
  signup,
  login,
  protect
};
