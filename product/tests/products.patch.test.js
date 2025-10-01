const request = require('supertest');

// Mock uploadImage and auth middleware before requiring app
jest.mock('../src/serviecs/uploadImage.js', () => jest.fn());
jest.mock('../src/middlewares/auth.middlewares.js', () => ({
  createauthMiddleware: () => (req, res, next) => {
    req.user = { id: 'seller123', role: 'seller' };
    next();
  }
}));

// Mock ProductModel
jest.mock('../src/Models/product.model.js', () => ({
  findById: jest.fn()
}));

const ProductModel = require('../src/Models/product.model.js');
const app = require('../src/index.js');

describe('PATCH /api/products/:id', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('returns 200 and updated product on success', async () => {
    const product = {
      _id: 'p1',
      title: 'Old',
      description: 'd',
      price: { amount: 5, currency: 'INR' },
      seller: 'seller123',
      save: jest.fn().mockResolvedValue({ _id: 'p1', title: 'New', price: { amount: 5, currency: 'INR' }, seller: 'seller123' })
    };

    ProductModel.findById.mockResolvedValue(product);

    const res = await request(app)
      .patch('/api/products/p1')
      .send({ title: 'New' })
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Product updated');
    expect(res.body.product).toBeDefined();
    expect(res.body.product.title).toBe('New');
  });

  test('returns 404 when product not found', async () => {
    ProductModel.findById.mockResolvedValue(null);

    const res = await request(app).patch('/api/products/notfound').send({ title: 'x' });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Product not found');
  });

  test('returns 403 when requester is not the seller', async () => {
    const product = {
      _id: 'p2',
      title: 'Other',
      seller: 'anotherSeller',
      save: jest.fn()
    };
    ProductModel.findById.mockResolvedValue(product);

    const res = await request(app).patch('/api/products/p2').send({ title: 'attempt' });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('message', 'Forbidden: You are not the seller of this product');
  });

  test('returns 500 when DB throws', async () => {
    ProductModel.findById.mockRejectedValue(new Error('DB failure'));

    const res = await request(app).patch('/api/products/p3').send({ title: 'x' });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message', 'Internal server error');
  });
});
