const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  key: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  priceMonthly: { type: Number, default: 0 },
  priceAnnual: { type: Number, default: 0 },
  billingCycle: { type: String, enum: ['monthly', 'annual', 'flex'], default: 'monthly' },
  features: { type: mongoose.Schema.Types.Mixed, default: {} },
  limits: { type: mongoose.Schema.Types.Mixed, default: {} },
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);
