const mongoose = require('mongoose');

const billingInvoiceSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
  
  invoiceNumber: { type: String, unique: true }, // INV-BILL-YYYYMM-001
  status: { type: String, enum: ['draft', 'issued', 'paid', 'failed', 'canceled'], default: 'issued' },
  
  // Plan details at time of billing
  plan: { type: String, enum: ['free', 'basic', 'professional', 'enterprise'] },
  billingCycle: { type: String, enum: ['monthly', 'annual'] },
  
  // Amounts
  subtotal: { type: Number, required: true }, // Plan price
  discount: { type: Number, default: 0 }, // Promo discount
  tax: { type: Number, default: 0 }, // GST 18%
  total: { type: Number, required: true }, // Final amount to charge
  
  // Billing period
  billingPeriodStart: { type: Date, required: true },
  billingPeriodEnd: { type: Date, required: true },
  
  // Payment
  dueDate: { type: Date },
  paidDate: { type: Date },
  paymentMethod: { type: String }, // 'card', 'upi', 'bank_transfer'
  transactionId: { type: String }, // From payment gateway
  
  // Retry attempts (for failed payments)
  retryCount: { type: Number, default: 0 },
  lastRetryDate: { type: Date },
  
  // Additional info
  description: { type: String },
  notes: { type: String },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('BillingInvoice', billingInvoiceSchema);
