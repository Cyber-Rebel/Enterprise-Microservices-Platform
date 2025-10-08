const express = require('express');
const CookieParser = require('cookie-parser');
const ordeRoute = require('./Routes/order.route.js');
const app = express();
app.use(express.json());
app.use(CookieParser());

app.use('/api/orders',ordeRoute);

module.exports = app;