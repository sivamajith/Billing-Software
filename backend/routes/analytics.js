const express = require('express');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Expense = require('../models/Expense');
const Invoice = require('../models/Invoice');
const Shop = require('../models/Shop');
const User = require('../models/User');
const { protect, shopAccess } = require('../middleware/auth');

const router = express.Router();

const getDateRange = (period) => {
  const now = new Date();
  const start = new Date();
  if (period === 'today') start.setHours(0, 0, 0, 0);
  else if (period === 'week') start.setDate(now.getDate() - 7);
  else if (period === 'month') start.setMonth(now.getMonth() - 1);
  else if (period === 'year') start.setFullYear(now.getFullYear() - 1);
  else start.setMonth(now.getMonth() - 1);
  return { start, end: now };
};

// Analytics endpoint remains available without plan-based feature checks.
router.get('/shop/:shopId', protect, shopAccess, async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const { period = 'month' } = req.query;
    const { start, end } = getDateRange(period);
    const mongoose = require('mongoose');
    const shopObjectId = new mongoose.Types.ObjectId(shopId);

    const match = { shopId: shopObjectId, status: 'completed', createdAt: { $gte: start, $lte: end } };

    const [salesData, topProducts, lowStock, recentSales, totalCustomers, totalExpenses] = await Promise.all([
      Sale.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$total' },
            totalSales: { $sum: 1 },
            totalDiscount: { $sum: '$discount' },
            totalTax: { $sum: '$tax' },
          },
        },
      ]),
      Sale.aggregate([
        { $match: match },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.name',
            quantity: { $sum: '$items.quantity' },
            revenue: { $sum: '$items.total' },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 5 },
      ]),
      Product.find({ shopId: shopObjectId, isActive: true, $expr: { $lte: ['$stock', '$lowStockThreshold'] } }).limit(10),
      Sale.find({ shopId: shopObjectId }).sort({ createdAt: -1 }).limit(5).populate('cashierId', 'name'),
      Customer.countDocuments({ shopId: shopObjectId, isActive: true }),
      Expense.aggregate([
        { $match: { shopId: shopObjectId, date: { $gte: start, $lte: end } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    const dailySales = await Sale.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      summary: salesData[0] || { totalRevenue: 0, totalSales: 0, totalDiscount: 0, totalTax: 0 },
      topProducts,
      lowStock,
      recentSales,
      totalCustomers,
      totalExpenses: totalExpenses[0]?.total || 0,
      dailySales,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/platform', protect, async (req, res) => {
  try {
    if (req.user.role !== 'website_owner') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const [totalShops, activeShops, totalUsers, totalSales, revenue] = await Promise.all([
      Shop.countDocuments(),
      Shop.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: true }),
      Sale.countDocuments({ status: 'completed' }),
      Sale.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
    ]);
    const shops = await Shop.find().populate('ownerId', 'name email').sort({ createdAt: -1 }).limit(10);
    res.json({
      totalShops,
      activeShops,
      totalUsers,
      totalSales,
      totalRevenue: revenue[0]?.total || 0,
      recentShops: shops,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
