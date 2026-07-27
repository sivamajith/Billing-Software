const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { protect, shopAccess, checkShopForUser } = require('../middleware/auth');

const router = express.Router();

const validateObjectId = (value, label = 'ID') => {
  if (!value) {
    return { ok: false, status: 400, message: `${label} is required` };
  }
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return { ok: false, status: 400, message: `Invalid ${label}` };
  }
  return { ok: true };
};

const validateShopId = (shopId) => validateObjectId(shopId, 'Shop ID');

const parseProductPayload = (payload) => ({
  name: payload.name?.trim() || '',
  sku: payload.sku?.trim() || '',
  barcode: payload.barcode?.trim() || '',
  category: payload.category || 'General',
  description: payload.description?.trim() || '',
  price: payload.price != null ? Number(payload.price) : NaN,
  costPrice: payload.costPrice != null ? Number(payload.costPrice) : 0,
  stock: payload.stock != null ? Number(payload.stock) : 0,
  lowStockThreshold: payload.lowStockThreshold != null ? Number(payload.lowStockThreshold) : 10,
  unit: payload.unit || 'pcs',
  taxRate: payload.taxRate != null ? Number(payload.taxRate) : 0,
  image: payload.image || '',
});

const validateProductPayload = (data) => {
  if (!data.name) return { ok: false, status: 400, message: 'Product name is required' };
  if (!Number.isFinite(data.price) || data.price < 0) return { ok: false, status: 400, message: 'Price must be a valid non-negative number' };
  if (!Number.isFinite(data.costPrice) || data.costPrice < 0) return { ok: false, status: 400, message: 'Cost price must be a valid non-negative number' };
  if (!Number.isFinite(data.stock) || data.stock < 0) return { ok: false, status: 400, message: 'Stock must be a valid non-negative number' };
  if (!Number.isFinite(data.lowStockThreshold) || data.lowStockThreshold < 0) return { ok: false, status: 400, message: 'Low stock threshold must be a valid non-negative number' };
  return { ok: true, data };
};

router.get('/shop/:shopId', protect, shopAccess, async (req, res) => {
  try {
    const validation = validateShopId(req.params.shopId);
    if (!validation.ok) {
      return res.status(validation.status).json({ message: validation.message });
    }

    const { search, category } = req.query;
    const filter = { shopId: req.params.shopId, isActive: true };
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } },
      ];
    }
    const products = await Product.find(filter).sort({ name: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const validation = validateObjectId(req.params.id, 'Product ID');
    if (!validation.ok) {
      return res.status(validation.status).json({ message: validation.message });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Product creation is available without plan-based restrictions.
router.post('/', protect, async (req, res) => {
  try {
    const shopId = req.body.shopId || req.user.shopId;
    const validation = validateShopId(shopId);
    if (!validation.ok) {
      return res.status(validation.status).json({ message: validation.message });
    }
    if (!checkShopForUser(req.user, shopId)) return res.status(403).json({ message: 'No access to this shop' });

    const productData = parseProductPayload({ ...req.body, shopId });
    const payloadValidation = validateProductPayload(productData);
    if (!payloadValidation.ok) {
      return res.status(payloadValidation.status).json({ message: payloadValidation.message });
    }

    const product = await Product.create({ ...productData, shopId });
    res.status(201).json(product);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const validation = validateObjectId(req.params.id, 'Product ID');
    if (!validation.ok) {
      return res.status(validation.status).json({ message: validation.message });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!checkShopForUser(req.user, product.shopId)) return res.status(403).json({ message: 'No access to this product' });

    const updateData = { ...req.body };
    if (updateData.price != null) updateData.price = Number(updateData.price);
    if (updateData.costPrice != null) updateData.costPrice = Number(updateData.costPrice);
    if (updateData.stock != null) updateData.stock = Number(updateData.stock);
    if (updateData.lowStockThreshold != null) updateData.lowStockThreshold = Number(updateData.lowStockThreshold);

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.json(updated);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const validation = validateObjectId(req.params.id, 'Product ID');
    if (!validation.ok) {
      return res.status(validation.status).json({ message: validation.message });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!checkShopForUser(req.user, product.shopId)) return res.status(403).json({ message: 'No access to this product' });
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Product deactivated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  router,
  validateObjectId,
  validateShopId,
};
