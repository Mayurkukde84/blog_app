const express = require('express')
const router = express.Router()
const quoteController = require('../controllers/quoteController')

router.route('/createQuote').post(quoteController.createQuote)
router.route('/getQuote').get(quoteController.getQuote)
router.route('/updateQuote').patch(quoteController.updateQuote)
router.route('/deleteQuote').delete(quoteController.deleteQuote)

module.exports = router