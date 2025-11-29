const express = require('express');
const productsRouter = require('./routes/products.router.js');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');


const app = express();
app.use(morgan('dev')); 
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3004', 'http://localhost:3005', 'http://localhost:3006', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
// stocks remain i  post method 

app.use('/api/products', productsRouter);


module.exports = app;