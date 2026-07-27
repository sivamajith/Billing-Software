const test = require('node:test');
const assert = require('node:assert/strict');
const { shopAccess } = require('../middleware/auth');

test('shopAccess returns 401 when the user is missing from auth context', () => {
  let statusCode;
  let payload;
  let nextCalled = false;

  const req = { params: { shopId: '507f1f77bcf86cd799439011' } };
  const res = {
    status(code) {
      statusCode = code;
      return {
        json(data) {
          payload = data;
        },
      };
    },
  };

  shopAccess(req, res, () => {
    nextCalled = true;
  });

  assert.equal(statusCode, 401);
  assert.equal(payload.message, 'Not authorized, no token');
  assert.equal(nextCalled, false);
});
