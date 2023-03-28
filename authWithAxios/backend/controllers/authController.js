const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { Decipher } = require("crypto");
const signup = asyncHandler(async (req, res) => {
  const { username, email, password, passwordConfirm, role } = req.body;
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
    role,
  });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  let refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES,
  });

  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_EXPIRES * 24 * 60 * 60 * 1000
    ),
    secure: false,
    httpOnly: true,
  };

  res.cookie("jwt", refreshToken, cookieOptions);
  user.password = undefined;
  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "please enter your email and password" });
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res
      .status(400)
      .json({ message: "invalid user ,please check your email and password" });
  }
  if (!user || !(await user.checkPassword(password, user.password))) {
    return res.status(401).json({
      message: "Invalid email and password",
    });
  }
  let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '900s',
  });
  let refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH, {
    expiresIn: '900s',
  });

  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_EXPIRES * 24 * 60 * 60 * 1000
    ),
    secure: false,
    httpOnly: true,
  };
  res.cookie("jwt", refreshToken, cookieOptions);
  res.status(200).json({
    status: "success",
    user,
    token,
  
  });
});

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ message: "You must log in" });
  }
  console.log(token)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded)

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(401).json({
      message: "The user belongig to the token doe not exist",
    });
  }
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return res.status(401).json({
      message: "User recently changed password ! please log in",
    });
  }
  req.user = currentUser;
  next();
});

const restricTo = (...roles) => {
  console.log(roles,'roles')
  return (req, res, next) => {
  console.log(req.user.user,'req')
    if (!roles.includes(req.user.role)) {
      
      return res.status(403).json({
        message: "You do not have permision to change",
      });
    }
    next();
  };
};

const forgotPassword = asyncHandler(async (req, res, next) => {
  //1)get email address
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404).json({
      message: "please enter valid email",
    });
  }
  //2)genrate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3)send it tp user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forot your password? Submit a PATCH request with your new password and
passwordConfirn to:${resetURL}.\nIf you didn't forgot your password,please
ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10min)",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      res.status(500).json({
        message: "There was an error sending the email,Try again later!",
      })
    );
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  //1)Get user based token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //2)If token has not explained, and there is user, set the new password
  if (!user) {
    return res.status(400).json({ message: "Token is invalid or has expired" });
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //3)Update changePasswordAt property for user

  //4)Log the user in,sendJWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES,
  });
  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_EXPIRES * 24 * 60 * 60 * 1000
    ),
    secure: false,
    httpOnly: true,
  };
  res.cookie("jwt", refreshToken, cookieOptions);
  res.status(200).json({
    status: "success",
    token,
  });
});

const updatePassword = asyncHandler(async (req, res) => {
  //1)Get user from collection
  const user = await User.findById(req.user.id).select("+password");
  //2)check if posted currrent pasword is correct
  if (!(await user.correctPassword(req.body.passwordConfirm, user.password))) {
    return res.status(401).json({ message: "Your current password is wrong" });
  }
  //3)If so,update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //4)Log user in ,send JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  const cookieOptins = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_EXPIRES * 24 * 60 * 60 * 1000
    ),
    secure: false,
    httpOnly: true,
  };
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES,
  });

  res.cookie("jwt", refreshToken, cookieOptins);
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,

    data: {
      user,
    },
  });
});

module.exports = {
  signup,
  login,
  protect,
  restricTo,
  forgotPassword,
  resetPassword,
  updatePassword
};
