const express= require('express');
const app = express();
const cookieParser = require('cookie-parser');
const sellerRouter = require("./router/router.js")
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser())
// Sample route to verify server is running sabhi me server ko chalana ki liye cheak karte ahe 
app.get('/', (req, res) => {
    res.status(200).send('Seller Service is running api');
});
app.use('/api/seller/dashbord',sellerRouter)


module.exports = app