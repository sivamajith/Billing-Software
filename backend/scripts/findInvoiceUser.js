require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Invoice = require('../models/Invoice');
const User = require('../models/User');
const Shop = require('../models/Shop');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const invoice = await Invoice.findById('6a393ce19bad465131667fce');
    console.log('invoice', !!invoice, invoice?._id?.toString(), invoice?.shopId?.toString());
    if (invoice) {
      const shop = await Shop.findById(invoice.shopId);
      console.log('shop', !!shop, shop?._id?.toString(), shop?.name);
      const user = await User.findOne({ shopId: invoice.shopId });
      console.log('user', !!user, user?._id?.toString(), user?.email, user?.role);
      const count = await User.countDocuments({ shopId: invoice.shopId });
      console.log('users for shop', count);
    }
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
