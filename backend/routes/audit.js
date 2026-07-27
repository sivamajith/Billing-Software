const express = require('express');
const AuditLog = require('../models/AuditLog');
const { protect, authorize, shopAccess } = require('../middleware/auth');

const router = express.Router();

router.get('/shop/:shopId', protect, shopAccess, async (req, res) => {
  try {
    const logs = await AuditLog.find({ shopId: req.params.shopId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', protect, authorize('website_owner'), async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
