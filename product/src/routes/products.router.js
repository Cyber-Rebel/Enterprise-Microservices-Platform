const express = require('express');
const router= express.Router();
const { createProductValidation } = require('../middlewares/product.validation.js');
const productController= require('../controllers/products.controller.js');
const multer  = require('multer');
const { createauthMiddleware } = require('../middlewares/auth.middlewares.js');
const upload = multer({storage: multer.memoryStorage()}); // Store files in memory for simplicity

// Validation rules are moved to middleware: ../middlewares/product.validation.js

router.post('/', createauthMiddleware(['admin','seller']), upload.array('images', 5), createProductValidation, productController.createProduct );
// router.get('/')

module.exports = router;