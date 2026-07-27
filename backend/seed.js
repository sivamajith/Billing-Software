require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Shop = require('./models/Shop');
const Product = require('./models/Product');
const Customer = require('./models/Customer');
const Sale = require('./models/Sale');
const Expense = require('./models/Expense');

const Plan = require('./models/Plan');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Promise.all([
      User.deleteMany({}),
      Shop.deleteMany({}),
      Product.deleteMany({}),
      Customer.deleteMany({}),
    ]);

    const admin = await User.create({
      name: 'Website Admin',
      email: 'admin@billing.com',
      password: 'admin123',
      role: 'website_owner',
    });

    const owner = await User.create({
      name: 'Shop Owner',
      email: 'owner@shop.com',
      password: 'owner123',
      role: 'shop_owner',
    });

    const shop = await Shop.create({
      name: 'Demo Electronics Store',
      ownerId: owner._id,
      email: 'store@demo.com',
      phone: '+91 9876543210',
      address: '123 Main Street',
      city: 'Chennai',
      gstNumber: '33AABCU9603R1ZM',
      taxRate: 18,
      subscription: {
        plan: 'professional',
        status: 'active',
        features: {
          advancedAnalytics: true,
          supplierManagement: true,
          bulkImport: true,
          apiAccess: 'basic',
          customBranding: true,
          whiteLabel: false,
          dedicatedSupport: false,
          loyaltyProgram: true,
          thermalPrinter: true,
        },
      },
    });

    // Ensure default plans exist with 50+ features
    const defaultFeatures = {
      // Core features
      invoiceGeneration: false,
      exportCSV: false,
      exportPDF: false,
      exportExcel: false,
      advancedAnalytics: false,
      inventoryReports: false,
      customReports: false,
      // Management
      supplierManagement: false,
      bulkImport: false,
      loyaltyProgram: false,
      thermalPrinter: false,
      discountCodes: false,
      giftCards: false,
      // API & Integration
      apiAccess: 'none',
      webhooks: false,
      zapierIntegration: false,
      slackIntegration: false,
      emailNotifications: false,
      smsNotifications: false,
      // Billing
      recurringBilling: false,
      recurringInvoices: false,
      taxConfiguration: false,
      multipleGateways: false,
      multiCurrency: false,
      paymentReminders: false,
      dunningManagement: false,
      // Advanced
      usageMetering: false,
      refundsHandling: false,
      auditLogs: false,
      advancedSearch: false,
      barcodeScanning: false,
      qrCodeGeneration: false,
      // Security & Support
      customBranding: false,
      whiteLabel: false,
      dedicatedSupport: false,
      slaMonitoring: false,
      rateLimiting: false,
      backupRestore: false,
      twoFactorAuth: false,
      advancedPermissions: false,
      // Marketing
      emailMarketing: false,
      smsMarketing: false,
      affiliateProgram: false,
      referralProgram: false,
      campaignMarketing: false,
      customerSegmentation: false,
      // Multi & Mobility
      multiStore: false,
      mobileApp: false,
      multiLanguage: false,
      inventoryForecast: false,
      workflowAutomation: false,
      googleAnalytics: false,
      facebookPixel: false,
    };

    const defaultPlans = [
      { 
        name: 'Basic', 
        key: 'basic', 
        description: 'Basic features', 
        priceMonthly: 0, 
        priceAnnual: 0, 
        features: { 
          ...defaultFeatures, 
          invoiceGeneration: true, 
          exportCSV: true,
          emailNotifications: true,
        }, 
        limits: { maxProducts: 100, maxUsers: 3 } 
      },
      { 
        name: 'Professional', 
        key: 'professional', 
        description: 'Most shops default', 
        priceMonthly: 299, 
        priceAnnual: 2990, 
        features: { 
          ...defaultFeatures, 
          advancedAnalytics: true, 
          supplierManagement: true, 
          bulkImport: true, 
          apiAccess: 'basic', 
          customBranding: true, 
          loyaltyProgram: true, 
          thermalPrinter: true, 
          invoiceGeneration: true, 
          inventoryReports: true, 
          exportCSV: true, 
          exportPDF: true, 
          exportExcel: true,
          webhooks: true, 
          recurringBilling: true, 
          recurringInvoices: true,
          usageMetering: true, 
          refundsHandling: true, 
          auditLogs: true,
          discountCodes: true,
          emailNotifications: true,
          smsNotifications: true,
          advancedSearch: true,
          barcodeScanning: true,
          multiStore: true,
          customReports: true,
        }, 
        limits: { maxProducts: 1000, maxUsers: 10 } 
      },
      { 
        name: 'Enterprise', 
        key: 'enterprise', 
        description: 'Full features - unlimited', 
        priceMonthly: 999, 
        priceAnnual: 9990, 
        features: { 
          ...defaultFeatures, 
          advancedAnalytics: true, 
          supplierManagement: true, 
          bulkImport: true, 
          apiAccess: 'full', 
          customBranding: true, 
          whiteLabel: true, 
          dedicatedSupport: true, 
          loyaltyProgram: true, 
          thermalPrinter: true, 
          invoiceGeneration: true, 
          inventoryReports: true, 
          exportCSV: true, 
          exportPDF: true,
          exportExcel: true,
          webhooks: true, 
          recurringBilling: true, 
          recurringInvoices: true,
          usageMetering: true, 
          discountCodes: true,
          giftCards: true,
          taxConfiguration: true, 
          multipleGateways: true, 
          multiCurrency: true,
          refundsHandling: true, 
          auditLogs: true,
          slaMonitoring: true, 
          rateLimiting: true, 
          backupRestore: true, 
          twoFactorAuth: true,
          advancedPermissions: true,
          emailNotifications: true,
          smsNotifications: true,
          emailMarketing: true,
          smsMarketing: true,
          affiliateProgram: true,
          referralProgram: true,
          campaignMarketing: true,
          customerSegmentation: true,
          advancedSearch: true,
          barcodeScanning: true,
          qrCodeGeneration: true,
          zapierIntegration: true,
          slackIntegration: true,
          multiStore: true,
          mobileApp: true,
          multiLanguage: true,
          inventoryForecast: true,
          workflowAutomation: true,
          googleAnalytics: true,
          facebookPixel: true,
          customReports: true,
          paymentReminders: true,
          dunningManagement: true,
        }, 
        limits: { maxProducts: 999999, maxUsers: 999999 } 
      },
    ];

    for (const p of defaultPlans) {
      await Plan.updateOne({ key: p.key }, { $setOnInsert: p }, { upsert: true });
    }

    const professionalPlan = await Plan.findOne({ key: 'professional' });
    if (professionalPlan) {
      shop.planId = professionalPlan._id;
      await shop.save();
    }

    owner.shopId = shop._id;
    await owner.save();

    const cashier = await User.create({
      name: 'Cashier User',
      email: 'cashier@shop.com',
      password: 'cashier123',
      role: 'cashier',
      shopId: shop._id,
    });

    const products = [
      { name: 'Wireless Mouse', sku: 'WM-001', barcode: '8901001', category: 'Electronics', price: 599, costPrice: 350, stock: 50, lowStockThreshold: 10 },
      { name: 'USB Keyboard', sku: 'KB-002', barcode: '8901002', category: 'Electronics', price: 899, costPrice: 500, stock: 30, lowStockThreshold: 5 },
      { name: 'HDMI Cable 2m', sku: 'HD-003', barcode: '8901003', category: 'Accessories', price: 299, costPrice: 150, stock: 100, lowStockThreshold: 15 },
      { name: 'Laptop Stand', sku: 'LS-004', barcode: '8901004', category: 'Accessories', price: 1299, costPrice: 700, stock: 20, lowStockThreshold: 5 },
      { name: 'Bluetooth Speaker', sku: 'BS-005', barcode: '8901005', category: 'Electronics', price: 2499, costPrice: 1500, stock: 8, lowStockThreshold: 10 },
      { name: 'Phone Charger', sku: 'PC-006', barcode: '8901006', category: 'Accessories', price: 399, costPrice: 200, stock: 75, lowStockThreshold: 20 },
      { name: 'Screen Guard', sku: 'SG-007', barcode: '8901007', category: 'Accessories', price: 199, costPrice: 80, stock: 5, lowStockThreshold: 10 },
      { name: 'Power Bank 10000mAh', sku: 'PB-008', barcode: '8901008', category: 'Electronics', price: 1499, costPrice: 900, stock: 25, lowStockThreshold: 8 },
    ];

    const createdProducts = [];
    for (const p of products) {
      const createdProduct = await Product.create({ ...p, shopId: shop._id });
      createdProducts.push(createdProduct);
    }

    const createdCustomers = await Customer.create([
      { shopId: shop._id, name: 'Raj Kumar', email: 'raj@email.com', phone: '9876500001', type: 'regular', loyaltyPoints: 150 },
      { shopId: shop._id, name: 'Priya Sharma', email: 'priya@email.com', phone: '9876500002', type: 'vip', loyaltyPoints: 500 },
      { shopId: shop._id, name: 'Wholesale Traders', email: 'wholesale@email.com', phone: '9876500003', type: 'wholesale', creditLimit: 50000 },
    ]);

    const sales = [
      {
        shopId: shop._id,
        saleNumber: 'SALE-1001',
        items: [{ productId: createdProducts[0]._id, name: createdProducts[0].name, quantity: 2, price: createdProducts[0].price, discount: 0, tax: 0, total: createdProducts[0].price * 2 }],
        subtotal: createdProducts[0].price * 2,
        discount: 0,
        tax: 0,
        total: createdProducts[0].price * 2,
        paymentMethod: 'cash',
        amountPaid: createdProducts[0].price * 2,
        change: 0,
        customerId: createdCustomers[0]._id,
        customerName: createdCustomers[0].name,
        cashierId: cashier._id,
        status: 'completed',
        createdAt: new Date(),
      },
      {
        shopId: shop._id,
        saleNumber: 'SALE-1002',
        items: [
          { productId: createdProducts[1]._id, name: createdProducts[1].name, quantity: 1, price: createdProducts[1].price, discount: 0, tax: 0, total: createdProducts[1].price },
          { productId: createdProducts[2]._id, name: createdProducts[2].name, quantity: 1, price: createdProducts[2].price, discount: 0, tax: 0, total: createdProducts[2].price },
        ],
        subtotal: createdProducts[1].price + createdProducts[2].price,
        discount: 50,
        tax: 0,
        total: createdProducts[1].price + createdProducts[2].price - 50,
        paymentMethod: 'upi',
        amountPaid: createdProducts[1].price + createdProducts[2].price - 50,
        change: 0,
        customerId: createdCustomers[1]._id,
        customerName: createdCustomers[1].name,
        cashierId: cashier._id,
        status: 'completed',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        shopId: shop._id,
        saleNumber: 'SALE-1003',
        items: [{ productId: createdProducts[3]._id, name: createdProducts[3].name, quantity: 1, price: createdProducts[3].price, discount: 0, tax: 0, total: createdProducts[3].price }],
        subtotal: createdProducts[3].price,
        discount: 0,
        tax: 0,
        total: createdProducts[3].price,
        paymentMethod: 'card',
        amountPaid: createdProducts[3].price,
        change: 0,
        customerId: createdCustomers[2]._id,
        customerName: createdCustomers[2].name,
        cashierId: cashier._id,
        status: 'completed',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    ];

    await Sale.create(sales);
    await Expense.create({
      shopId: shop._id,
      title: 'Electricity Bill',
      category: 'Utilities',
      amount: 2500,
      date: new Date(),
      notes: 'Monthly utility expense',
      createdBy: owner._id,
    });

    console.log('\n✅ Seed completed!\n');
    console.log('Website Owner: admin@billing.com / admin123');
    console.log('Shop Owner:    owner@shop.com / owner123');
    console.log('Cashier:       cashier@shop.com / cashier123');
    console.log(`\nHidden Admin URL: /${process.env.ADMIN_SECRET_PATH || 'x7k9-super-admin-portal'}`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
