const mongoose = require('mongoose')

const quoteSchema = new mongoose.Schema({
    quote:{
        type:String,
        require:[true,"Please enter you quote"]
    },
    author:{
        type:String,
        required:[true,'Please ebter author name']
    }
})

module.exports = mongoose.model('Quotes',quoteSchema)