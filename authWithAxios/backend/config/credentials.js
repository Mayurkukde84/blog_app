const allowedOrigins = require('./allowedOrigins')


const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    console.log(origin,'origin')
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = credentials