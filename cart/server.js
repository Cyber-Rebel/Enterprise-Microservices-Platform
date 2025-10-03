const app = require('./src/app.js')
const PORT = process.env.PORT || 3002
const connectDB = require('./src/db/db.js')
require('dotenv').config();
// Connect to the database
connectDB();





app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});