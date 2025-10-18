const express = require('express')
const app = express()
const{connect}=require('./broker/broker.js')
const listen = require('./broker/listern.js')

connect().then(()=>{
    console.log("Broker connected, starting the app")
    listen() // start listening to the queue
}).catch((err)=>{
    console.error("Error in connecting broker",err)
})   
app.get('/',(req,res)=>{
    res.send("Notification Service is up and running")
})

module.exports = app