const express = require('express');
const PDFDocument = require('pdfkit');
const twilio = require('twilio');
const Invoice = require('../models/Invoice');
const Shop = require('../models/Shop');
const { protect, shopAccess, checkShopForUser } = require('../middleware/auth');

const router = express.Router();

// Email functionality removed. Use SMS/WhatsApp (Twilio) for notifications.

const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN ?
  twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN) : null;

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

// Email message builder removed with email feature deprecation

const createInvoicePDFBuffer = async (invoice, shop) => {
  const doc = new PDFDocument({ margin: 40 });
  const buffers = [];
  doc.on('data', (chunk) => buffers.push(chunk));
  doc.on('end', () => {});

  doc.fontSize(18).text(shop?.name || 'Billing Software', { align: 'center' });
  doc.fontSize(10).text(shop?.address || '', { align: 'center' });
  doc.moveDown(1);
  doc.fontSize(12).text(`Invoice: ${invoice.invoiceNumber}`);
  doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`);
  doc.text(`Customer: ${invoice.customerName}`);
  if (invoice.customerEmail) doc.text(`Email: ${invoice.customerEmail}`);
  if (invoice.customerPhone) doc.text(`Phone: ${invoice.customerPhone}`);
  doc.moveDown();

  doc.fontSize(11);
  invoice.items.forEach((item) => {
    doc.text(`${item.name} x ${item.quantity} @ ${item.price} = ${item.total.toFixed(2)} (Tax: ${item.tax.toFixed(2)})`);
  });
  doc.moveDown();
  doc.text(`Subtotal: ${invoice.subtotal.toFixed(2)}`);
  doc.text(`Tax: ${invoice.tax.toFixed(2)}`);
  doc.text(`Discount: ${invoice.discount.toFixed(2)}`);
  doc.fontSize(13).text(`Total: ${invoice.total.toFixed(2)}`, { underline: true });
  doc.end();

  return new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(buffers)));
  });
};

const resolveNotificationRecipient = (method, providedTo, invoice) => {
  const normalizedProvidedTo = providedTo?.toString().trim();
  if (normalizedProvidedTo) return normalizedProvidedTo;

  if (method === 'sms' || method === 'whatsapp') {
    return invoice?.customerPhone?.toString().trim() || '';
  }

  return '';
};

// sendEmailNotification removed with email feature deprecation

const sendSMSNotification = async (to, text) => {
  if (!twilioClient || !process.env.TWILIO_PHONE_NUMBER) {
    return {
      success: false,
      message: 'SMS provider is not configured. Set Twilio credentials in the backend environment.',
    };
  }

  try {
    await twilioClient.messages.create({
      body: text,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    return { success: true, message: 'Sent' };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to send SMS notification' };
  }
};

const sendWhatsAppNotification = async (to, text) => {
  if (!twilioClient || !process.env.TWILIO_PHONE_NUMBER) {
    return {
      success: false,
      message: 'WhatsApp provider is not configured. Set Twilio credentials in the backend environment.',
    };
  }

  try {
    await twilioClient.messages.create({
      body: text,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${to.replace(/[^0-9]/g, '')}`,
    });
    return { success: true, message: 'Sent' };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to send WhatsApp notification' };
  }
};

const generateWhatsAppLink = (to, text) => {
  const phone = to.replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${phone}?text=${encoded}`;
};

router.get('/shop/:shopId', protect, shopAccess, async (req, res) => {
  try {
    const invoices = await Invoice.find({ shopId: req.params.shopId })
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    if (!checkShopForUser(req.user, invoice.shopId)) return res.status(403).json({ message: 'No access to this invoice' });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Invoice creation is available without plan-based restrictions.
router.post('/', protect, async (req, res) => {
  try {
    const shopId = req.body.shopId || req.user.shopId;
    if (!shopId) return res.status(400).json({ message: 'Shop ID required' });
    if (!checkShopForUser(req.user, shopId)) return res.status(403).json({ message: 'No access to this shop' });
    const count = await Invoice.countDocuments({ shopId });
    const invoice = await Invoice.create({
      ...req.body,
      shopId,
      invoiceNumber: req.body.invoiceNumber || `INV-${String(count + 1).padStart(5, '0')}`,
      createdBy: req.user._id,
    });
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/send', protect, async (req, res) => {
  try {
    const { method, to, message } = req.body;
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    if (!checkShopForUser(req.user, invoice.shopId)) return res.status(403).json({ message: 'No access to this invoice' });

    const shop = await Shop.findById(invoice.shopId);
    const text = message || `Invoice ${invoice.invoiceNumber} for ₹${invoice.total.toFixed(2)}.`;
    const pdfBuffer = await createInvoicePDFBuffer(invoice, shop);
    const response = { message: 'Notification processed' };

    const smsRecipient = resolveNotificationRecipient('sms', to, invoice);
    const whatsappRecipient = resolveNotificationRecipient('whatsapp', to, invoice);

    if (method === 'sms' || method === 'all') {
      if (!smsRecipient) return res.status(400).json({ message: 'Phone number required for SMS notifications' });
      const smsResult = await sendSMSNotification(smsRecipient, `${text} Total: ₹${invoice.total.toFixed(2)}.`);
      response.sms = smsResult.success ? 'Sent' : smsResult.message;
      if (!smsResult.success) response.smsError = smsResult.message;
    }

    if (method === 'whatsapp' || method === 'all') {
      if (!whatsappRecipient) return res.status(400).json({ message: 'Phone number required for WhatsApp notifications' });
      const whatsappText = `${text} Total: ₹${invoice.total.toFixed(2)}.`;
      const whatsappResult = await sendWhatsAppNotification(whatsappRecipient, whatsappText);
      response.whatsapp = whatsappResult.success ? 'Sent' : whatsappResult.message;
      if (!whatsappResult.success) response.whatsappError = whatsappResult.message;
      response.whatsappLink = generateWhatsAppLink(whatsappRecipient, whatsappText);
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    if (!checkShopForUser(req.user, invoice.shopId)) return res.status(403).json({ message: 'No access to this invoice' });
    const updated = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/pdf', protect, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    if (!checkShopForUser(req.user, invoice.shopId)) return res.status(403).json({ message: 'No access to this invoice' });

    const shop = await Shop.findById(invoice.shopId);
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text(shop?.name || 'Billing Software', { align: 'center' });
    doc.fontSize(10).text(shop?.address || '', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Invoice: ${invoice.invoiceNumber}`);
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`);
    doc.text(`Customer: ${invoice.customerName}`);
    doc.moveDown();

    doc.fontSize(10);
    invoice.items.forEach((item) => {
      doc.text(`${item.name} x ${item.quantity} - ₹${item.total.toFixed(2)}`);
    });

    doc.moveDown();
    doc.text(`Subtotal: ₹${invoice.subtotal.toFixed(2)}`);
    doc.text(`Tax: ₹${invoice.tax.toFixed(2)}`);
    doc.text(`Discount: ₹${invoice.discount.toFixed(2)}`);
    doc.fontSize(12).text(`Total: ₹${invoice.total.toFixed(2)}`, { underline: true });
    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
module.exports.sendSMSNotification = sendSMSNotification;
module.exports.sendWhatsAppNotification = sendWhatsAppNotification;
module.exports.generateWhatsAppLink = generateWhatsAppLink;
module.exports.resolveNotificationRecipient = resolveNotificationRecipient;
