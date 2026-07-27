const mongoose = require('mongoose');
const request = require('supertest');
const Plan = require('../models/Plan');
const Shop = require('../models/Shop');
const User = require('../models/User');

describe('Plans API Integration', () => {
  let app, adminUser, ownerUser, shop;
  let adminToken, ownerToken;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test');
    app = require('../server');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Plan.deleteMany({});
    await Shop.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    adminUser = await User.create({
      name: 'Admin',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'website_owner',
    });
    adminToken = adminUser.generateToken ? 'mock-token' : 'Bearer admin-token';

    // Create owner user
    ownerUser = await User.create({
      name: 'Owner',
      email: 'owner@test.com',
      password: 'owner123',
      role: 'shop_owner',
    });
    ownerToken = ownerUser.generateToken ? 'mock-token' : 'Bearer owner-token';

    // Create shop
    shop = await Shop.create({
      name: 'Test Shop',
      ownerId: ownerUser._id,
    });
  });

  test('POST /api/plans - create plan (admin only)', async () => {
    const res = await request(app)
      .post('/api/plans')
      .set('Authorization', adminToken)
      .send({
        name: 'New Plan',
        key: 'newplan',
        priceMonthly: 499,
        features: { invoiceGeneration: true, advancedAnalytics: true },
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('New Plan');
  });

  test('GET /api/plans - list plans', async () => {
    await Plan.create({
      name: 'Test Plan',
      key: 'testplan',
      features: { invoiceGeneration: true },
    });

    const res = await request(app)
      .get('/api/plans')
      .set('Authorization', adminToken);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/plans/assign - assign plan to shop', async () => {
    const plan = await Plan.create({
      name: 'Pro Plan',
      key: 'proplan',
      features: { invoiceGeneration: true },
    });

    const res = await request(app)
      .post('/api/plans/assign')
      .set('Authorization', adminToken)
      .send({
        shopId: shop._id.toString(),
        planId: plan._id.toString(),
      });

    expect(res.status).toBe(200);
    const updatedShop = await Shop.findById(shop._id);
    expect(updatedShop.planId.toString()).toBe(plan._id.toString());
  });

  test('GET /api/shops/:id/features - get merged features', async () => {
    const plan = await Plan.create({
      name: 'Feature Plan',
      key: 'featureplan',
      features: {
        invoiceGeneration: true,
        advancedAnalytics: true,
        apiAccess: 'basic',
      },
    });

    shop.planId = plan._id;
    await shop.save();

    const res = await request(app)
      .get(`/api/shops/${shop._id}/features`)
      .set('Authorization', ownerToken);

    expect(res.status).toBe(200);
    expect(res.body.features.invoiceGeneration).toBe(true);
    expect(res.body.features.apiAccess).toBe('basic');
  });

  test('GET /api/shops/:id/features - apply overrides', async () => {
    const plan = await Plan.create({
      name: 'Base Plan',
      key: 'baseplan',
      features: { invoiceGeneration: true, advancedAnalytics: false },
    });

    shop.planId = plan._id;
    shop.planOverrides = { advancedAnalytics: true };
    await shop.save();

    const res = await request(app)
      .get(`/api/shops/${shop._id}/features`)
      .set('Authorization', ownerToken);

    expect(res.status).toBe(200);
    expect(res.body.features.advancedAnalytics).toBe(true);
  });
});
