const mongoose = require('mongoose');
const verifyPlanAccess = require('../middleware/planAccess');
const Shop = require('../models/Shop');
const Plan = require('../models/Plan');

describe('planAccess Middleware', () => {
  let req, res, next;
  let shopId, planId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Shop.deleteMany({});
    await Plan.deleteMany({});

    // Create basic plan
    const basicPlan = await Plan.create({
      name: 'Basic',
      key: 'basic',
      features: { invoiceGeneration: true, exportCSV: true },
    });

    // Create professional plan
    const proPlan = await Plan.create({
      name: 'Professional',
      key: 'professional',
      features: { invoiceGeneration: true, advancedAnalytics: true, apiAccess: 'basic' },
    });

    // Create shop with basic plan
    const shop = await Shop.create({
      name: 'Test Shop',
      ownerId: new mongoose.Types.ObjectId(),
      planId: basicPlan._id,
    });

    shopId = shop._id.toString();
    planId = proPlan._id.toString();

    req = { params: {}, body: {}, user: { shopId } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test('should allow access if feature is enabled', async () => {
    req.params.shopId = shopId;
    const middleware = verifyPlanAccess('invoiceGeneration');
    await middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('should deny access if feature is not enabled', async () => {
    req.params.shopId = shopId;
    const middleware = verifyPlanAccess('advancedAnalytics');
    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('should allow access if override enables feature', async () => {
    const shop = await Shop.findById(shopId);
    shop.planOverrides = { advancedAnalytics: true };
    await shop.save();

    req.params.shopId = shopId;
    const middleware = verifyPlanAccess('advancedAnalytics');
    await middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('should handle apiAccess as string', async () => {
    // Create shop with professional plan (apiAccess: 'basic')
    const proPlan = await Plan.findOne({ key: 'professional' });
    const proShop = await Shop.create({
      name: 'Pro Shop',
      ownerId: new mongoose.Types.ObjectId(),
      planId: proPlan._id,
    });

    req.params.shopId = proShop._id.toString();
    const middleware = verifyPlanAccess('apiAccess');
    await middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('should deny apiAccess if set to none', async () => {
    const basicPlan = await Plan.findOne({ key: 'basic' });
    basicPlan.features.apiAccess = 'none';
    await basicPlan.save();

    req.params.shopId = shopId;
    const middleware = verifyPlanAccess('apiAccess');
    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
