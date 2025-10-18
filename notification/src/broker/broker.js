const amqplib = require('amqplib')
require('dotenv').config();    
let channel ,connection

// server connect to remote rabbitmq server
async function connect() {

if(connection) return connection;
   try{ 
    connection = await amqplib.connect(process.env.RABBITMQ_URL)
    console.log("Connected to RabbitMQ")
    channel = await connection.createChannel()
   }catch(err){
    console.error("Error in connecting to RabbitMQ",err)
   }
}
// data ko queue me publish karna hae  
// data quce ke and dalna hae
// publish data to queue 
async function publishToQueue(queueName,data={}) {
    if(!channel || !connection) await connect()
      // channel create for communication
        await channel.assertQueue(queueName,{ // assertQueue queue create karne ke liye
   durable:true
})
channel.sendToQueue(queueName,Buffer.from(JSON.stringify(data))) // rebbitmq me data bhejta hae in form of buffer
console.log("Published data to queue",data)

    
}
// data ko queue se subscribe karna hae
// matlab data ko queue se lena hae
async function subscribeToQueue(queueName,cb) {
   if(!channel || !connection) await connect()
   await channel.assertQueue(queueName,{
    durable:true
   })
   channel.consume(queueName,async(msg)=>{
 if(msg!==null ){
   const data = JSON.parse(msg.content.toString())
  await cb(data)
   channel.ack(msg) // message ko acknowledge karna hae
 }
})
   
}


module.exports = {connect,channel,connection,publishToQueue,subscribeToQueue}