const express = require('express');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Expense = require('../models/Expense');
const { protect, shopAccess } = require('../middleware/auth');
const { buildSalesSummaryMatch, buildSalesSummaryPipeline } = require('./reportHelpers');

const router = express.Router();

router.get('/shop/:shopId/sales', protect, shopAccess, async (req, res) => {
  try {
    const { start, end } = req.query;
    const filter = { shopId: req.params.shopId, status: 'completed' };
    if (start) filter.createdAt = { ...filter.createdAt, $gte: new Date(start) };
    if (end) filter.createdAt = { ...filter.createdAt, $lte: new Date(end) };
    const sales = await Sale.find(filter).sort({ createdAt: -1 });
    const total = sales.reduce((s, sale) => s + sale.total, 0);
    res.json({ sales, total, count: sales.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/shop/:shopId/inventory', protect, shopAccess, async (req, res) => {
  try {
    const products = await Product.find({ shopId: req.params.shopId, isActive: true });
    const totalValue = products.reduce((s, p) => s + p.stock * p.price, 0);
    const lowStock = products.filter((p) => p.stock <= p.lowStockThreshold);
    res.json({ products, totalValue, lowStockCount: lowStock.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/shop/:shopId/profit', protect, shopAccess, async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const sales = await Sale.find({ shopId, status: 'completed' });
    const expenses = await Expense.find({ shopId });
    const revenue = sales.reduce((s, sale) => s + sale.total, 0);
    const expenseTotal = expenses.reduce((s, e) => s + e.amount, 0);
    res.json({ revenue, expenses: expenseTotal, profit: revenue - expenseTotal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sales summary endpoint: supports period=daily|weekly|monthly|yearly
router.get('/shop/:shopId/sales/summary', protect, shopAccess, async (req, res) => {
  try {
    const { period = 'daily', start, end } = req.query;
    const shopId = req.params.shopId;
    const match = buildSalesSummaryMatch(shopId, { start, end, status: 'completed' });

    const pipeline = buildSalesSummaryPipeline(period, match);
    const results = await Sale.aggregate(pipeline).allowDiskUse(true);
    const overallTotal = results.reduce((sum, row) => sum + (row.total || 0), 0);
    res.json({ period, results, overallTotal });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
