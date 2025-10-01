const request = require('supertest');

// Mock uploadImage and auth middleware before requiring app
jest.mock('../src/serviecs/uploadImage.js', () => jest.fn());
jest.mock('../src/middlewares/auth.middlewares.js', () => ({
  createauthMiddleware: () => (req, res, next) => {
    req.user = { id: 'seller123', role: 'seller' };
    next();
  }
}));

// Mock ProductModel with required methods
jest.mock('../src/Models/product.model.js', () => ({
  findById: jest.fn(),
  deleteOne: jest.fn(),
  find: jest.fn()
}));

const ProductModel = require('../src/Models/product.model.js');
const app = require('../src/index.js');

describe('DELETE /api/products/:id', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('returns 200 on successful delete', async () => {
    const product = { _id: 'p1', seller: 'seller123' };
    ProductModel.findById.mockResolvedValue(product);
    ProductModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

    const res = await request(app).delete('/api/products/p1');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Product deleted');
    expect(ProductModel.deleteOne).toHaveBeenCalledWith({ _id: 'p1' });
  });

  test('returns 404 when product not found', async () => {
    ProductModel.findById.mockResolvedValue(null);

    const res = await request(app).delete('/api/products/notfound');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Product not found');
  });

  test('returns 403 when requester not seller', async () => {
    const product = { _id: 'p2', seller: 'otherSeller' };
    ProductModel.findById.mockResolvedValue(product);

    const res = await request(app).delete('/api/products/p2');

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('message', 'Forbidden: You are not the seller of this product');
  });

  test('returns 500 on DB error', async () => {
    ProductModel.findById.mockRejectedValue(new Error('DB failure'));

    const res = await request(app).delete('/api/products/p3');

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message', 'Internal server error');
  });
});

describe('GET /api/products/seller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('returns products for seller', async () => {
    const products = [{ _id: 'a1' }, { _id: 'a2' }];
    ProductModel.find.mockResolvedValue(products);

    const res = await request(app).get('/api/products/seller');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('products');
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body.products).toHaveLength(2);
  });

  test('returns empty array when seller has no products', async () => {
    ProductModel.find.mockResolvedValue([]);

    const res = await request(app).get('/api/products/seller');

    expect(res.statusCode).toBe(200);
    expect(res.body.products).toEqual([]);
  });

  test('returns 500 on DB error', async () => {
    ProductModel.find.mockRejectedValue(new Error('DB failure'));

    const res = await request(app).get('/api/products/seller');

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message', 'Internal server error');
  });
});
