const express = require('express')
const router = express.Router()
const quoteController = require('../controllers/quoteController')
const authController = require('../controllers/authController')
// router.use(authController.protect)
router.route('/createQuote').post(quoteController.createQuote)
router.route('/getQuote').get( authController.protect ,authController.restrictTo('user') ,quoteController.getQuote)
router.route('/updateQuote').patch(quoteController.updateQuote)
router.route('/deleteQuote').delete(quoteController.deleteQuote)
router.route('/getUser').get(quoteController.getAllUser)

module.exports = router