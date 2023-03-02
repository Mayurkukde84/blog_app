const express = require('express')
const router = express.Router()
const quoteController = require('../controllers/quoteController')
const authController = require('../controllers/authController')

router.route('/createQuote').post(quoteController.createQuote)
router.route('/getQuote').get( authController.protect ,authController.restrictTo('admin') ,quoteController.getQuote)
router.route('/updateQuote').patch(quoteController.updateQuote)
router.route('/deleteQuote').delete(quoteController.deleteQuote)

module.exports = router