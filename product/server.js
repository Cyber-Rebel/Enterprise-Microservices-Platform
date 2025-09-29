const app = require('./src/index.js');
require('dotenv').config();
const connectDB = require('./src/db/db.js');    
connectDB()


app.listen(3001 ,() => {
  console.log(`Server is running on port ${3001}`);
});


