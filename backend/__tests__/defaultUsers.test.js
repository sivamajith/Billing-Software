const test = require('node:test');
const assert = require('node:assert/strict');
const { ensureDefaultUsers } = require('../utils/defaultUsers');

test('ensureDefaultUsers creates missing seeded accounts', async () => {
  const createdUsers = [];
  const createdShops = [];

  const User = {
    countDocuments: async () => 0,
    findOne: async (query) => {
      if (query?.email === 'admin@billing.com' || query?.email === 'owner@shop.com' || query?.email === 'cashier@shop.com') {
        return createdUsers.find((user) => user.email === query.email) || null;
      }
      return null;
    },
    create: async (data) => {
      const user = { ...data, _id: `user-${createdUsers.length + 1}` };
      createdUsers.push(user);
      return user;
    },
  };

  const Shop = {
    findOne: async () => null,
    create: async (data) => {
      const shop = { ...data, _id: 'shop-1' };
      createdShops.push(shop);
      return shop;
    },
  };

  const result = await ensureDefaultUsers({ User, Shop });

  assert.deepEqual(result.createdUsers.map((user) => user.email), [
    'admin@billing.com',
    'owner@shop.com',
    'cashier@shop.com',
  ]);
  assert.equal(result.createdShop.name, 'Demo Electronics Store');
  assert.equal(createdUsers.length, 3);
  assert.equal(createdShops.length, 1);
});
