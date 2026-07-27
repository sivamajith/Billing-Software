const express = require('express');
const Payment = require('../models/Payment');
const { protect, shopAccess } = require('../middleware/auth');

const router = express.Router();

router.get('/shop/:shopId', protect, shopAccess, async (req, res) => {
  try {
    const payments = await Payment.find({ shopId: req.params.shopId })
      .populate('processedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
