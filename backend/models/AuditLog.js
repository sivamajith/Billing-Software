const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  entity: { type: String, required: true },
  entityId: { type: String, default: '' },
  details: { type: String, default: '' },
  ip: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditSchema);
