require("dotenv").config();
const express = require("express");
const app = express();
const path = require('path')
const PORT = process.env.PORT;
const connectdb = require('./config/connectdb')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use('/',express.static(path.join(__dirname,'public')))
app.use('/',require('./routes/root'))
app.use('*',(req,res)=>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'))
    }else if(req.accepts('json')){
        res.json({message:'404 Not Found'})
    }else{
        res.type('txt').send('404 Not found')
    }
})
connectdb()
mongoose.connection.on('open',()=>{
    console.log('mongodb is connected')
    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
      });
})

mongoose.connection.on('err',err=>{
console.log(err)
})

