const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const signup = asyncHandler(async (req, res) => {
  const { username, password, passwordConfirm, role, email } = req.body;

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

  const cookiesOption = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: false,
    httpOnly: true,
  };
  user.password = undefined;
  res.cookie("jwt", token, cookiesOption);

  res.status(200).json({
    status: "success",
    token,
    user,
  });
});

const login = asyncHandler(async(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(400).json({message:"please fill login and password"})
    }

    const user = await User.findOne({email}).select("+password")

    if(!user || !(await user.checkpassword(password,user.password))){
        return res.status(400).json({message:"Incorrect email and password"})
    }

    const token = await jwt.sign({id:user._id},process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_EXPIRES_IN
        })
    
    const cookiesOptions = {
        expiresIn:new Date(
            Date.now() + process.env.JWT_EXPIRES_IN *24 *60*60*1000
        ),
        secure:false,
        httpOnly:true
    }
    user.password = undefined
    res.cookie('jwt',token,cookiesOptions)
    res.status(200).json({
        status: "success",
        token,
        user,
      });
})

const protect = asyncHandler(async(req,res)=>{
    let token;
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        token = req.headers.authorization.split(" ")[1]
    }
    if(!token){
        return res.status(401).json({message:'you are not logged in to get access'})
    }

    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    console.log(decoded)

    const currentUser = await User.findById(decoded.id);
    if(!currentUser.changedPasswordAfter(decoded.iat)){
        return res.status(401).json({
            message:"User recently changed password! please login again"
        })
    }

    req.user = currentUser
    next()
})

module.exports = {
  signup,
  login,
  protect
};
