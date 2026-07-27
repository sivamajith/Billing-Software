const express = require('express');
const Customer = require('../models/Customer');
const { protect, shopAccess, checkShopForUser } = require('../middleware/auth');

const router = express.Router();

router.get('/shop/:shopId', protect, shopAccess, async (req, res) => {
  try {
    const customers = await Customer.find({ shopId: req.params.shopId, isActive: true }).sort({ name: 1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    if (!checkShopForUser(req.user, customer.shopId)) return res.status(403).json({ message: 'No access to this customer' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const shopId = req.body.shopId || req.user.shopId;
    const customer = await Customer.create({ ...req.body, shopId });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    if (!checkShopForUser(req.user, customer.shopId)) return res.status(403).json({ message: 'No access to this customer' });
    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    if (!checkShopForUser(req.user, customer.shopId)) return res.status(403).json({ message: 'No access to this customer' });
    await Customer.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Customer removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
