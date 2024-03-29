const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.route('/signup').post(authController.signup)
router.route('/login').post(authController.login)
router.route('/protect').post(authController.protect)
router.route('/forgotPassword').post(authController.forgotPassword)
 router.route('/resetPassword/:token').patch(authController.resetPassword)
router.route('/updateMyPassword').patch(authController.updatePassword)
router.route('/refresh').get(authController.handleRefreshToken)
module.exports = router