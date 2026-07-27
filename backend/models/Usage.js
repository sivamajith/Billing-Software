const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  
  year: { type: Number, required: true },
  month: { type: Number, required: true }, // 1-12
  
  // Usage metrics
  productsCreated: { type: Number, default: 0 },
  usersCreated: { type: Number, default: 0 },
  customersCreated: { type: Number, default: 0 },
  invoicesCreated: { type: Number, default: 0 },
  
  // Current counts
  totalProducts: { type: Number, default: 0 },
  totalUsers: { type: Number, default: 0 },
  totalCustomers: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  
  // Limits from active plan
  limits: {
    maxProducts: { type: Number },
    maxUsers: { type: Number },
    maxCustomers: { type: Number },
    maxMonthlyInvoices: { type: Number },
  },
  
  // Status
  isOverLimit: { type: Boolean, default: false },
  warningsSent: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Compound index for shop + year + month
usageSchema.index({ shopId: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Usage', usageSchema);
