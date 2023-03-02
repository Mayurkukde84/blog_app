const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.route('/signup').post(authController.signup)
router.route('/login').post(authController.login)
router.route('/protect').post(authController.protect)

module.exports = router