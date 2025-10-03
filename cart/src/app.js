const express = require('express'); 
const CardRouter= require('./routes/card.routes.js')
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(cookieParser()); 

app.use('/api/cards', CardRouter);


module.exports = app;





