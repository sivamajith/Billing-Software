const express = require('express');
const Expense = require('../models/Expense');
const { protect, shopAccess, checkShopForUser } = require('../middleware/auth');

const router = express.Router();

router.get('/shop/:shopId', protect, shopAccess, async (req, res) => {
  try {
    const expenses = await Expense.find({ shopId: req.params.shopId }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const shopId = req.body.shopId || req.user.shopId;
    if (!shopId) return res.status(400).json({ message: 'Shop ID required' });
    if (!checkShopForUser(req.user, shopId)) return res.status(403).json({ message: 'No access to this shop' });
    const expense = await Expense.create({ ...req.body, shopId, createdBy: req.user._id });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    if (!checkShopForUser(req.user, expense.shopId)) return res.status(403).json({ message: 'No access to this expense' });
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
