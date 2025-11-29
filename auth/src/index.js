const express = require('express')
const app =  express()
const cookieParser = require('cookie-parser')
const auth = require('./router/auth.router.js')
const cors = require('cors')
app.use(cookieParser())
app.use(cors({
  origin: ['http://localhost:3004', 'http://localhost:3005', 'http://localhost:3006', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}))
app.use(express.json())

app.use('/api/auth',auth)




module.exports = app