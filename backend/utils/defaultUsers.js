const ensureDefaultUsers = async ({ User, Shop }) => {
  const existingAdmin = await User.findOne({ email: 'admin@billing.com' });
  const existingOwner = await User.findOne({ email: 'owner@shop.com' });
  const existingCashier = await User.findOne({ email: 'cashier@shop.com' });

  const createdUsers = [];

  if (!existingAdmin) {
    const admin = await User.create({
      name: 'Website Admin',
      email: 'admin@billing.com',
      password: 'admin123',
      role: 'website_owner',
    });
    createdUsers.push(admin);
  }

  if (!existingOwner) {
    const owner = await User.create({
      name: 'Shop Owner',
      email: 'owner@shop.com',
      password: 'owner123',
      role: 'shop_owner',
    });
    createdUsers.push(owner);
  }

  if (!existingCashier) {
    const cashier = await User.create({
      name: 'Cashier User',
      email: 'cashier@shop.com',
      password: 'cashier123',
      role: 'cashier',
    });
    createdUsers.push(cashier);
  }

  const existingShop = await Shop.findOne({ email: 'store@demo.com' });
  let createdShop = null;
  if (!existingShop) {
    const ownerUser = await User.findOne({ email: 'owner@shop.com' });
    createdShop = await Shop.create({
      name: 'Demo Electronics Store',
      ownerId: ownerUser._id,
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
  }

  return { createdUsers, createdShop };
};

module.exports = { ensureDefaultUsers };
