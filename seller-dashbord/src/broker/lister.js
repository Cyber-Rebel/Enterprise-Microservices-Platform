const {subscribeToQueue} = require('./broker.js')
const userModel = require('../models/user.models.js');
const productModel = require('../models/product.model.js');
const orderModel = require('../models/order.model.js');

module.exports = async function () { 
subscribeToQueue('AUTH_SELLER_DASHBOARD.USER_CREATED', async (user) => {
    console.log('Received message in AUTH_SELLER_DASHBOARD.USER_CREATED queue:', user);
    // Save the user to the database 
    await userModel.create(user);
});


subscribeToQueue('PRODUCT_CREATED',async (product) => {
    console.log('Received message in PRODUCT_CREATED queue:', product);
    // Save the product to the database 
    await productModel.create(product);

})
subscribeToQueue('ORDER_SELLER_DASHBOARD.ORDER_CREATED',async (order) => {
    console.log('Received message in ORDER_SELLER_DASHBOARD.ORDER_CREATED queue:', order);
    // Save the order to the database
    await orderModel.create(order);

})


    
}