const app = require('./src/app');
require('dotenv').config();
const PORT = process.env.PORT || 3004;
const db = require('./src/db/db.js')
const {connect } = require('./src/broker/broker.js')

db();
connect().then(()=>{
  console.log("Broker connected, starting the app")
}).catch((error)=>{
  console.log("Error connecting to RabbitMQ",error);
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});