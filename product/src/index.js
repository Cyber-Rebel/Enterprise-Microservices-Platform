const express = require('express');
const productsRouter = require('./routes/products.router.js');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');


const app = express();
app.use(morgan('dev')); 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// stocks remain i  post method 

app.use('/api/products', productsRouter);


module.exports = app;