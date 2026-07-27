const express = require('express');
const User = require('../models/User');
const { protect, authorize, checkShopForUser } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, authorize('website_owner', 'shop_owner'), async (req, res) => {
  try {
    const filter = req.user.role === 'website_owner'
      ? {}
      : { shopId: req.user.shopId };
    const users = await User.find(filter).select('-password').populate('shopId', 'name');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('website_owner', 'shop_owner'), async (req, res) => {
  try {
    const { name, email, password, role, shopId, phone, blockedUntil } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(400).json({ message: 'Email already exists' });

    const assignedShop = req.user.role === 'shop_owner' ? req.user.shopId : shopId;
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: role || 'employee',
      shopId: assignedShop,
      phone: phone?.trim(),
      blockedUntil: blockedUntil ? new Date(blockedUntil) : null,
    });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('website_owner', 'shop_owner'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!checkShopForUser(req.user, user.shopId)) return res.status(403).json({ message: 'No access to this user' });
    const { name, email, password, role, shopId, phone, isActive, blockedUntil } = req.body;
    if (name) user.name = name.trim();
    if (email) user.email = email.trim().toLowerCase();
    if (password) user.password = password;
    if (role) user.role = role;
    if (shopId) user.shopId = shopId;
    if (phone) user.phone = phone;
    if (typeof isActive === 'boolean') user.isActive = isActive;
    if (blockedUntil === null || blockedUntil === '') {
      user.blockedUntil = null;
    } else if (blockedUntil) {
      user.blockedUntil = new Date(blockedUntil);
    }
    await user.save();
    const updated = await User.findById(req.params.id).select('-password').populate('shopId', 'name');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('website_owner', 'shop_owner'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!checkShopForUser(req.user, user.shopId)) return res.status(403).json({ message: 'No access to this user' });
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'User deactivated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
