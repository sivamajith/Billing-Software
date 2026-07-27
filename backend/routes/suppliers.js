const express = require('express');
const Supplier = require('../models/Supplier');
const { protect, shopAccess, checkShopForUser } = require('../middleware/auth');

const router = express.Router();

router.get('/shop/:shopId', protect, shopAccess, async (req, res) => {
  try {
    const suppliers = await Supplier.find({ shopId: req.params.shopId, isActive: true });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const shopId = req.body.shopId || req.user.shopId;
    if (!shopId) return res.status(400).json({ message: 'Shop ID required' });
    if (!checkShopForUser(req.user, shopId)) return res.status(403).json({ message: 'No access to this shop' });
    const supplier = await Supplier.create({ ...req.body, shopId });
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    if (!checkShopForUser(req.user, supplier.shopId)) return res.status(403).json({ message: 'No access to this supplier' });
    const updated = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
