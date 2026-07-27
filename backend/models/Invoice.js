const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  invoiceNumber: { type: String, required: true },
  saleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale' },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  customerName: { type: String, default: '' },
  customerEmail: { type: String, default: '' },
  customerPhone: { type: String, default: '' },
  items: [invoiceItemSchema],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'], default: 'paid' },
  dueDate: { type: Date },
  paidAt: { type: Date },
  notes: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
