# Billing Software - SaaS Platform

A comprehensive, modern billing and POS system built with React, Node.js, Express, and MongoDB. This platform supports multiple dashboards (Website Owner, Shop Owner, Cashier), invoice generation, PDF printing, thermal printer support, inventory management, and more.

## 🎯 Features (30+)

### Core Features
- ✅ User Authentication (JWT)
- ✅ Role-Based Access Control (Admin, Shop Owner, Cashier, Employee)
- ✅ Multi-tenant SaaS System
- ✅ Responsive Design (Mobile, Tablet, Desktop)
- ✅ Dark/Light Mode Toggle

### Dashboard Features
- ✅ Website Owner Dashboard (manage all shops)
- ✅ Shop Owner Dashboard (manage single shop)
- ✅ Employee Dashboard
- ✅ Real-time Analytics

### POS System
- ✅ Point of Sale (POS) System
- ✅ Shopping Cart Management
- ✅ Quick Product Search
- ✅ Receipt Printing
- ✅ Thermal Printer Support
- ✅ Payment Processing

### Inventory Management
- ✅ Product Management
- ✅ Stock Tracking
- ✅ Low Stock Alerts
- ✅ Inventory Audit
- ✅ Barcode Support

### Billing & Invoicing
- ✅ Invoice Generation
- ✅ PDF Export
- ✅ Payment Status Tracking
- ✅ Invoice History
- ✅ Multiple Payment Methods

### Customer Management
- ✅ Customer Database
- ✅ Customer History
- ✅ Loyalty Points System
- ✅ Credit Management
- ✅ Customer Segmentation

### Additional Features
- ✅ Sales Analytics
- ✅ Revenue Tracking
- ✅ Expense Management
- ✅ Employee Management
- ✅ Supplier Management
- ✅ Audit Logs
- ✅ Reports Generation
- ✅ Multi-language Support
- ✅ Advanced Search
- ✅ Data Export

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- PDFKit (PDF Generation)
- Stripe (Payment Processing)

### Frontend
- React 18
- Material-UI (MUI)
- Axios
- React Router
- HTML2Canvas
- jsPDF

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd billing-software
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/billing_db
JWT_SECRET=your_jwt_secret_key_change_this
PORT=5000
NODE_ENV=development
STRIPE_API_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret

```

Start MongoDB:
```bash
mongod
```

Start Backend:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Start Frontend:
```bash
npm start
```

## 📖 Usage

### Default Users

#### Website Owner
- Email: admin@billing.com
- Password: admin123

#### Shop Owner
- Email: owner@shop.com
- Password: owner123

#### Cashier
- Email: cashier@shop.com
- Password: cashier123

### Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Documentation**: http://localhost:5000/api-docs

## 📁 Project Structure

```
billing-software/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Shop.js
│   │   ├── Product.js
│   │   ├── Sales.js
│   │   ├── Invoice.js
│   │   ├── Customer.js
│   │   ├── Inventory.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── shops.js
│   │   ├── products.js
│   │   ├── sales.js
│   │   ├── invoices.js
│   │   ├── customers.js
│   │   ├── inventory.js
│   │   ├── analytics.js
│   │   └── more...
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── ShopOwnerDashboard.js
│   │   │   ├── WebsiteOwnerDashboard.js
│   │   │   ├── POSSystem.js
│   │   │   ├── Invoices.js
│   │   │   ├── Customers.js
│   │   │   ├── Products.js
│   │   │   ├── Inventory.js
│   │   │   ├── Analytics.js
│   │   │   └── Settings.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── .env
└── README.md
```

## 🔐 Security Features

- JWT Token Authentication
- Password Hashing (bcrypt)
- Role-Based Access Control
- Protected API Routes
- SQL Injection Prevention
- XSS Protection

## 💰 Subscription Plans

- **Free**: Limited features
- **Basic**: $9/month
- **Professional**: $29/month
- **Enterprise**: Custom pricing

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products/shop/:shopId` - Get all products
- `POST /api/products` - Add new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Sales
- `POST /api/sales` - Create sale
- `GET /api/sales/shop/:shopId` - Get sales

### Invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/shop/:shopId` - Get invoices
- `GET /api/invoices/:id/pdf` - Download invoice PDF

### Customers
- `POST /api/customers` - Add customer
- `GET /api/customers/shop/:shopId` - Get customers
- `PUT /api/customers/:id` - Update customer

### Inventory
- `GET /api/inventory/shop/:shopId` - Get inventory
- `GET /api/inventory/shop/:shopId/low-stock` - Get low stock items
- `PUT /api/inventory/:id` - Update inventory

## 🖨️ Printer Support

The system supports:
- Regular Ink Printers
- Thermal Printers (58mm, 80mm)
- Receipt Printers
- PDF Generation

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in .env
- Verify port 27017 is accessible

### Frontend Not Loading
- Clear browser cache
- Check if backend is running
- Verify REACT_APP_API_URL

### Authentication Issues
- Check JWT_SECRET in .env
- Verify token expiration
- Clear localStorage and login again

## 📝 License

This project is licensed under the MIT License.

## 🤝 Support

For support, email support@billingsoftware.com or create an issue in the repository.

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com)
- [Material-UI Docs](https://mui.com)

---

**Version**: 1.0.0  
**Last Updated**: June 2026
