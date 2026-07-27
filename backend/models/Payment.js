const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  saleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale' },
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['cash', 'card', 'upi', 'credit', 'mixed', 'split'], required: true },
  reference: { type: String, default: '' },
  status: { type: String, enum: ['completed', 'pending', 'failed', 'refunded'], default: 'completed' },
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
