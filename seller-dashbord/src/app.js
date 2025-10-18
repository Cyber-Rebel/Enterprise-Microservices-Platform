const express= require('express');
const app = express();
const cookieParser = require('cookie-parser');
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser())



module.exports = app