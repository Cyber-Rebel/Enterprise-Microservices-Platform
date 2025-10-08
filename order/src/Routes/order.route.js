const express = require('express');
const orderController=require('../Controller/order.controller.js');
const createAuthMiddleware = require('../middlewares/auth.middlewares.js');
const router= express.Router(); 

router.post('/', createAuthMiddleware([ "user" ]), orderController.createOrder);
router.get('/me', createAuthMiddleware([ "admin" ]), orderController.getAllOrders);
router.post('/:id/cancel', createAuthMiddleware([ "user" ]), orderController.cancelOrder);
router.patch('/:id/address', createAuthMiddleware([ "user", "admin" ]), orderController.updateOrderAddress);
router.get('/:id', createAuthMiddleware([ "user", "admin" ]), orderController.getOrderById);

module.exports = router;
