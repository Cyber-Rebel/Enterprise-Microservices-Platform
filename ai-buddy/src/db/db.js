const mongoose = require('mongoose');

function connectToDB() {
    mongoose.connect(process.env.Mongodb_url).then(() => {
        console.log('Connected to MongoDB');
    }).catch(err => {
        console.error('Database connection error:', err);
    });
}


module.exports= connectToDB;
