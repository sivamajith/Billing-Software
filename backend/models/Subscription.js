const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true, unique: true },
  plan: { type: String, enum: ['free', 'basic', 'professional', 'enterprise'], default: 'free' },
  status: { type: String, enum: ['trial', 'active', 'inactive', 'suspended', 'expired'], default: 'trial' },
  
  // Trial info
  trialStartDate: { type: Date },
  trialEndDate: { type: Date },
  trialDaysRemaining: { type: Number, default: 0 },
  
  // Billing info
  currentBillingCycleStart: { type: Date },
  currentBillingCycleEnd: { type: Date },
  nextBillingDate: { type: Date },
  
  // Pricing
  monthlyPrice: { type: Number, default: 0 }, // ₹ per month
  annualPrice: { type: Number, default: 0 }, // ₹ per year
  billingCycle: { type: String, enum: ['monthly', 'annual'], default: 'monthly' },
  
  // Payment
  lastPaymentDate: { type: Date },
  lastPaymentAmount: { type: Number },
  nextPaymentDue: { type: Date },
  failedPaymentAttempts: { type: Number, default: 0 },
  
  // Limits for this plan
  limits: {
    maxProducts: { type: Number },
    maxUsers: { type: Number },
    maxCustomers: { type: Number },
    maxMonthlyInvoices: { type: Number },
  },
  
  // Features enabled for this plan
  features: {
    advancedAnalytics: { type: Boolean, default: false },
    supplierManagement: { type: Boolean, default: false },
    bulkImport: { type: Boolean, default: false },
    apiAccess: { type: String, enum: ['none', 'basic', 'full'], default: 'none' },
    customBranding: { type: Boolean, default: false },
    whiteLabel: { type: Boolean, default: false },
    dedicatedSupport: { type: Boolean, default: false },
    thermalPrinter: { type: Boolean, default: false },
    loyaltyProgram: { type: Boolean, default: false },
  },
  
  // Auto-renewal
  autoRenew: { type: Boolean, default: true },
  
  // Cancellation
  canceledAt: { type: Date },
  cancelReason: { type: String },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
