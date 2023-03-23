const User = require('../models/userModel')
const asyncHandler= require('express-async-handler')

const createUser = asyncHandler(async(req,res)=>{
   const {username,email,password,passwordConfirm,role} = req.body
    const user = await User.create({
        username,
        email,
        password,
        passwordConfirm,
        role
    })

    res.status(200).json({
        status:'success',
        data:{
            user
        }
    })
})

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
    const user = User.findByIdAndUpdate(req.params,req.body,{
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
    const user = User.findByIdAndDelete(req.params)
    res.status(200).json({
        status:'success',
        message:'user is deleted'
    })
})
module.exports = {
    createUser,
    getUser,
    userDelete,
    userEdit
}