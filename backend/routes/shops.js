const express = require('express');
const Shop = require('../models/Shop');
const User = require('../models/User');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, authorize('website_owner'), async (req, res) => {
  try {
    const shops = await Shop.find().populate('ownerId', 'name email');
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('ownerId', 'name email');
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    if (req.user.role !== 'website_owner' && req.user.shopId?.toString() !== shop._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get merged features for a shop (plan features + overrides)
router.get('/:id/features', protect, async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).lean();
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    if (req.user.role !== 'website_owner' && req.user.shopId?.toString() !== shop._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ planId: shop.planId, features: {} });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('website_owner'), async (req, res) => {
  try {
    const { name, ownerEmail, ownerName, ownerPassword, email, phone, address, city, gstNumber } = req.body;

    if (!name || !ownerEmail || !ownerName) {
      return res.status(400).json({ message: 'Shop name, owner email, and owner name are required' });
    }

    let owner = await User.findOne({ email: ownerEmail });
    if (!owner) {
      owner = await User.create({
        name: ownerName,
        email: ownerEmail,
        password: ownerPassword || 'owner123',
        role: 'shop_owner',
        isActive: true,
      });
    }

    const shop = await Shop.create({
      name,
      ownerId: owner._id,
      email: email || '',
      phone: phone || '',
      address: address || '',
      city: city || '',
      gstNumber: gstNumber || '',
      subscription: {
        plan: 'professional',
        status: 'active',
        features: {
          advancedAnalytics: true,
          supplierManagement: true,
          bulkImport: true,
          apiAccess: 'basic',
          customBranding: true,
          whiteLabel: false,
          dedicatedSupport: false,
          loyaltyProgram: true,
          thermalPrinter: true,
        },
      },
    });

    owner.shopId = shop._id;
    await owner.save();

    res.status(201).json(shop);
  } catch (error) {
    console.error('Shop creation error:', error.message, error.stack);
    res.status(500).json({ message: error.message || 'Failed to create shop' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'website_owner' && req.user.shopId?.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/stats', protect, async (req, res) => {
  try {
    const shopId = req.params.id;
    const shop = await Shop.findById(shopId);
    const mongoose = require('mongoose');
    const oid = new mongoose.Types.ObjectId(shopId);
    const [productCount, salesCount, revenue] = await Promise.all([
      Product.countDocuments({ shopId, isActive: true }),
      Sale.countDocuments({ shopId, status: 'completed' }),
      Sale.aggregate([
        { $match: { shopId: oid, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
    ]);
    res.json({
      productCount,
      salesCount,
      revenue: revenue[0]?.total || 0,
      shop,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('website_owner'), async (req, res) => {
  try {
    await Shop.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Shop deactivated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
