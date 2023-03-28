const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require('../models/userModel')
const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });
  
    const refreshToken = cookies.jwt;
  console.log(refreshToken,'refresh')
    const decoded = await promisify(jwt.verify)(
      refreshToken,
      process.env.JWT_REFRESH
    );
  
    const currentUser = await User.findById(decoded.id);
    console.log(currentUser);
  
    let token = jwt.sign({ id: currentUser._id }, process.env.JWT_SECRET, {
      expiresIn: '90s',
    });
    console.log(token)
    res.json({ token });
  };

  module.exports ={handleRefreshToken} 