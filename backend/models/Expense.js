const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  title: { type: String, required: true },
  category: { type: String, default: 'General' },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  notes: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
