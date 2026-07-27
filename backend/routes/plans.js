const express = require('express');
const Plan = require('../models/Plan');
const Shop = require('../models/Shop');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// List plans (website owners and anyone authenticated)
router.get('/', protect, async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Debug endpoint: verify all plans and features
router.get('/debug/status', protect, authorize('website_owner'), async (req, res) => {
  try {
    const plans = await Plan.find();
    const shops = await Shop.find().limit(5);
    const summary = {
      totalPlans: plans.length,
      plans: plans.map(p => ({
        name: p.name,
        key: p.key,
        featureCount: Object.keys(p.features || {}).length,
        features: p.features,
      })),
      shopsWithPlans: shops.map(s => ({
        name: s.name,
        planId: s.planId,
        hasOverrides: !!(s.planOverrides && Object.keys(s.planOverrides).length),
      })),
    };
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create plan (website owner only)
router.post('/', protect, authorize('website_owner'), async (req, res) => {
  try {
    const plan = await Plan.create(req.body);
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update plan
router.put('/:id', protect, authorize('website_owner'), async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete (soft) plan
router.delete('/:id', protect, authorize('website_owner'), async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    res.json({ message: 'Plan deactivated', plan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Assign plan to shop
router.post('/assign', protect, authorize('website_owner'), async (req, res) => {
  try {
    const { shopId, planId, overrides } = req.body;
    if (!shopId || !planId) return res.status(400).json({ message: 'shopId and planId required' });
    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    shop.planId = planId;
    if (overrides) shop.planOverrides = overrides;
    await shop.save();

    res.json({ message: 'Plan assigned', shop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
