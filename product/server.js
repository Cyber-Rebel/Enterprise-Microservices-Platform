const app = require('./src/index.js');
require('dotenv').config();
const connectDB = require('./src/db/db.js');    
const {connect}= require('./src/broker/broker.js')
connectDB()
connect().then(()=>{
  console.log("Broker connected, starting the app")
}).catch((error)=>{
  console.log("Error connecting to RabbitMQ",error);
})


app.listen(3001 ,() => {
  console.log(`Server is running on port ${3001}`);
});


