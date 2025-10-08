const mongoose = require('mongoose');

const addressesSchema = new mongoose.Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  zip: { type: Number },
  phone: { type: String },
  isDefault: { type: Boolean, default: false },
});

const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    items:[
        {
            productId: { type: mongoose.Schema.Types.ObjectId, required: true },
            quantity: { type: Number, default: 1,min:1 },
            price: { 
                amount: { type: Number, required: true },
                currency: { type: String, required: true, enum: ['USD', 'INR'] }
                
            }
        }
    ],
    status:{
        type:String,
        enum:["PENDING",'CONFIRMED','CANCELLED' ,'SHIPPED','DELIVERED']

    },
    totalPrice:{
        amount:{
            type:Number,
            require:true

        },
        currency:{
            type:String,
            enum:['USD','INR']

        }

    },
    shippingAddress:addressesSchema
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;