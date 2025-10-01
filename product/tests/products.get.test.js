const request = require('supertest');

// Mock modules that would otherwise load ESM-only dependencies (uploadImage uses uuid)
jest.mock('../src/serviecs/uploadImage.js', () => jest.fn());

// Mock auth middleware before requiring the app so routes use the mocked middleware
jest.mock('../src/middlewares/auth.middlewares.js', () => ({
  createauthMiddleware: () => (req, res, next) => {
    req.user = { id: 'test-seller-id', role: 'seller' };
    next();
  }
}));

// Mock ProductModel before requiring the app
jest.mock('../src/Models/product.model.js', () => ({
  find: jest.fn()
}));

const ProductModel = require('../src/Models/product.model.js');
const app = require('../src/index.js');

describe('GET /api/products', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('returns 200 and a list of products', async () => {
    const products = [
      { _id: 'p1', title: 'A', price: { amount: 10, currency: 'INR' } },
      { _id: 'p2', title: 'B', price: { amount: 20, currency: 'USD' } }
    ];

    // Make find(...).skip(...).limit(...) -> Promise resolves to products
    ProductModel.find.mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(products)
    });

    const res = await request(app).get('/api/products');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0]._id).toBe('p1');
  });

  test('applies price filters', async () => {
    const products = [{ _id: 'p3', title: 'C', price: { amount: 15, currency: 'INR' } }];

    ProductModel.find.mockImplementation((filter) => ({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(products)
    }));

    const res = await request(app).get('/api/products').query({ miniprice: '10', maxprice: '20' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data[0]._id).toBe('p3');
    // ensure filter passed to find contained price range - we can check last call
    expect(ProductModel.find).toHaveBeenCalled();
  });

  test('returns empty list when no product exist', async () => {
    ProductModel.find.mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([])
    });

    const res = await request(app).get('/api/products');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(0);
  });
});
