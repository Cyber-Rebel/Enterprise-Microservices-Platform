const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: {
        amount: { type: Number, required: true },
        currency: {
            type: String,
            required: true,
            enum: ['USD',  'INR'] ,
            // Add more currencies as needed
            default: 'INR'
        }
    },
    seller:{
        type: mongoose.Schema.Types.ObjectId, // we can't use here ref because we don't have user model in code so only simple way 
        required: true
    },
    images:[{ // array of object of images 
        url: String,
        thumbnail:  String,
        id: String

    }
    ],
    stock:{
        type:Number,
        default:0, 
    }

});
// index ko create kya na kyu text asites serach kar paye p-1
productSchema.index({ title: 'text', description: 'text' }); // text index for search
// ese property upar aap text index create karte ho useke upar query ko fast and excutable karne ke liye

const ProductModel = mongoose.model('product', productSchema);

module.exports = ProductModel;



