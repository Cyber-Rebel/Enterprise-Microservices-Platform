const CardController = require('../controller/card.controller');

jest.mock('../model/card.model.js', () => {
  // We'll replace with a mock constructor that has static methods
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

describe('CardController.getCard', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns existing card when found', async () => {
    const fakeCard = { user: 'uid1', iteams: [] };
    CardModel.findOne.mockResolvedValue(fakeCard);

    const req = { user: { _id: 'uid1' } };
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status };

    await CardController.getCard(req, res);

    expect(CardModel.findOne).toHaveBeenCalledWith({ user: req.user._id });
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ message: 'User card', card: fakeCard }));
  });

  test('creates and returns new card when none exists', async () => {
    CardModel.findOne.mockResolvedValue(null);
    // When constructor is called, the mockModel.prototype.save will be used
    CardModel.prototype.save.mockResolvedValue();

    const req = { user: { _id: 'uid2' } };
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status };

    await CardController.getCard(req, res);

    expect(CardModel.findOne).toHaveBeenCalledWith({ user: req.user._id });
    expect(CardModel.prototype.save).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(200);
    // We don't know the exact card object shape, but response should include message and card
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ message: 'User card' }));
  });
});
