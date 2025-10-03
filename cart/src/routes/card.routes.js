const express = require('express');
const router = express.Router();
const  cardMiddleware = require('../middlewares/auth.middlewares.js');
const cardController = require('../controller/card.controller.js');
const { validateAddItem, validateUpdateItemQuantity } = require('../middlewares/card.validation.js');
router.get('/',cardMiddleware(['user']),cardController.getCard);
router.post('/items', cardMiddleware(['user']), validateAddItem, cardController.addItemToCard);
router.patch('/items/:productId', cardMiddleware(['user']), validateUpdateItemQuantity, cardController.updateItemQuantity);
module.exports = router;