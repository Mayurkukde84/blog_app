require('dotenv').config()
const express = require('express')
const { default: mongoose } = require('mongoose')
const app = express()
const path = require('path')
const connectDB = require('./config/connectDb')

const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
PORT = process.env.PORT
mongoose.set("strictQuery",true)
connectDB()
app.use('/',express.static(path.join(__dirname,'public')))
app.use('/',require('./routes/root'))
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(cookieParser())
app.use('/api/v1',require('./routes/quoteRoutes'))
app.use('/api/v1/auth',require('./routes/authRoutes'))

app.use('*',(req,res)=>{
   res.status(404)
   if(req.accepts('html')){
    res.sendFile(path.join(__dirname,'views','404.html'))
   }else if(req.accepts('json')){
    res.json({message:'404 Not FOund'})
   }else{
    res.type('txt').send('404 Not FOund')
   }
})

mongoose.connection.once('open',()=>{
    console.log('mongodb is connected')
    app.listen(PORT,()=>{
        console.log(`server is running on ${PORT}`)
    })
})
mongoose.connection.on('err',err=>{
    console.log(err)
})

