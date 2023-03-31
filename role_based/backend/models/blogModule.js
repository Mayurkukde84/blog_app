const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    article:{
        type:String,
        
    },
    author:{
        type:String
    }
})

module.exports = mongoose.model("Blog",blogSchema)