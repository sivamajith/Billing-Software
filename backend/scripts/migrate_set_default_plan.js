require('dotenv').config();
const mongoose = require('mongoose');
const Shop = require('../models/Shop');
const Plan = require('../models/Plan');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const defaultPlanKey = process.env.DEFAULT_PLAN_KEY || 'professional';
    const plan = await Plan.findOne({ key: defaultPlanKey });
    if (!plan) {
      console.error(`Default plan '${defaultPlanKey}' not found. Create it first.`);
      process.exit(1);
    }

    const result = await Shop.updateMany({ planId: { $exists: false } }, { $set: { planId: plan._id } });
    console.log(`Updated ${result.nModified || result.modifiedCount} shops to default plan '${defaultPlanKey}'`);
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
};

run();
