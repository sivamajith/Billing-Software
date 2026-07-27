const test = require('node:test');
const assert = require('node:assert/strict');
const { buildSalesSummaryPipeline } = require('../routes/reportHelpers');

test('buildSalesSummaryPipeline creates a daily aggregation pipeline', () => {
  const pipeline = buildSalesSummaryPipeline('daily', { shopId: '507f1f77bcf86cd799439011', status: 'completed' });

  assert.ok(Array.isArray(pipeline));
  assert.equal(pipeline.length, 4);
  assert.deepEqual(pipeline[0].$match, { shopId: '507f1f77bcf86cd799439011', status: 'completed' });
  assert.deepEqual(pipeline[1].$group._id, { day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } });
  assert.equal(pipeline[2].$project._id, 0);
});

test('buildSalesSummaryPipeline creates a weekly aggregation pipeline', () => {
  const pipeline = buildSalesSummaryPipeline('weekly', { shopId: '507f1f77bcf86cd799439011', status: 'completed' });

  assert.ok(Array.isArray(pipeline));
  assert.equal(pipeline.length, 4);
  assert.deepEqual(pipeline[1].$group._id, {
    isoWeekYear: { $isoWeekYear: '$createdAt' },
    isoWeek: { $isoWeek: '$createdAt' },
  });
  assert.deepEqual(pipeline[2].$project.period, { $concat: [{ $toString: '$_id.isoWeekYear' }, '-W', { $toString: '$_id.isoWeek' }] });
});
