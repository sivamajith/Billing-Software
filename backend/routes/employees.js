const express = require('express');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/shop/:shopId', protect, async (req, res) => {
  try {
    const employees = await User.find({
      shopId: req.params.shopId,
      role: { $in: ['employee', 'cashier'] },
    }).select('-password');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
