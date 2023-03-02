const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const {promisify} = require('util');
const { Decipher } = require("crypto");
const signup = asyncHandler(async (req, res) => {
  const { username, email, password, passwordConfirm,role } = req.body;
  const checkDuplicate = await User.findOne({ username }).exec();
  if (checkDuplicate) {
    return res
      .status(400)
      .json({ message: "This name already exist please use another name" });
  }
  const user = await User.create({
    username,
    email,
    password,
    passwordConfirm,
    role
  });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_EXPIRES * 24 * 60 * 60 * 1000
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
    return res.status(400).json({message:'please enter your email and password'})
  }
  const user = await User.findOne({email}).select('+password')
  if(!user){
    return res.status(400).json({message:'invalid user ,please check your email and password'})
  }
  if(!user || !(await user.checkPassword(password,user.password))){
   return res.status(401).json({
      message:'Invalid email and password'
    })
  }
let token = jwt.sign({id:user._id},
  process.env.JWT_SECRET,
  {
    expiresIn:process.env.JWT_EXPIRES
  }
  )

  const cookieOptions = {
    expiresIn:new Date(Date.now() + process.env.JWT_EXPIRES*24*60*60*1000),
    secure:false,
    httpOnly:true
  }
  res.cookie('jwt',token,cookieOptions)
  res.status(200).json({
  status:'success',
  token
})

})

const protect = asyncHandler(async(req,res,next)=>{
  let token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
token = req.headers.authorization.split(' ')[1]
  }
  if(!token){
    return res.status(401).json({message:'You must log in'})
  }
  const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
  
 const currentUser = await User.findById(decoded.id)
  if(!currentUser){
    return res.status(401).json({
      message:'The user blongig to the token doe not exist'
    })
  }
  if(currentUser.changedPasswordAfter(decoded.iat)){
    return res.status(401).json({
      message:'User recently changed password ! please log in'
    })
  }
  req.user = currentUser;
  next()
})

const restrictTo = (...roles)=>{
  return(req,res,next)=>{
    if(!roles.includes(req.user.role)){
      return res.status(403).json({
        message:'You do not have permision to change'
      })
    }
    next()
  }
}


module.exports = {
  signup,
  login,
  protect,
  restrictTo
};
