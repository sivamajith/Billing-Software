const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  name: { type: String, required: true },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  type: { type: String, enum: ['regular', 'vip', 'wholesale'], default: 'regular' },
  loyaltyPoints: { type: Number, default: 0 },
  creditLimit: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  totalPurchases: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
