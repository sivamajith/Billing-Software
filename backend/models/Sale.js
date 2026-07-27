const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
});

const saleSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  saleNumber: { type: String, required: true },
  items: [saleItemSchema],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cash', 'card', 'upi', 'credit', 'mixed', 'split'], default: 'cash' },
  amountPaid: { type: Number, default: 0 },
  change: { type: Number, default: 0 },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  customerName: { type: String, default: 'Walk-in Customer' },
  cashierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['completed', 'refunded', 'cancelled'], default: 'completed' },
  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
