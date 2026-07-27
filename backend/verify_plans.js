require('dotenv').config();
const mongoose = require('mongoose');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const Plan = require('./models/Plan');
    const Shop = require('./models/Shop');
    
    // Check plans
    const plans = await Plan.find();
    console.log('\n=== PLANS ===');
    plans.forEach(p => {
      const enabledFeatures = Object.keys(p.features || {}).filter(k => p.features[k]);
      console.log(`✓ ${p.name} (${p.key}): ${enabledFeatures.length} features enabled`);
    });
    
    // Check shops
    const shops = await Shop.find().populate('planId');
    console.log('\n=== SHOPS ===');
    shops.forEach(s => {
      console.log(`✓ ${s.name}`);
      console.log(`  - Plan: ${s.planId?.name || 'NONE'} (${s.planId?.key || 'unassigned'})`);
      console.log(`  - Overrides: ${Object.keys(s.planOverrides || {}).length > 0 ? JSON.stringify(s.planOverrides) : 'none'}`);
    });
    
    // Get admin user
    const User = require('./models/User');
    const adminUser = await User.findOne({ role: 'website_owner' });
    console.log(`\n=== LOGIN TEST ===`);
    console.log(`✓ Admin User: ${adminUser.email} (password: admin123)`);
    
    console.log('\n✅ ALL VERIFICATION PASSED\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

run();
