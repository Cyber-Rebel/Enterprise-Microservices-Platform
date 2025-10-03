const mongoose = require('mongoose');   

const cardSchema = new mongoose.Schema({
   user:{
    type: mongoose.Schema.Types.ObjectId, 
    required: true
   },
   iteams:[
    {
        productId: { type: mongoose.Schema.Types.ObjectId, required: true },
        quantity: { type: Number, min:1 , required: true   }
    }
   ]
               
   
}, { timestamps: true });

module.exports = mongoose.model('Card', cardSchema);    