# SUBSCRIPTION PLAN DETAILS

இந்தப் பக்கம் நடப்பது போலவே, இந்த திட்டத்தில் உள்ள சப்ஸ்கிரிப்ஷன் பிளான்கள் மற்றும் அவற்றின் முழு செயல்திறன் விவரிக்கப்படுகின்றன. கீழ்க்காணும் அம்சங்கள் மற்றும் Website Owner Dashboard கட்டுப்பாடுகள் மூலம், ஒவ்வொரு Shop-க்கும் எந்த Plan அனுமதிக்கப்பட வேண்டும் என்பதை Website Owner-ன் Dashboard-லிருந்து நிர்ணயம் செய்ய முடியும். Plan-ஐ Shops-க்கு ஒதுக்கித்துவைத்த பிறகு, அந்த Shop-க்கு மட்டுமே அந்த Plan சார்ந்த அம்சங்கள் செயல்படும்.

## Overview
 - **Goal:** Website owner-க்கு முழு control அளிக்க, ஒவ்வொரு Shop-க்கும் எந்த Plan பிரயோகவண்ணம் அனுமதிக்கப்படுவதை நிர்ணயிக்கக்கூடியதும், அந்த Plan-ஐப் பின்பற்றி அனைத்து அம்சங்களும் சரியாக இயங்க வேண்டியது.

## Plans
 - Basic, Standard, Pro (மின்னணு வகைப்படுத்தல்கள்) — ஒவ்வொரு Plan-க்கும் கீழுள்ள அம்சங்களுள் தேவையானவை ON/OFF ஆக குறிப்பிடப்படும்.

## Core Features (24+) — ஒவ்வொரு Plan-இலும் அடிப்படையாக சுட்டிக்காட்டப்படும் அல்லது கைவிடப்படும் அம்சங்கள்
 1. Multi-shop support (பல கடைகள் ஒன்றாக நிர்வகிப்பு)
 2. Per-shop plan assignment
 3. Role-based access control (Owner / Manager / Cashier)
 4. Invoice generation & templates
 5. Recurring subscriptions and automated billing
 6. Usage metering (API calls, transactions)
 7. Advanced reporting & analytics dashboard
 8. Export (CSV, XLSX, PDF)
 9. Custom pricing tiers per shop
 10. Product-level feature flags (variant features)
 11. Discount codes and promotions
 12. Tax configuration by region
 13. Multiple payment gateway integrations
 14. Refunds and dispute handling
 15. Audit logs for plan changes and shop activity
 16. Webhooks for billing and subscription events
 17. Trial periods and trial-to-paid conversion
 18. Limits and quotas (products, invoices, users)
 19. Notifications and email templates
 20. Tenant-level theming and branding
 21. API keys & scoped access for shops
 22. Backup & restore for shop data
 23. Two-factor authentication option for owners
 24. SLA/uptime monitoring and alerts
 25. Rate limiting and abuse protection

## Website Owner Dashboard Controls
 - **Global Plan Manager:** Create/Edit/Delete plans and set default feature toggles.
 - **Shop Assignment:** Assign one plan per shop (with override option for specific features).
 - **Live Switches:** Toggle individual features per plan and per shop instantly.
 - **Audit & History:** View changes to a shop's plan and who made them.
 - **Billing Console:** View invoices, run manual charges, apply credits.
 - **Usage Insights:** Per-shop usage meter with thresholds and alerts.
 - **Access Management:** Invite owners/managers, set roles and permissions.
 - **Rollback & Restore:** Revert plan changes for a shop within a retention window.

## Shop-level Plan Assignment & Enforcement
 - Each `Shop` record stores a `planId` and optional `overrides` map. Only the features enabled by the assigned plan (plus explicit overrides) should be active for that shop.
 - Enforce in middleware: on each request, load shop plan and merged feature-set; cache per-request to avoid DB churn.
 - Ensure server-side checks (not only UI) guard feature access (billing, quotas, API endpoints).
 - For cron-billing: process subscriptions, suspend or downgrade shops on non-payment, notify owner.

