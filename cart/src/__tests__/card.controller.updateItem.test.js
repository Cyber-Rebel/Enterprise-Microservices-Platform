const CardController = require('../controller/card.controller');

jest.mock('../model/card.model.js', () => {
  const mSave = jest.fn();
  const mockModel = function (data) {
    this.user = data.user;
    this.iteams = data.iteams;
    this.save = mSave;
  };
  mockModel.findOne = jest.fn();
  mockModel.prototype.save = mSave;
  return mockModel;
});

const CardModel = require('../model/card.model.js');

describe('CardController.updateItemQuantity', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('updates quantity when item exists', async () => {
    const item = { productId: { toString: () => 'prod1' }, quantity: 2 };
    const fakeCart = { user: 'uid1', iteams: [item], save: jest.fn() };
    CardModel.findOne.mockResolvedValue(fakeCart);

    const req = { user: { _id: 'uid1' }, params: { productId: 'prod1' }, body: { qty: 5 } };
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status };

    await CardController.updateItemQuantity(req, res);

    expect(CardModel.findOne).toHaveBeenCalledWith({ user: req.user._id });
    expect(fakeCart.iteams[0].quantity).toBe(5);
    expect(fakeCart.save).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Item quantity updated', cart: fakeCart }));
  });

  test('returns 404 when cart not found', async () => {
    CardModel.findOne.mockResolvedValue(null);

    const req = { user: { _id: 'uidX' }, params: { productId: 'prodX' }, body: { qty: 1 } };
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status };

    await CardController.updateItemQuantity(req, res);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ message: 'Cart not found' });
  });

  test('returns 404 when item not found in cart', async () => {
    const fakeCart = { user: 'uid1', iteams: [], save: jest.fn() };
    CardModel.findOne.mockResolvedValue(fakeCart);

    const req = { user: { _id: 'uid1' }, params: { productId: 'missing' }, body: { qty: 2 } };
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status };

    await CardController.updateItemQuantity(req, res);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ message: 'Item not found in cart' });
  });
});
