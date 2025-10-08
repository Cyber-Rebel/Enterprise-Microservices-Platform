const app = require('./src/app');
require('dotenv').config();
const PORT = process.env.PORT || 3004;
const db = require('./src/db/db.js')
db();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});