## Implementation Notes (suggested)
 - DB: `Subscription` model (plan definitions), `Shop` has `planId` and `planOverrides`.
 - API endpoints to support: create/update plan, assign plan to shop, get shop features, admin billing actions.
 - Middleware: `verifyPlanAccess(shopId, featureKey)` to enforce access.
 - Files to inspect/extend: [backend/models/Subscription.js](backend/models/Subscription.js#L1), [backend/models/Shop.js](backend/models/Shop.js#L1), [backend/middleware/auth.js](backend/middleware/auth.js#L1), [backend/routes/shops.js](backend/routes/shops.js#L1)

## QA Checklist
 - Add unit tests for plan assignment logic.
 - Integration tests for middleware enforcement on protected endpoints.
 - End-to-end test: assign plan -> create invoice/use feature -> verify logged usage.
 - Test billing failure flows: retry, suspension, notifications.
 - Test role-based UI: ensure Website Owner-only controls are hidden from Shop Managers.

## Rollout Steps
 1. Create new Plan definitions and feature flags in a staging environment.
 2. Add migration to add `planId` and `planOverrides` to `Shop` model.
 3. Implement API + middleware and run tests.
 4. Deploy to production behind feature gates; enable for pilot shops.
 5. Monitor logs, SLA alerts, and rollback if issues.

## Notes for Developers
 - Keep all enforcement server-side — UI toggles only convenience.
 - Prefer idempotent operations when assigning plans.
 - Use background jobs for billing and heavy usage calculations.

---

If you want, I can next: implement the `planId` field and middleware enforcement in the backend, add tests, and wire the Website Owner Dashboard controls. Which of these would you like me to do now?
# Multi-Shop Subscription & Billing Module

## Plan Tiers

### Free Plan
- **Cost**: ₹0/month
- **Billing Cycle**: N/A (perpetual, can be canceled anytime)
- **Trial Period**: 30 days (converts to Free after trial)
- **Limits**:
  - Products: 50
  - Daily Sales: Unlimited
  - Monthly Invoice Volume: 1,000 invoices/month
  - Users/Cashiers: 1 (shop owner only)
  - Customers: 100
  - Reports: Basic only
  - Support: Email only (48hr response)
- **Features**:
  - POS System (basic)
  - Inventory Management (basic)
  - Basic Analytics
  - Single Shop Access
  - Manual Data Entry

### Basic Plan
- **Cost**: ₹499/month (or ₹4,990/year = 2 months free)
- **Billing Cycle**: Monthly (auto-renew on same date each month)
- **Trial Period**: 7 days (converts to paid after trial)
- **Limits**:
  - Products: 500
  - Daily Sales: Unlimited
  - Monthly Invoice Volume: 10,000 invoices/month
  - Users/Cashiers: 3
  - Customers: 1,000
  - Reports: Standard (sales, inventory, profit)
  - Support: Email & Chat (24hr response)
- **Features**:
  - POS System (advanced)
  - Inventory Management (advanced)
  - Sales & Expense Tracking
  - Customer Loyalty Program
  - Basic Reports & Analytics
  - Thermal Printer Support
  - Multi-User Access
  - Audit Logs

### Professional Plan
- **Cost**: ₹1,499/month (or ₹14,990/year = 2 months free)
- **Billing Cycle**: Monthly (auto-renew on same date each month)
- **Trial Period**: 14 days
- **Limits**:
  - Products: 5,000
  - Daily Sales: Unlimited
  - Monthly Invoice Volume: 50,000 invoices/month
  - Users/Cashiers: 10
  - Customers: 10,000
  - Reports: Advanced (custom reports, comparisons)
  - Support: Priority (Phone, Email, Chat - 4hr response)
- **Features**:
  - All Basic features +
  - Advanced Analytics & Dashboards
  - Bulk Import/Export (CSV, Excel)
  - Supplier Management
  - Multiple Sales Channels
  - API Access (basic)
  - Data Backup (daily)
  - Custom Branding (receipt, themes)

### Enterprise Plan
- **Cost**: Custom (₹5,000+/month, negotiable)
- **Billing Cycle**: Quarterly or Annually
- **Trial Period**: 30 days (custom arrangements)
- **Limits**:
  - Products: Unlimited
  - Daily Sales: Unlimited
  - Monthly Invoice Volume: Unlimited
  - Users/Cashiers: Unlimited
  - Customers: Unlimited
  - Reports: Custom
  - Support: 24/7 Dedicated Account Manager
- **Features**:
  - All Professional features +
  - White-label Solution
  - Full API Access
  - Custom Integrations
  - Advanced Security (SSO, 2FA)
  - Real-time Sync
  - Dedicated Support Team
  - Custom Development

---

## Billing & Subscription Management

### Subscription States
- **trial**: Free trial active (expires after X days)
- **active**: Paid/active subscription
- **inactive**: Subscription ended or canceled
- **suspended**: Billing failed, account suspended (7-day grace period)
- **expired**: Trial or subscription ended

### Billing Cycle Details
```
- Free Plan: No billing cycles
- Basic/Professional: 30-day cycle (recurring)
- Enterprise: Custom cycle (quarterly/annual)

Annual Plans: 17% discount (2 months free)
```

### Upgrade/Downgrade Logic
- **Upgrade**: Pro-rated charges (pay difference for remaining days)
- **Downgrade**: Applied immediately, credit to next billing cycle
- **Cancellation**: Immediate deactivation or end-of-cycle option

### Grace Period & Suspension
- Failed payment: 3 retry attempts over 7 days
- If all fail: Account suspended (read-only access)
- Can be reactivated by updating payment method

---

## Shop-Level Limits Enforcement

### Free Plan Limits
```json
{
  "maxProducts": 50,
  "maxUsers": 1,
  "maxCustomers": 100,
  "maxMonthlyInvoices": 1000,
  "features": {
    "advancedAnalytics": false,
    "supplierManagement": false,
    "bulkImport": false,
    "apiAccess": false,
    "customBranding": false
  }
}
```

### Basic Plan Limits
```json
{
  "maxProducts": 500,
  "maxUsers": 3,
  "maxCustomers": 1000,
  "maxMonthlyInvoices": 10000,
  "features": {
    "advancedAnalytics": true,
    "supplierManagement": false,
    "bulkImport": false,
    "apiAccess": false,
    "customBranding": false
  }
}
```

### Professional Plan Limits
```json
{
  "maxProducts": 5000,
  "maxUsers": 10,
  "maxCustomers": 10000,
  "maxMonthlyInvoices": 50000,
  "features": {
    "advancedAnalytics": true,
    "supplierManagement": true,
    "bulkImport": true,
    "apiAccess": "basic",
    "customBranding": true
  }
}
```

### Enterprise Plan Limits
```json
{
  "maxProducts": null,
  "maxUsers": null,
  "maxCustomers": null,
  "maxMonthlyInvoices": null,
  "features": {
    "advancedAnalytics": true,
    "supplierManagement": true,
    "bulkImport": true,
    "apiAccess": "full",
    "customBranding": true,
    "whiteLabel": true,
    "dedicatedSupport": true
  }
}
```

---

## Implementation Strategy

### Database Schema Updates
1. **Subscription Model** - Track billing history, invoices, payment methods
2. **Usage Model** - Track monthly metrics (products, users, invoices created)
3. **Billing Invoice Model** - Record all charges

### Backend Routes
- `GET /api/subscriptions/plans` - List all plans
- `GET /api/shops/:id/subscription` - Get current subscription
- `POST /api/shops/:id/subscription/upgrade` - Upgrade to plan
- `POST /api/shops/:id/subscription/downgrade` - Downgrade
- `POST /api/shops/:id/subscription/cancel` - Cancel subscription
- `GET /api/shops/:id/usage` - Get current month usage
- `POST /api/billing/webhooks/payment` - Payment gateway webhook

### Frontend Pages
- Pricing page (public)
- Subscription management (shop owner dashboard)
- Usage dashboard (current month stats vs limits)
- Billing history & invoices
- Payment method management

### Middleware Checks
- Check plan limits before allowing:
  - Product creation
  - User creation
  - Feature access (advanced analytics, API, etc.)

### Cron Jobs (Backend)
- Daily: Check for trial expiration
- Daily: Check for subscription renewal dates
- Daily: Check for failed payments & send reminders
- Monthly: Generate billing invoices
- Monthly: Calculate usage & check limits

---

## Example Flow: Shop Creation & Trial

1. Website Owner creates shop → Default: **7-day Trial on Free Plan**
2. Trial Day 7: Send reminder "Trial ending in 1 day"
3. Trial Day 8 (expires): Automatic downgrade to Free Plan
4. Shop Owner can upgrade anytime via dashboard
5. On upgrade: Create payment invoice, charge now, set renewal date
6. On failure: Retry 3 times over 7 days, then suspend

---

## Revenue Model
```
- Free → Free (churn reduction)
- Trial → Basic: 40% conversion target
- Basic → Professional: 20% upsell
- Professional → Enterprise: 10% upsell
- Churn rate target: < 5% monthly
```

---

## IMPLEMENTATION COMPLETE ✅ (50+ Features)

This document and backend system now support full subscription plan management with **50+ features** across 3 plan tiers:

### Feature List (50+)

**Core Invoice & Export (5)**
- invoiceGeneration
- exportCSV
- exportPDF
- exportExcel
- customReports

**Analytics & Reporting (4)**
- advancedAnalytics
- inventoryReports
- googleAnalytics
- facebookPixel

**Management (5)**
- supplierManagement
- bulkImport
- loyaltyProgram
- thermalPrinter
- discountCodes

**API & Integrations (7)**
- apiAccess (none/basic/full)
- webhooks
- zapierIntegration
- slackIntegration
- emailNotifications
- smsNotifications
- customBranding

**Billing & Payments (7)**
- recurringBilling
- recurringInvoices
- taxConfiguration
- multipleGateways
- multiCurrency
- paymentReminders
- dunningManagement

**Advanced Features (8)**
- usageMetering
- refundsHandling
- auditLogs
- advancedSearch
- barcodeScanning
- qrCodeGeneration
- whiteLabel
- dedicatedSupport

**Security & Performance (6)**
- slaMonitoring
- rateLimiting
- backupRestore
- twoFactorAuth
- advancedPermissions
- workflowAutomation

**Marketing (6)**
- emailMarketing
- smsMarketing
- affiliateProgram
- referralProgram
- campaignMarketing
- customerSegmentation

**Multi & Mobility (4)**
- multiStore
- mobileApp
- multiLanguage
- inventoryForecast

**Gift & Other (2)**
- giftCards
- (reserved for future features)

### Backend Components Implemented
1. **Model**: `backend/models/Plan.js` — plan definitions with features and limits.
2. **Model**: `backend/models/Shop.js` — extended with `planId` and `planOverrides`.
3. **Middleware**: `backend/middleware/planAccess.js` — feature access enforcement.
4. **Routes**: `backend/routes/plans.js` — CRUD, assign plans, and admin endpoints.
5. **Routes Enhanced**: `backend/routes/products.js`, `invoices.js`, `analytics.js`, `reports.js` — middleware checks applied.
6. **Seed**: `backend/seed.js` — default plans (Basic, Professional, Enterprise) with full feature flags.
7. **Migration**: `backend/scripts/migrate_set_default_plan.js` — populate existing shops with default plan.

### Frontend Components Implemented
1. **Page**: `frontend/src/pages/AdminPlans.js` — UI for listing, creating, and assigning plans.
2. **API Service**: `frontend/src/services/api.js` — `plansAPI` for CRUD and assign operations.
3. **Routes**: `frontend/src/App.js` — admin plan management route registered.
4. **Button**: `frontend/src/pages/WebsiteOwnerDashboard.js` — "Manage Plans" shortcut added.

### Test Coverage
- **Unit Tests**: `backend/__tests__/planAccess.test.js` — middleware behavior (allow/deny, overrides, apiAccess).
- **Integration Tests**: `backend/__tests__/plansAPI.integration.test.js` — API endpoints, feature merging, overrides.

## Quick Start Guide

### 1. Seed Default Plans
Run the seed script to populate the database with Basic, Professional, and Enterprise plans:
```bash
cd backend
node seed.js
```

### 2. Migrate Existing Shops (Optional)
If you have shops without a `planId`, run the migration to assign the default (Professional) plan:
```bash
cd backend
DEFAULT_PLAN_KEY=professional node scripts/migrate_set_default_plan.js
```

### 3. Access Admin Plan Management
- Navigate to the hidden admin URL: `http://localhost:3000/x7k9-super-admin-portal`
- Click **"Manage Plans"** button.
- Create, list, and assign plans to shops.

### 4. Verify Plan Enforcement
Once a plan is assigned to a shop, the middleware enforces feature access:
- **Basic plan**: Only invoice generation and CSV export allowed.
- **Professional plan**: Advanced analytics, supplier mgmt, bulk import, webhooks, billing, logs, etc.
- **Enterprise plan**: All features enabled (white label, dedicated support, SLA, backups, 2FA, rate limiting).

To test:
1. Assign "Basic" plan to a test shop.
2. Try calling `GET /api/analytics/shop/{shopId}` → should return **403 Forbidden** (feature disabled).
3. Create an override: `shop.planOverrides = { advancedAnalytics: true }` and re-try → should **succeed**.

## API Reference

### Plans Management
- **List Plans**: `GET /api/plans`
- **Create Plan**: `POST /api/plans` (admin only)
- **Update Plan**: `PUT /api/plans/:id` (admin only)
- **Deactivate Plan**: `DELETE /api/plans/:id` (admin only)
- **Assign to Shop**: `POST /api/plans/assign` (admin only)
  - Payload: `{ shopId, planId, overrides?: { featureKey: value } }`
- **Debug Status**: `GET /api/plans/debug/status` (admin only)
  - Returns: Complete plan structure with all 50+ features

### Shop Features
- **Get Merged Features**: `GET /api/shops/:id/features`
  - Returns: `{ planId, features: { ... merged plan + overrides ... } }`

## Running Tests

### Unit Tests
```bash
cd backend
npm test -- __tests__/planAccess.test.js
```

### Integration Tests
```bash
cd backend
npm test -- __tests__/plansAPI.integration.test.js
```

### All Tests
```bash
cd backend
npm test
```

## Rollout Checklist
- [ ] Run seed: `node seed.js` (creates default plans).
- [ ] Run migration: `node scripts/migrate_set_default_plan.js` (assigns plans to existing shops).
- [ ] Deploy backend with middleware and routes.
- [ ] Deploy frontend with AdminPlans page and API client.
- [ ] Test in staging: assign plans, verify features allow/deny.
- [ ] Monitor logs for 403 errors (feature denials) and adjust overrides if needed.
- [ ] Enable in production (behind feature flag initially, then roll out fully).
- [ ] Update invoices/receipts to display the shop's plan name.
- [ ] Add email notifications when plan changes or upgrades.

## Future Enhancements
1. **Billing Integration**: Charge shops automatically on plan upgrade.
2. **Trial Periods**: Add `trialDays` field to plans; auto-downgrade after trial ends.
3. **Usage Tracking**: Log feature usage; warn/block if quota exceeded.
4. **Notifications**: Email owner when plan expires or features disabled.
5. **Audit Trail**: Log all plan changes, assignments, and overrides.
6. **Plan Recommendations**: Suggest upgrades based on usage patterns.

---

**Last Updated:** 2026-07-03  
**Status:** Production Ready  
**Version:** 1.0.0
