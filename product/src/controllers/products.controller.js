const { validationResult } = require('express-validator');
const ProductModel = require('../Models/product.model.js');
const uploadImage = require('../serviecs/uploadImage.js');

const createProduct = async (req, res) => {
  try {
    // check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, priceAmount, priceCurrency = 'INR' } = req.body;

    const seller = req.user && req.user.id;
    if (!seller) {
      return res.status(401).json({ message: 'Unauthorized: seller not found' });
    }

    const price = {
      amount: Number(priceAmount),
      currency: priceCurrency,
    };
    // console.log('the price', req.files);

    // upload images (if any) and collect results
    let images = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => uploadImage({ file: file.buffer }));
      // uploadImage returns a promise that resolves to the result from imagekit
      const uploadResults = await Promise.all(uploadPromises);
      images = uploadResults.map((r) => ({ url: r.url, thumbnail: r.thumbnailUrl, id: r.fileId }));
    
    }

    // create and save product
    const product = new ProductModel({
      title,
      description,
      price,
      seller,
      images,
    });

    const saved = await product.save();

    return res.status(201).json({ message: 'Product created', product: saved });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createProduct };