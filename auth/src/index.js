const express = require('express')
const app =  express()
const cookieParser = require('cookie-parser')
const auth = require('./router/auth.router.js')
const cors = require('cors')
app.use(cookieParser())
app.use(cors())
app.use(express.json())

app.use('/api/auth',auth)




module.exports = app