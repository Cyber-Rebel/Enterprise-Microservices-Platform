const app = require('./src/app');
require('dotenv').config();

const DatabaseConnection = require('./src/db/db');
const listen = require('./src/broker/lister.js');
const {connect} = require('./src/broker/broker.js');

// Connect to the database
DatabaseConnection();
connect().then(() => {
    console.log('Connected to the message broker');
    listen();
}).catch((error) => {
    console.error('Failed to connect to the message broker:', error);
});




app.listen(3007, () => {    
    console.log(`Server is running on port 3007`);
    console.log(`API is available at http://localhost:3007/api`);
})