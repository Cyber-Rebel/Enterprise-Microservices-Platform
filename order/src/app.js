const express = require('express');
const CookieParser = require('cookie-parser');
const cors = require('cors');
const ordeRoute = require('./Routes/order.route.js');
const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3004', 'http://localhost:3005', 'http://localhost:3006', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));
app.use(CookieParser());

app.use('/api/orders',ordeRoute);

module.exports = app;