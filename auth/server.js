require('dotenv').config()
const PORT = process.env.PORT
const app = require('./src/index.js')
const ConnectdDabse = require('./src/db/db.js');
const { connect } = require('./src/broker/broker.js');
ConnectdDabse();
connect();



app.listen(PORT,  () => {
    console.log(`Server is running on port ${PORT}`)
})