const express = require('express');
const Product = require('../models/Product');
const InventoryLog = require('../models/InventoryLog');
const { protect, shopAccess } = require('../middleware/auth');

const router = express.Router();

router.get('/shop/:shopId', protect, shopAccess, async (req, res) => {
  try {
    const products = await Product.find({ shopId: req.params.shopId, isActive: true }).sort({ name: 1 });
    const inventory = products.map((p) => ({
      ...p.toObject(),
      isLowStock: p.stock <= (p.lowStockThreshold || 10),
    }));
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/shop/:shopId/low-stock', protect, shopAccess, async (req, res) => {
  try {
    const products = await Product.find({
      shopId: req.params.shopId,
      isActive: true,
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/shop/:shopId/logs', protect, shopAccess, async (req, res) => {
  try {
    const logs = await InventoryLog.find({ shopId: req.params.shopId })
      .populate('productId', 'name sku')
      .populate('performedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/adjust/:productId', protect, async (req, res) => {
  try {
    const { quantity, type, reason } = req.body;
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const prev = product.stock;
    if (type === 'in') product.stock += quantity;
    else if (type === 'out') product.stock = Math.max(0, product.stock - quantity);
    else product.stock = quantity;

    await product.save();
    await InventoryLog.create({
      shopId: product.shopId,
      productId: product._id,
      type: type || 'adjustment',
      quantity,
      previousStock: prev,
      newStock: product.stock,
      reason: reason || 'Manual adjustment',
      performedBy: req.user._id,
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
