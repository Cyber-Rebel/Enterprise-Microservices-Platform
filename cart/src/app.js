const express = require('express'); 
const CardRouter= require('./routes/card.routes.js')
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors())
app.use(cookieParser()); 

app.use('/api/carts', CardRouter);


module.exports = app;





