# Complete Project Structure & File Overview

## 📦 Project Root

```
billing-software/
├── backend/                          # Node.js Express API
│   ├── models/                       # MongoDB Schemas
│   │   ├── User.js                  # User/Employee model
│   │   ├── Shop.js                  # Shop model (multi-tenant)
│   │   ├── Product.js               # Product model
│   │   ├── Sales.js                 # Sales transactions
│   │   ├── Invoice.js               # Invoices
│   │   ├── Customer.js              # Customers
│   │   ├── Inventory.js             # Stock tracking
│   │   └── Payment.js               # Payment records
│   │
│   ├── routes/                       # API Endpoints
│   │   ├── auth.js                  # Login/Register
│   │   ├── users.js                 # User management
│   │   ├── shops.js                 # Shop management
│   │   ├── products.js              # Product CRUD
│   │   ├── sales.js                 # Sales/POS
│   │   ├── invoices.js              # Invoice generation & PDF
│   │   ├── customers.js             # Customer management
│   │   ├── inventory.js             # Stock management
│   │   ├── payments.js              # Payment processing
│   │   ├── employees.js             # Employee management
│   │   ├── expenses.js              # Expense tracking
│   │   ├── suppliers.js             # Supplier management
│   │   ├── analytics.js             # Sales analytics
│   │   ├── reports.js               # Report generation
│   │   └── audit.js                 # Audit logs
│   │
│   ├── middleware/
│   │   └── auth.js                  # JWT verification
│   │
│   ├── public/                       # Static files
│   │   └── invoices/                # Generated PDFs
│   │
│   ├── server.js                    # Express server setup
│   ├── package.json                 # Backend dependencies
│   ├── .env                         # Environment variables
│   └── .gitignore
│
├── frontend/                         # React Application
│   ├── src/
│   │   ├── pages/                   # Page Components
│   │   │   ├── Login.js             # Authentication page
│   │   │   ├── Dashboard.js         # Role selection dashboard
│   │   │   ├── ShopOwnerDashboard.js # Shop owner view
│   │   │   ├── WebsiteOwnerDashboard.js # Admin view
│   │   │   ├── POSSystem.js         # Point of Sale interface
│   │   │   ├── Invoices.js          # Invoice management
│   │   │   ├── Customers.js         # Customer management
│   │   │   ├── Products.js          # Product management
│   │   │   ├── Inventory.js         # Stock management
│   │   │   ├── Analytics.js         # Analytics dashboard
│   │   │   └── Settings.js          # Settings page
│   │   │
│   │   ├── App.js                   # Main app component
│   │   ├── index.js                 # React entry point
│   │   └── setupTests.js            # Test configuration
│   │
│   ├── public/
│   │   └── index.html               # HTML template
│   │
│   ├── package.json                 # Frontend dependencies
│   ├── .env                         # Frontend config
│   └── .gitignore
│
├── README.md                        # Project documentation
├── SETUP_GUIDE.md                   # Quick start guide
└── .gitignore                       # Git configuration

```

## 📊 Database Models

### User Schema
- firstName, lastName, email, phone
- password (hashed with bcrypt)
- role (admin, shop_owner, cashier, employee)
- shop (reference)
- status, permissions
- lastLogin, loginAttempts

### Shop Schema
- name, owner (reference)
- contact info (email, phone, address)
- tax ID, business license
- subscription plan (free, basic, pro, enterprise)
- settings (printer, theme, language)
- timestamps

### Product Schema
- name, description, SKU, barcode
- price, costPrice, discount, tax
- category, subcategory
- quantity, lowStockThreshold
- supplier reference
- status (active, inactive, discontinued)

### Sales Schema
- shop, cashier, customer references
- items array (product, quantity, prices)
- subtotal, discount, tax, total
- paymentMethod, paymentStatus
- invoiceNumber, notes
- receiptPrinted flag

### Invoice Schema
- invoiceNumber (unique)
- sales/customer reference
- issueDate, dueDate
- items array
- financial totals
- payment tracking
- status (pending, partial, paid, overdue)

### Inventory Schema
- shop, product references
- quantity tracking
- lowStockThreshold, reorderQuantity
- warehouseLocation, expiryDate, batchNumber
- status (in_stock, low_stock, out_of_stock, expired)

### Customer Schema
- firstName, lastName, contact info
- loyaltyPoints, totalPurchases, totalSpent
- customerType (retail, wholesale, vip)
- creditLimit, outstandingBalance
- status (active, inactive, blacklisted)

