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
const getProducts = async (req, res) => {
  const {q ,miniprice,maxprice,skip = 0,limit= 20  } = req.query;
  const filter = {};
   
  if (q){
    filter.$text = { $search: q };  

  }
  if(miniprice){
    filter['price.amount'] = {...filter['price.amount'], $gte: Number(miniprice) };

  }

  if(maxprice){ 
    filter['price.amount'] = {...filter['price.amount'], $lte: Number(maxprice) };
  }
  const products = await ProductModel.find(filter).skip(Number(skip)).limit(Math.min( Number(limit),20))
  return res.status(200).json({data:products})

}
const getProductById=  async(req,res)=>{

  const {id} = req.params;

  const product = await ProductModel.findById(id);
  if(!product){
    return res.status(404).json({message:'Product not found'})
  }
  return res.status(200).json({product:product})


}

module.exports = { createProduct ,getProducts,getProductById };