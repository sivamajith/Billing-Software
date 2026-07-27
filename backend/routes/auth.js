const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Shop = require('../models/Shop');
const AuditLog = require('../models/AuditLog');
const { protect } = require('../middleware/auth');

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const logAudit = async (userId, action, entity, details, shopId) => {
  try {
    await AuditLog.create({ userId, action, entity, details, shopId });
  } catch { /* ignore */ }
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, shopId } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ message: 'Name, email and password required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const allowedRoles = ['shop_owner', 'cashier', 'employee'];
    const userRole = allowedRoles.includes(role) ? role : 'employee';

    const user = await User.create({ name, email: normalizedEmail, password, role: userRole, shopId });
    await logAudit(user._id, 'REGISTER', 'User', `Registered ${normalizedEmail}`);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      shopId: user.shopId,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }
    if (user.blockedUntil && new Date(user.blockedUntil) > new Date()) {
      return res.status(401).json({ message: `Account blocked until ${new Date(user.blockedUntil).toISOString()}` });
    }
    user.lastLogin = new Date();
    await user.save();
    await logAudit(user._id, 'LOGIN', 'User', `Login ${normalizedEmail}`, user.shopId);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      shopId: user.shopId,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    let shop = null;
    if (user.shopId) {
      shop = await Shop.findById(user.shopId);
    }
    res.json({ user, shop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
