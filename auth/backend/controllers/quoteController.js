const Quote = require("../model/quoteModel");
const User = require('../model/userModel')
const asyncHandler = require("express-async-handler");

const createQuote = asyncHandler(async (req, res) => {
  const { quote, author } = req.body;
  const quoteData = await Quote.create({
    quote,
    author,
  });
  res.status(200).json({
    status: "success",
    data: {
      quoteData,
    },
  });
});

const getQuote = asyncHandler(async (req, res) => {
  const quoteData = await Quote.find().lean().exec();
  res.status(200).json({
    status: "success",
    data: {
      quoteData,
    },
  });
});

const updateQuote = asyncHandler(async (req, res) => {
  const updateQuote = await Quote.findByIdAndUpdate(req.body.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      updateQuote,
    },
  });
});

const deleteQuote = asyncHandler(async(req,res)=>{
    const delQuote = await Quote.findByIdAndDelete({_id:req.body.id})
    res.status(200).json({
        status:"success",
        message:
            `${delQuote.author} deleted`
        
    })
})

const getAllUser = asyncHandler(async(req,res)=>{
     const findUser = await User.find({role:"user"}).exec()
     res.status(200).json(findUser)
})
module.exports = {
  createQuote,
  getQuote,
  updateQuote,
  deleteQuote,
  getAllUser
};
