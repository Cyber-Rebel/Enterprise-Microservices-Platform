const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { // agar error nahi hae to true hoga !true ki value false hogi but agar error hoga to !false ki value true hogi
    return res.status(400).json({ message: 'validation error', errors: errors.array() });
  }
  next();
};

const createProductValidation = [
  body('title').isString().withMessage('title must be a string').notEmpty().withMessage('title is required'),
  body('description').optional().isString().withMessage('description must be a string').isLength({ max: 500 }).withMessage('description too long'),
  body('priceAmount').notEmpty().withMessage('priceAmount is required').bail().isFloat({ gt: 0 }).withMessage('priceAmount must be a number greater than 0'),
  body('priceCurrency').optional().isIn(['USD', 'INR']).withMessage('priceCurrency must be USD or INR'),
  handleValidation, 
];

module.exports = { createProductValidation  };
