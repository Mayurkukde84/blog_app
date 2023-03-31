const express = require('express')
const router = express.Router()
const refreshToken = require('../controllers/refreshToken')

router.route('/refresh').get(refreshToken.handleRefreshToken)

module.exports = router