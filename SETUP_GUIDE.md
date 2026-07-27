# 🚀 Quick Start Guide - Billing Software

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd ../frontend
npm install
```

## Step 2: Configure Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/billing_db
JWT_SECRET=your_secret_key_here_change_this_in_production
PORT=5000
NODE_ENV=development
STRIPE_API_KEY=pk_test_your_stripe_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
 
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Step 3: Start MongoDB

```bash
# Windows
mongod

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

## Step 4: Start Backend Server

```bash
cd backend
npm run dev
```

Backend should be running at: http://localhost:5000

## Step 5: Start Frontend

In a new terminal:
```bash
cd frontend
npm start
```

Frontend should open at: http://localhost:3000

## 📝 Default Test Accounts

### Admin/Website Owner
- **Email**: admin@billing.com
- **Password**: admin123
- **Role**: Super Admin

### Shop Owner
- **Email**: owner@shop.com
- **Password**: owner123
- **Role**: Shop Owner

### Cashier
- **Email**: cashier@shop.com
- **Password**: cashier123
- **Role**: Cashier

## ✨ Key Features to Try

### 1. **Login & Authentication**
   - Login with any test account
   - JWT token automatically stored
   - Logout clears session

### 2. **Dashboard Navigation**
   - Website Owner: Manage all shops
   - Shop Owner: Manage single shop
   - Cashier: Access POS system

### 3. **POS System** (`/pos`)
   - Search products
   - Add to cart
   - Process checkout
   - Print receipt

### 4. **Inventory** (`/inventory`)
   - View all products
   - Track stock levels
   - See low stock alerts
   - Monitor expiry dates

### 5. **Invoices** (`/invoices`)
   - Create new invoices
   - Generate PDF
   - Track payment status
   - Download receipts

### 6. **Customers** (`/customers`)
   - Add new customers
   - Manage profiles
   - View purchase history
   - Track loyalty points

### 7. **Products** (`/products`)
   - Add/Edit products
   - Set pricing
   - Upload images
   - Manage categories

### 8. **Analytics** (`/analytics`)
   - View sales data
   - Revenue tracking
   - Performance metrics
   - Discount analytics

## 🛠️ API Testing

Use Postman or similar tool to test APIs:

```bash
# Register
POST http://localhost:5000/api/auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}

# Login
POST http://localhost:5000/api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

# Get Current User
GET http://localhost:5000/api/auth/me
Authorization: Bearer <token>
```

## 🎨 Theme Customization

Toggle between light and dark mode:
- Click the theme button in the top navigation
- Settings are stored in browser localStorage

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px and above)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🔍 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution**: 
- Ensure MongoDB is running
- Check connection string in .env
- Verify MongoDB is installed

### Issue: "Frontend shows 404 on reload"
**Solution**:
- This is expected - just navigate using the menu
- Make sure backend API is running

### Issue: "Login not working"
**Solution**:
- Clear browser cookies
- Check backend is running on port 5000
- Verify JWT_SECRET in .env

### Issue: "Products not showing"
**Solution**:
- Need to add products first
- Login as Shop Owner
- Go to /products and add items

## 📚 File Explanations

### Backend Structure
- `server.js` - Main server file
- `middleware/auth.js` - JWT authentication
- `models/` - Database schemas
- `routes/` - API endpoints
- `.env` - Environment variables

### Frontend Structure
- `App.js` - Main component & routing
- `pages/` - Page components
- `index.js` - React entry point
- `.env` - Frontend config

## 🚀 Deployment

### Backend (Heroku)
```bash
cd backend
heroku login
heroku create billing-software-api
git push heroku main
```

### Frontend (Vercel)
```bash
cd frontend
vercel
```

## 📖 Additional Resources

- [API Documentation](./API.md)
- [Database Schema](./SCHEMA.md)
- [Deployment Guide](./DEPLOYMENT.md)

## 💡 Tips

1. **Product Search**: Use SKU or product name for quick search
2. **Low Stock Alerts**: Set reorder quantities for automatic alerts
3. **Invoices**: Always download PDF for records
4. **Thermal Printer**: Configure in Settings for automatic receipt printing
5. **Analytics**: Data updates in real-time

## 🎯 Next Steps

1. ✅ Complete the setup
2. ✅ Test with demo accounts
3. ✅ Add your shop information
4. ✅ Create products
5. ✅ Process your first sale
6. ✅ Generate reports

## 📞 Support

Having issues? Check:
1. Browser console (F12) for errors
2. Backend console for API errors
3. MongoDB logs
4. Network tab in DevTools

---

**Happy Billing! 🎉**
