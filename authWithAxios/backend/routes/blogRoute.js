const express = require('express')
const router = express.Router()
const blogController = require('../controllers/blogController')

router.route('/')
.post(blogController.createBlog)
.get(blogController.getBlog)

router.route('/:id')
.get(blogController.getBlogId)
.delete(blogController.deleteBlog)
.patch(blogController.updateBlog)

module.exports = router