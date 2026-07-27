const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  name: { type: String, required: true },
  sku: { type: String, default: '' },
  barcode: { type: String, default: '' },
  category: { type: String, default: 'General' },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  costPrice: { type: Number, default: 0 },
  stock: { type: Number, default: 0, min: 0 },
  lowStockThreshold: { type: Number, default: 10 },
  unit: { type: String, default: 'pcs' },
  taxRate: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  image: { type: String, default: '' },
}, { timestamps: true });

productSchema.index({ shopId: 1, name: 'text', sku: 'text', barcode: 'text' });

module.exports = mongoose.model('Product', productSchema);
