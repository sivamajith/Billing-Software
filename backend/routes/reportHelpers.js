const mongoose = require('mongoose');

function normalizeShopId(shopId) {
  if (!shopId) return shopId;
  if (mongoose.isValidObjectId(shopId)) {
    return new mongoose.Types.ObjectId(shopId);
  }
  return shopId;
}

function buildDateRangeMatch(start, end) {
  const createdAt = {};
  if (start) createdAt.$gte = new Date(start);
  if (end) createdAt.$lte = new Date(end);
  return Object.keys(createdAt).length ? { createdAt } : {};
}

function buildSalesSummaryMatch(shopId, { start, end, status = 'completed' } = {}) {
  const match = { status };
  const normalizedShopId = normalizeShopId(shopId);
  if (normalizedShopId) {
    match.shopId = normalizedShopId;
  }

  const dateMatch = buildDateRangeMatch(start, end);
  if (Object.keys(dateMatch).length) {
    match.createdAt = dateMatch.createdAt;
  }

  return match;
}

function buildSalesSummaryPipeline(period = 'daily', baseMatch = {}) {
  const match = { ...baseMatch };

  let groupStage;
  let projectStage;

  switch (period) {
    case 'daily':
      groupStage = {
        _id: { day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } },
        total: { $sum: '$total' },
        count: { $sum: 1 },
      };
      projectStage = { _id: 0, period: '$_id.day', total: '$total', count: '$count' };
      break;
    case 'weekly':
      groupStage = {
        _id: { isoWeekYear: { $isoWeekYear: '$createdAt' }, isoWeek: { $isoWeek: '$createdAt' } },
        total: { $sum: '$total' },
        count: { $sum: 1 },
      };
      projectStage = {
        _id: 0,
        period: { $concat: [{ $toString: '$_id.isoWeekYear' }, '-W', { $toString: '$_id.isoWeek' }] },
        total: '$total',
        count: '$count',
      };
      break;
    case 'monthly':
      groupStage = {
        _id: { month: { $dateToString: { format: '%Y-%m', date: '$createdAt' } } },
        total: { $sum: '$total' },
        count: { $sum: 1 },
      };
      projectStage = { _id: 0, period: '$_id.month', total: '$total', count: '$count' };
      break;
    case 'yearly':
      groupStage = {
        _id: { year: { $dateToString: { format: '%Y', date: '$createdAt' } } },
        total: { $sum: '$total' },
        count: { $sum: 1 },
      };
      projectStage = { _id: 0, period: '$_id.year', total: '$total', count: '$count' };
      break;
    default:
      throw new Error('Invalid period. Use daily, weekly, monthly or yearly.');
  }

  return [
    { $match: match },
    { $group: groupStage },
    { $project: projectStage },
    { $sort: { period: 1 } },
  ];
}

module.exports = {
  normalizeShopId,
  buildDateRangeMatch,
  buildSalesSummaryMatch,
  buildSalesSummaryPipeline,
};
