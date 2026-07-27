const express = require('express');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const InventoryLog = require('../models/InventoryLog');
const Customer = require('../models/Customer');
const Shop = require('../models/Shop');
const { protect, shopAccess, checkShopForUser } = require('../middleware/auth');

const router = express.Router();

const generateSaleNumber = () => `SALE-${Date.now().toString(36).toUpperCase()}`;
const generateInvoiceNumber = () => `INV-${Date.now().toString(36).toUpperCase()}`;

router.get('/shop/:shopId', protect, shopAccess, async (req, res) => {
  try {
    const sales = await Sale.find({ shopId: req.params.shopId })
      .populate('cashierId', 'name')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('cashierId', 'name')
      .populate('items.productId', 'name sku');
    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    if (!checkShopForUser(req.user, sale.shopId)) return res.status(403).json({ message: 'No access to this sale' });
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const {
      shopId, items, discount = 0, paymentMethod, amountPaid, change, customerId, customerName, notes, customerNote, taxPercent,
    } = req.body;

    const effectiveShopId = shopId || req.user.shopId;
    if (!effectiveShopId || !items?.length) {
      return res.status(400).json({ message: 'Shop and items required' });
    }
    if (!checkShopForUser(req.user, effectiveShopId)) {
      return res.status(403).json({ message: 'No access to this shop' });
    }

    const shop = await Shop.findById(effectiveShopId);
    if (!shop) return res.status(400).json({ message: 'Shop not found' });

    const customer = customerId ? await Customer.findById(customerId) : null;

    const effectiveTaxPercent = taxPercent != null && taxPercent !== '' ? Number(taxPercent) : shop.taxRate || 0;
    let subtotal = 0;
    let totalTax = 0;
    const saleItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(400).json({ message: `Product not found: ${item.name}` });
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      const quantity = item.quantity || 1;
      const price = item.price != null ? item.price : product.price;
      const lineTotal = price * quantity;
      const itemTax = +((lineTotal - (item.discount || 0)) * effectiveTaxPercent / 100).toFixed(2);
      subtotal += lineTotal;
      totalTax += itemTax;

      saleItems.push({
        productId: product._id,
        name: product.name,
        quantity,
        price,
        discount: item.discount || 0,
        tax: itemTax,
        total: +(lineTotal - (item.discount || 0) + itemTax).toFixed(2),
      });
    }

    subtotal = +subtotal.toFixed(2);
    const tax = +totalTax.toFixed(2);
    const total = +(subtotal - discount + tax).toFixed(2);

    const sale = await Sale.create({
      shopId: effectiveShopId,
      saleNumber: generateSaleNumber(),
      items: saleItems,
      subtotal,
      discount,
      tax,
      total,
      paymentMethod: paymentMethod || 'cash',
      amountPaid: amountPaid != null ? amountPaid : total,
      change: change != null ? change : Math.max(0, (amountPaid != null ? amountPaid : total) - total),
      customerId,
      customerName: customerName || customer?.name || 'Walk-in Customer',
      cashierId: req.user._id,
      notes: notes || customerNote || '',
    });

    for (const item of saleItems) {
      const product = await Product.findById(item.productId);
      const prev = product.stock;
      product.stock -= item.quantity;
      await product.save();
      await InventoryLog.create({
        shopId: effectiveShopId,
        productId: product._id,
        type: 'sale',
        quantity: item.quantity,
        previousStock: prev,
        newStock: product.stock,
        reason: `Sale ${sale.saleNumber}`,
        performedBy: req.user._id,
      });
    }

    await Payment.create({
      shopId: effectiveShopId,
      saleId: sale._id,
      amount: total,
      method: paymentMethod || 'cash',
      processedBy: req.user._id,
    });

    const invoice = await Invoice.create({
      shopId: effectiveShopId,
      invoiceNumber: generateInvoiceNumber(),
      saleId: sale._id,
      customerId,
      customerName: sale.customerName,
      customerEmail: customer?.email || '',
      customerPhone: customer?.phone || '',
      items: saleItems.map((i) => ({
        productId: i.productId,
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        tax: i.tax,
        total: i.total,
      })),
      subtotal,
      discount,
      tax,
      total,
      status: 'paid',
      paidAt: new Date(),
      createdBy: req.user._id,
    });

    if (customerId && shop.settings?.enableLoyalty) {
      await Customer.findByIdAndUpdate(customerId, {
        $inc: { totalPurchases: total, loyaltyPoints: Math.floor(total / 100) },
      });
    }

    res.status(201).json({ sale, invoice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
