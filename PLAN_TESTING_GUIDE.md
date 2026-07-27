# Plan System Testing & Verification Guide

This guide walks through end-to-end testing of the 50+ feature subscription plan system.

## Prerequisites
- Backend running on http://localhost:5000
- Frontend running on http://localhost:3000
- MongoDB connected

## Step 1: Reset & Seed Database

```bash
cd backend
# Stop previous instance if running
# Delete MongoDB data (optional)
node seed.js
```

**Expected Output:**
```
✅ Seed completed!

Website Owner: admin@billing.com / admin123
Shop Owner:    owner@shop.com / owner123
Cashier:       cashier@shop.com / cashier123
```

## Step 2: Verify Plans Were Created

### Via Debug Endpoint
```bash
# Login as admin, then call debug endpoint
curl -H "Authorization: Bearer {ADMIN_TOKEN}" \
  http://localhost:5000/api/plans/debug/status
```

**Expected Response:**
```json
{
  "totalPlans": 3,
  "plans": [
    {
      "name": "Basic",
      "key": "basic",
      "featureCount": 50,
      "features": { ... 50 features ... }
    },
    {
      "name": "Professional", 
      "key": "professional",
      "featureCount": 50,
      "features": { ... 50 features ... }
    },
    {
      "name": "Enterprise",
      "key": "enterprise", 
      "featureCount": 50,
      "features": { ... ALL 50 features enabled ... }
    }
  ]
}
```

## Step 3: Test Frontend Admin Plans UI

1. **Navigate to Admin Panel:**
   - Go to `http://localhost:3000/login`
   - Login with: `admin@billing.com` / `admin123`
   - Navigate to `http://localhost:3000/x7k9-super-admin-portal`

2. **Click "Manage Plans"** button
   - Should see list of 3 plans (Basic, Professional, Enterprise)
   - Each should show name, key, monthly price

3. **Test Create Plan:**
   - Click "Create Plan"
   - Enter: Name="Test", Key="test", Monthly Price=199
   - Click Create
   - New plan should appear in list

4. **Test Assign Plan:**
   - Click "Assign to Shop" on "Professional" plan
   - When prompted, enter shop ID (from seeded data)
   - Should see "Plan assigned" message

## Step 4: Test Feature Enforcement

### Test via Shop Features Endpoint
```bash
# Get shop ID first
curl -H "Authorization: Bearer {TOKEN}" \
  http://localhost:5000/api/shops

# Then get features
curl -H "Authorization: Bearer {TOKEN}" \
  http://localhost:5000/api/shops/{SHOP_ID}/features
```

**Expected:**
```json
{
  "planId": "...professional_plan_id...",
  "features": {
    "advancedAnalytics": true,
    "supplierManagement": true,
    "bulkImport": true,
    "invoiceGeneration": true,
    ... 40+ more enabled features
  }
}
```

### Test Feature Enforcement on Protected Routes

#### 1. Test Analytics (requires advancedAnalytics=true for Professional)
```bash
# Should PASS for Professional plan
curl -H "Authorization: Bearer {OWNER_TOKEN}" \
  http://localhost:5000/api/analytics/shop/{SHOP_ID}

# Should FAIL for Basic plan (if assigned)
# Response: 403 Forbidden "Feature 'advancedAnalytics' is not enabled"
```

#### 2. Test Invoice Creation (requires invoiceGeneration=true for Basic+)
```bash
# Should PASS - Basic plan has this enabled
curl -X POST -H "Authorization: Bearer {OWNER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"shopId": "{SHOP_ID}", "items": [...]}' \
  http://localhost:5000/api/invoices

# Should FAIL if feature override disabled it
```

#### 3. Test Bulk Import (requires bulkImport=true for Professional+)
```bash
# Should PASS for Professional
curl -X POST -H "Authorization: Bearer {OWNER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"shopId": "{SHOP_ID}", "products": [...]}' \
  http://localhost:5000/api/products

# Should FAIL for Basic (403 Forbidden)
```

## Step 5: Test Plan Overrides

### Create Shop Override
```bash
# Update shop to override a feature
curl -X PUT -H "Authorization: Bearer {ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"planOverrides": {"advancedAnalytics": true}}' \
  http://localhost:5000/api/shops/{SHOP_ID}
```

### Verify Override Works
```bash
# Get features - should show advancedAnalytics: true even for Basic plan
curl -H "Authorization: Bearer {TOKEN}" \
  http://localhost:5000/api/shops/{SHOP_ID}/features
```

## Step 6: Feature Coverage Matrix

| Feature | Basic | Professional | Enterprise | Type |
|---------|:-----:|:------------:|:----------:|------|
| invoiceGeneration | ✅ | ✅ | ✅ | boolean |
| exportCSV | ✅ | ✅ | ✅ | boolean |
| exportPDF | ❌ | ✅ | ✅ | boolean |
| advancedAnalytics | ❌ | ✅ | ✅ | boolean |
| bulkImport | ❌ | ✅ | ✅ | boolean |
| supplierManagement | ❌ | ✅ | ✅ | boolean |
| webhooks | ❌ | ✅ | ✅ | boolean |
| apiAccess | none | basic | full | string |
| whiteLabel | ❌ | ❌ | ✅ | boolean |
| dedicatedSupport | ❌ | ❌ | ✅ | boolean |
| mobileApp | ❌ | ❌ | ✅ | boolean |
| workflowAutomation | ❌ | ❌ | ✅ | boolean |

*...and 38 more features*

## Step 7: Run Automated Tests

```bash
cd backend

# Unit tests for middleware
npm test -- __tests__/planAccess.test.js

# Integration tests for API
npm test -- __tests__/plansAPI.integration.test.js
```

## Common Issues & Fixes

### Issue: "Plan not found" error
**Solution:** Run `node seed.js` to create default plans

### Issue: 403 errors on all analytics
**Solution:** 
1. Verify shop has a planId assigned: `GET /api/shops/{ID}`
2. Check if feature is enabled: `GET /api/shops/{ID}/features`
3. If still failing, check middleware is registered in route

### Issue: Frontend redirects to login on Plan page
**Solution:**
1. Verify you're logged in (check localStorage for token)
2. Verify user role is 'website_owner' (check localStorage user object)
3. Clear cache: `localStorage.clear()` and re-login

### Issue: Cannot assign plan to shop
**Solution:**
1. Verify plan exists: `GET /api/plans`
2. Verify shop exists: `GET /api/shops`
3. Use exact shop and plan IDs from response

## Success Criteria ✅

- [x] 3 default plans created (Basic, Professional, Enterprise)
- [x] Each plan has 50+ feature flags
- [x] Plans can be listed and managed via frontend UI
- [x] Plans can be assigned to shops
- [x] Features can be overridden per shop
- [x] Middleware enforces feature access (403 on disabled)
- [x] Routes protected with feature checks
- [x] Tests passing for middleware and API
- [x] Feature values properly merged (plan + overrides)

## Next: Optional Enhancements

1. Add feature limits enforcement (maxProducts, maxUsers, etc.)
2. Add usage tracking and quota warnings
3. Add email notifications on plan changes
4. Add payment gateway integration for plan upgrades
5. Add trial period countdown and auto-conversion

---

**Last Updated:** 2026-07-03
**Status:** Testing & Verification Complete
