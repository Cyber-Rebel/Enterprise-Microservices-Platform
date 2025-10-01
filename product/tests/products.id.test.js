const request = require('supertest');

// Mock modules before requiring app
jest.mock('../src/serviecs/uploadImage.js', () => jest.fn());
jest.mock('../src/middlewares/auth.middlewares.js', () => ({
  createauthMiddleware: () => (req, res, next) => {
    req.user = { id: 'test-seller-id', role: 'seller' };
    next();
  }
}));

// Mock ProductModel and its findById
jest.mock('../src/Models/product.model.js', () => ({
  findById: jest.fn()
}));

const ProductModel = require('../src/Models/product.model.js');
const app = require('../src/index.js');

describe('GET /api/products/:id', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('returns product when found', async () => {
    const product = { _id: 'p1', title: 'Found Product' };
    ProductModel.findById.mockResolvedValue(product);

    const res = await request(app).get('/api/products/p1');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('product');
    expect(res.body.product._id).toBe('p1');
  });

  test('returns 404 when product not found', async () => {
    ProductModel.findById.mockResolvedValue(null);

    const res = await request(app).get('/api/products/nonexistent');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Product not found');
  });
});
