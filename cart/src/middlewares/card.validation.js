const { body, param, validationResult } = require('express-validator');

const validateAddItem = [
  body('productId')
    .exists().withMessage('productId is required')
    .isString().withMessage('productId must be a string')
    .notEmpty().withMessage('productId cannot be empty'),
  body('quantity')
    .exists().withMessage('quantity is required')
    .isInt({ gt: 0 }).withMessage('quantity must be an integer greater than 0'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  }
];

const validateUpdateItemQuantity = [
  param('productId')
    .exists().withMessage('productId param is required')
    .isString().withMessage('productId must be a string')
    .notEmpty().withMessage('productId cannot be empty'),
  body('qty')
    .exists().withMessage('qty is required')
    .isInt({ gt: 0 }).withMessage('qty must be an integer greater than 0'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateAddItem, validateUpdateItemQuantity };
