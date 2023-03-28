const express = require('express')
const userController = require('../controllers/userController')
const router = express.Router()
const authController = require('../controllers/authController')

router.route('/')
    .get(authController.restricTo('user'),userController.getUser)
   

router.route('/:id')
    .patch(userController.userEdit)
    .delete(userController.userDelete)

module.exports = router