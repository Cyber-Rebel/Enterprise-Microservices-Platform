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

describe('CardController.addItemToCard', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('increments quantity when item already exists in cart', async () => {
    const existingItem = { productId: { toString: () => 'prod1' }, quantity: 2 };
    const fakeCard = { user: 'uid1', iteams: [existingItem], save: jest.fn() };
    CardModel.findOne.mockResolvedValue(fakeCard);

    const req = { user: { _id: 'uid1' }, body: { productId: 'prod1', quantity: 3 } };
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status };

    await CardController.addItemToCard(req, res);

    expect(CardModel.findOne).toHaveBeenCalledWith({ user: req.user._1d || req.user._id });
    // existingItem quantity should be incremented
    expect(fakeCard.iteams[0].quantity).toBe(5);
    expect(fakeCard.save).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Item added to card', card: fakeCard }));
  });

  test('adds new item when item does not exist in cart', async () => {
    const fakeCard = { user: 'uid1', iteams: [], save: jest.fn() };
    CardModel.findOne.mockResolvedValue(fakeCard);

    const req = { user: { _id: 'uid1' }, body: { productId: 'prod2', quantity: 4 } };
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status };

    await CardController.addItemToCard(req, res);

    expect(CardModel.findOne).toHaveBeenCalledWith({ user: req.user._id });
    expect(fakeCard.iteams.length).toBe(1);
    expect(fakeCard.iteams[0]).toEqual({ productId: 'prod2', quantity: 4 });
    expect(fakeCard.save).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Item added to card', card: fakeCard }));
  });

  test('creates a new cart when none exists and adds the item', async () => {
    CardModel.findOne.mockResolvedValue(null);
    CardModel.prototype.save.mockResolvedValue();

    const req = { user: { _id: 'uid3' }, body: { productId: 'prod3', quantity: 1 } };
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status };

    await CardController.addItemToCard(req, res);

    // findOne called
    expect(CardModel.findOne).toHaveBeenCalledWith({ user: req.user._id });
    // new CardModel instance should have been saved (prototype.save mocked)
    expect(CardModel.prototype.save).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Item added to card' }));
  });
});
