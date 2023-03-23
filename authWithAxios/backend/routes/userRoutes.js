const express = require('express')
const userController = require('../controllers/userController')
const router = express.Router()

router.route('/')
    .get(userController.getUser)
   

router.route('/:id')
    .patch(userController.userEdit)
    .delete(userController.userDelete)

module.exports = router