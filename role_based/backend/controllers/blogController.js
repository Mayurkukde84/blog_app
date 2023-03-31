const Blog = require("../models/blogModule");
const asyncHandler = require("express-async-handler");
const createBlog = asyncHandler(async (req, res) => {
  const { article, author } = req.body;

  const blog = await Blog.create({
    article,
    author,
  });

  res.status(200).json({
    status: "success",
    blog,
  });
});

const getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.find();
  res.status(200).json({
    status: "success",
    blog,
  });
});

const getBlogId = asyncHandler(async(req,res)=>{
    const blog = await Blog.findById(req.params.id)
    res.status(200).json({
        status:"success",
        blog
    })
})

const deleteBlog = asyncHandler(async(req,res)=>{
    const blog =await Blog.findByIdAndDelete(req.params.id)
    res.status(200).json({
        status:'success',
        blog
    })
})

const updateBlog = asyncHandler(async(req,res)=>{
    const blog = await Blog.findByIdAndUpdate(req.params.id,req.body,{
        new:true
    })
    res.status(200).json({
        status:'success',
        blog
    })
})
module.exports = {
  createBlog,
  getBlog,
  getBlogId,
  deleteBlog,
  updateBlog
};
