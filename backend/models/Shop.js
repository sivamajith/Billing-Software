const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  gstNumber: { type: String, default: '' },
  taxRate: { type: Number, default: 18 },
  currency: { type: String, default: 'INR' },
  subscription: {
    plan: { type: String, enum: ['free', 'basic', 'professional', 'enterprise'], default: 'professional' },
    status: { type: String, enum: ['active', 'inactive', 'trial'], default: 'active' },
    expiresAt: { type: Date },
    features: {
      advancedAnalytics: { type: Boolean, default: true },
      supplierManagement: { type: Boolean, default: true },
      bulkImport: { type: Boolean, default: true },
      apiAccess: { type: String, enum: ['none', 'basic', 'full'], default: 'basic' },
      customBranding: { type: Boolean, default: true },
      whiteLabel: { type: Boolean, default: false },
      dedicatedSupport: { type: Boolean, default: false },
      loyaltyProgram: { type: Boolean, default: true },
      thermalPrinter: { type: Boolean, default: true },
    },
  },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  planOverrides: { type: mongoose.Schema.Types.Mixed, default: {} },
  settings: {
    lowStockThreshold: { type: Number, default: 10 },
    receiptFooter: { type: String, default: 'Thank you for shopping!' },
    thermalPrinterWidth: { type: Number, default: 80 },
    enableLoyalty: { type: Boolean, default: true },
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);
