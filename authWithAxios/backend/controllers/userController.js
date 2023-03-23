const User = require('../models/userModel')
const asyncHandler= require('express-async-handler')



const getUser = asyncHandler(async(req,res)=>{
    const user = await User.find()

    res.status(200).json({
        status:'success',
        data:{
            user
        }
    })
})

const userEdit = asyncHandler(async(req,res)=>{
    const user =await User.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        status:'sucess',
        data:{
            user
        }
    })
})

const userDelete = asyncHandler(async(req,res)=>{
    const user = await User.findByIdAndDelete(req.params.id)
    res.status(200).json({
        status:'success',
        message:'user is deleted'
    })
})
module.exports = {
  
    getUser,
    userDelete,
    userEdit
}