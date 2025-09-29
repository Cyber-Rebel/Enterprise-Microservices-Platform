const request = require('supertest');
// Mock ProductModel and uploadImage with factories so Jest doesn't load original modules
jest.mock('../src/Models/product.model.js', () => jest.fn());
jest.mock('../src/serviecs/uploadImage.js', () => jest.fn());

// Mock auth middleware before requiring the app so routes use the mocked middleware
jest.mock('../src/middlewares/auth.middlewares.js', () => ({
  createauthMiddleware: () => (req, res, next) => {
    req.user = { id: 'test-seller-id', role: 'seller' };
    next();
  }
}));

const ProductModel = require('../src/Models/product.model.js');
const uploadImage = require('../src/serviecs/uploadImage.js');

// Bring in the app (after middleware mocks)
const app = require('../src/index.js');

describe('POST /api/products', () => {
  beforeEach(() => {
    // reset mocks
    jest.resetAllMocks();
  });

  test('returns 400 when required fields missing', async () => {
    const res = await request(app)
      .post('/api/products')
      .field('description', 'No title and price');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  test('creates product when valid input provided', async () => {
    // Mock uploadImage to return a fake result
    uploadImage.mockImplementation(async ({ file }) => ({ url: 'https://example.com/img.jpg', thumbnail: 'https://example.com/thumb.jpg', fileId: 'file123' }));

    // Mock ProductModel to simulate save
    const savedProduct = { _id: 'prod1', title: 'OK', description: 'd', price: { amount: 10, currency: 'INR' }, seller: 'test-seller-id', images: [{ url: 'https://example.com/img.jpg' }] };
    ProductModel.mockImplementation(function (data) {
      return {
        save: jest.fn().mockResolvedValue(savedProduct)
      };
    });

    const res = await request(app)
      .post('/api/products')
      .field('title', 'Test Product')
      .field('priceAmount', '10')
      .field('priceCurrency', 'INR')
      .attach('images', Buffer.from('fake image'), 'test.jpg');

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('product');
    expect(res.body.product.title).toBe(savedProduct.title);
  });
});
