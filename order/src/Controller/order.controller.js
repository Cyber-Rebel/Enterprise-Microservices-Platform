
const orderModel = require("../Model/order.model.js");
const axios = require('axios');
const {publishToQueue} = require('../broker/broker.js')
// Create a new order
const  createOrder = async (req, res) => {

  const user = req.user;
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  try {
    // fetch user cart from cart service
    const cartResponse = await axios.get('http://localhost:3002/api/carts', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Cart service might return `card` with `iteams` (typos) or `cart` with `items`.
    const cartData = cartResponse?.data?.card || cartResponse?.data?.cart || cartResponse?.data;
    const cartItems = cartData?.iteams || cartData?.items || [];

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Fetch product details for each cart item
    const products = await Promise.all(
      cartItems.map(async (item) => {
        const resp = await axios.get(`http://localhost:3001/api/products/${item.productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // product service may nest data differently; support possible shapes
        return resp?.data?.data || resp?.data?.product || resp?.data;
      })
    );

    let priceAmount = 0;

    // Build order items with defensive checks
    const orderItems = cartItems.map((item) => {
      const product = products.find((p) => (p._id ? p._id.toString() === item.productId.toString() : false)) || products.find((p) => p.id === item.productId) || products[0];

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      if (typeof product.stock !== 'undefined' && product.stock < item.quantity) {
        throw new Error(`Product ${product.title || product.name || product._id} is out of stock or insufficient stock`);
      }

      const unitPrice = product.price?.amount ?? product.price ?? 0;
      const itemTotal = unitPrice * item.quantity;
      priceAmount += itemTotal;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: {
          amount: itemTotal,
          currency: product.price?.currency || 'INR',
        },
      };
    });

    const order = await orderModel.create({
      user: user.id,
      items: orderItems,
      status: 'PENDING',
      totalPrice: {
        amount: priceAmount,
        currency: 'INR',
      },
      shippingAddress: {
        street: req.body.shippingAddress?.street,
        city: req.body.shippingAddress?.city,
        state: req.body.shippingAddress?.state,
        zip: req.body.shippingAddress?.pincode,
        country: req.body.shippingAddress?.country,
      },
    });

    // publish order created event to rabbitmq
    publishToQueue('ORDER_SELLER_DASHBOARD.ORDER_CREATED', order);

    res.status(201).json({ order });
  } catch (error) {
    console.error('Error creating order:', error);
    const message = error?.response?.data?.message || error.message || 'Internal server error';
    res.status(500).json({ message });
  }
};


  const getAllOrders = async (req, res) => {
  const user = req.user;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try{

    const orders = await orderModel.find({user:user.id}).skip(skip).limit(limit).exec();
         const totalOrders = await orderModel.countDocuments({ user: user.id });
 

    res.status(200).json({
      orders,
      meta:{
        total:totalOrders,
        page,
        limit
      }

    });


  }catch(err){
    console.log("Get order error ",err);
    res.status(500).json({message:"Internal server error"})
  }

}
const getOrderById = async (req, res) => {
const user = req.user;
    const orderId = req.params.id;
    try{
      const order = await orderModel.findById(orderId)
      if(!order){
        return res.status(404).json({message:"Order not found"})
      }
      // check user is valid or not 
      if(order.user.toString() !== user.id){
        return res.status(403).json({message:"Forbidden: You do not have access to this order"})
      }

      res.status(200).json({order});

    }catch(err){
      console.log("Get order by id error ",err);  
      res.status(500).json({message:"Internal server error"})
    }




}
 
const cancelOrder = async (req, res) => {
  const user = req.user;
  const orderId = req.params.id;
  try{
    const order = await orderModel.findById(orderId);
    if(!order){
      return res.status(404).json({message:"Order not found"})
    }
    // check user is valid or not 
      if(order.user.toString() !== user.id){
      return res.status(403).json({message:"Forbidden: You do not have access to this order"})
    }
    // only pending orders can be cancelled
    if(order.status !== "PENDING"){
      return res.status(400).json({message:"Only pending orders can be cancelled"})
    }
    order.status = "CANCELLED";
    await order.save();
    res.status(200).json({message:"Order cancelled successfully",order});

  }catch(err){
    console.log("Cancel order error ",err);
    res.status(500).json({message:"Internal server error"})
  }
} 
const updateOrderAddress = async (req, res) => {
  const user = req.user;
  const orderId = req.params.id;
  try{
    const order = await orderModel.findById(orderId);
    
     if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
   if (order.user.toString() !== user.id) {
            return res.status(403).json({ message: "Forbidden: You do not have access to this order" });
        }
        // only PENDING orders can have address updated

        if (order.status !== "PENDING") {
         return  res.status(400).json({ message: "Only PENDING orders can have address updated" });
            
        }
        order.shippingAddress = {
            street: req.body.shippingAddress.street,
            city: req.body.shippingAddress.city,
            state: req.body.shippingAddress.state,
            zip: req.body.shippingAddress.pincode,
            country: req.body.shippingAddress.country,

        }
await order.save();
res.status(200).json({ message: "Order address updated successfully", order });

  }catch(err){
 console.log("Error when update order address", err);
 res.status(500).json({ message: "Internal server error", error: err.message });
    
  }
}

module.exports = { createOrder ,getAllOrders,getOrderById,cancelOrder,updateOrderAddress};