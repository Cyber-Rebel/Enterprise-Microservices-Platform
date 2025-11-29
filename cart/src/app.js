const express = require('express'); 
const CardRouter= require('./routes/card.routes.js')
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3004','http://localhost:3005','http://localhost:3006','http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}))
app.use(cookieParser()); 

app.use('/api/carts', CardRouter);


module.exports = app;