## 🔗 API Routes Summary

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Current user profile

### Users (Protected)
- `GET /api/users` - List all users (admin only)
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Shops
- `POST /api/shops` - Create new shop
- `GET /api/shops` - List user's shops
- `GET /api/shops/:id` - Shop details
- `PUT /api/shops/:id` - Update shop

### Products
- `GET /api/products/shop/:shopId` - List shop products
- `POST /api/products` - Add product
- `GET /api/products/:id` - Product details
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Sales
- `POST /api/sales` - Create sale/transaction
- `GET /api/sales/shop/:shopId` - Shop sales history

### Invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/shop/:shopId` - List invoices
- `GET /api/invoices/:id/pdf` - Download PDF

### Customers
- `POST /api/customers` - Add customer
- `GET /api/customers/shop/:shopId` - List customers
- `PUT /api/customers/:id` - Update customer

### Inventory
- `GET /api/inventory/shop/:shopId` - Stock levels
- `GET /api/inventory/shop/:shopId/low-stock` - Low stock items
- `PUT /api/inventory/:id` - Update stock

### Other Routes
- `GET /api/payments/:invoiceId` - Payment history
- `GET /api/employees/shop/:shopId` - Employee list
- `GET /api/expenses/shop/:shopId` - Expenses
- `GET /api/suppliers/shop/:shopId` - Suppliers
- `GET /api/analytics/shop/:shopId` - Analytics data
- `GET /api/reports/*` - Various reports
- `GET /api/audit/shop/:shopId` - Audit logs

## 🎨 Frontend Components

### Pages
1. **Login** - Authentication interface
2. **Dashboard** - Role-based entry point
3. **ShopOwnerDashboard** - Shop metrics & controls
4. **WebsiteOwnerDashboard** - Multi-shop management
5. **POSSystem** - Transaction processing
6. **Invoices** - Invoice management & PDF
7. **Customers** - Customer database
8. **Products** - Inventory management
9. **Inventory** - Stock tracking & alerts
10. **Analytics** - Sales & performance metrics
11. **Settings** - App configuration

## 🔐 Authentication Flow

1. User logs in with email/password
2. Backend validates credentials
3. JWT token generated
4. Token stored in localStorage
5. Token sent with each API request
6. Server verifies token
7. Role-based access control applied

## 💾 Data Flow

```
Frontend (React)
    ↓
Axios HTTP Request
    ↓
Express Server
    ↓
Middleware (Auth Check)
    ↓
Route Handler
    ↓
Database Query (MongoDB)
    ↓
Response JSON
    ↓
Frontend Update
```

## 🎯 30+ Features Breakdown

### Core System (6)
1. JWT Authentication
2. Role-Based Access Control
3. Multi-tenant Architecture
4. Responsive Design
5. Dark/Light Theme
6. User Management

### POS & Sales (8)
7. Point of Sale System
8. Shopping Cart
9. Receipt Printing
10. Thermal Printer Support
11. Payment Processing
12. Transaction History
13. Sales Reports
14. Discount Management

### Billing (7)
15. Invoice Generation
16. PDF Export
17. Invoice Tracking
18. Payment Status
19. Due Date Reminders
20. Multi-currency Support
21. Tax Calculation

### Inventory (6)
22. Product Management
23. Stock Tracking
24. Low Stock Alerts
25. Barcode Support
26. Batch Tracking
27. Expiry Date Management

### Customer Management (5)
28. Customer Database
29. Purchase History
30. Loyalty Points
31. Credit Management
32. Customer Segmentation

### Analytics & Reporting (5+)
33. Sales Analytics
34. Revenue Tracking
35. Performance Reports
36. Expense Reports
37. Audit Logs
38. Data Export

## 📝 Environment Variables

### Backend
- `MONGODB_URI` - MongoDB connection
- `JWT_SECRET` - Token signing key
- `PORT` - Server port
- `NODE_ENV` - Environment (dev/prod)
- `STRIPE_API_KEY` - Payment processing
 

### Frontend
- `REACT_APP_API_URL` - Backend API URL

---

This comprehensive structure provides:
✅ Scalability for multi-shop operations
✅ Security with JWT and role-based access
✅ Complete business functionality
✅ Modern, responsive UI
✅ Complete audit trail
✅ Export capabilities
