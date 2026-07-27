# 📚 Complete API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except `/auth/register` and `/auth/login`) require JWT token in header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "shop_owner"
}

Response: 200 OK
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "507f...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "shop_owner"
  }
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { ... }
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "user": { ... }
}
```

---

## 👥 User Management Endpoints

### List All Users (Admin Only)
```http
GET /users
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "users": [ ... ]
}
```

### Get User Details
```http
GET /users/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "user": { ... }
}
```

### Update User
```http
PUT /users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "status": "active"
}

Response: 200 OK
{
  "success": true,
  "user": { ... }
}
```

### Delete User (Admin Only)
```http
DELETE /users/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "User deleted"
}
```

---

## 🏪 Shop Management Endpoints

### Create Shop
```http
POST /shops
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Store",
  "email": "store@example.com",
  "phone": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA"
}

Response: 201 Created
{
  "success": true,
  "shop": { ... }
}
```

### Get All Shops (for Owner)
```http
GET /shops
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "shops": [ ... ]
}
```

### Get Shop Details
```http
GET /shops/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "shop": { ... }
}
```

### Update Shop
```http
PUT /shops/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Store Name",
  "phone": "+1234567890",
  "settings": {
    "theme": "dark",
    "language": "en"
  }
}

Response: 200 OK
{
  "success": true,
  "shop": { ... }
}
```

---

## 📦 Product Management Endpoints

### Add Product
```http
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "shopId": "507f...",
  "name": "Product Name",
  "sku": "SKU123",
  "barcode": "123456789",
  "category": "Electronics",
  "price": 99.99,
  "costPrice": 50.00,
  "quantity": 100,
  "lowStockThreshold": 10,
  "description": "Product description"
}

Response: 201 Created
{
  "success": true,
  "product": { ... }
}
```

### Get Shop Products
```http
GET /products/shop/:shopId
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "products": [ ... ]
}
```

### Get Product Details
```http
GET /products/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "product": { ... }
}
```

### Update Product
```http
PUT /products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Product",
  "price": 129.99,
  "quantity": 50
}

Response: 200 OK
{
  "success": true,
  "product": { ... }
}
```

### Delete Product
```http
DELETE /products/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Product deleted"
}
```

---

## 🛒 Sales/POS Endpoints

### Create Sale
```http
POST /sales
Authorization: Bearer <token>
Content-Type: application/json

{
  "shopId": "507f...",
  "customer": "507f...",
  "items": [
    {
      "product": "507f...",
      "quantity": 2,
      "unitPrice": 99.99,
      "subtotal": 199.98,
      "tax": 20.00
    }
  ],
  "paymentMethod": "cash",
  "discount": 10,
  "notes": "Sale notes"
}

Response: 201 Created
{
  "success": true,
  "sale": {
    "invoiceNumber": "INV-1234567890",
    "total": 209.98,
    ...
  }
}
```

### Get Shop Sales
```http
GET /sales/shop/:shopId
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "sales": [ ... ]
}
```

### Get Sale Details
```http
GET /sales/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "sale": { ... }
}
```

---

## 📄 Invoice Endpoints

### Create Invoice
```http
POST /invoices
Authorization: Bearer <token>
Content-Type: application/json

{
  "shopId": "507f...",
  "customer": "507f...",
  "items": [ ... ],
  "dueDate": "2026-07-10",
  "discount": 0
}

Response: 201 Created
{
  "success": true,
  "invoice": {
    "invoiceNumber": "INV-001",
    ...
  }
}
```

### Get Shop Invoices
```http
GET /invoices/shop/:shopId
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "invoices": [ ... ]
}
```

### Download Invoice PDF
```http
GET /invoices/:id/pdf
Authorization: Bearer <token>

Response: 200 (File Download)
Binary PDF file
```

---

## 👨‍💼 Customer Endpoints

### Add Customer
```http
POST /customers
Authorization: Bearer <token>
Content-Type: application/json

{
  "shopId": "507f...",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Street",
  "city": "City",
  "customerType": "retail"
}

Response: 201 Created
{
  "success": true,
  "customer": { ... }
}
```

### Get Shop Customers
```http
GET /customers/shop/:shopId
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "customers": [ ... ]
}
```

### Update Customer
```http
PUT /customers/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "phone": "+1234567890",
  "loyaltyPoints": 100
}

Response: 200 OK
{
  "success": true,
  "customer": { ... }
}
```

---

## 📦 Inventory Endpoints

### Get Inventory
```http
GET /inventory/shop/:shopId
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "inventory": [ ... ]
}
```

### Get Low Stock Items
```http
GET /inventory/shop/:shopId/low-stock
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "lowStock": [ ... ]
}
```

### Update Inventory
```http
PUT /inventory/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 50,
  "lowStockThreshold": 10
}

Response: 200 OK
{
  "success": true,
  "inventory": { ... }
}
```

---

## 💳 Payment Endpoints

### Record Payment
```http
POST /payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "invoiceId": "507f...",
  "amount": 500.00,
  "paymentMethod": "card",
  "notes": "Payment received"
}

Response: 201 Created
{
  "success": true,
  "payment": { ... }
}
```

### Get Payments for Invoice
```http
GET /payments/:invoiceId
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "payments": [ ... ]
}
```

---

## 📊 Analytics Endpoints

### Get Shop Analytics
```http
GET /analytics/shop/:shopId
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "analytics": {
    "totalSales": 150,
    "totalRevenue": 15000.00,
    "totalDiscount": 500.00,
    "averageTransaction": 100.00
  }
}
```

---

## 📝 Reports Endpoints

### Get Sales Report
```http
GET /reports/sales/:shopId
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "report": { ... }
}
```

### Get Inventory Report
```http
GET /reports/inventory/:shopId
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "report": { ... }
}
```

---

## 🔍 Audit Log Endpoints

### Get Audit Logs
```http
GET /audit/shop/:shopId
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "logs": [ ... ]
}
```

---

## 👨‍💼 Employee Endpoints

### Add Employee
```http
POST /employees
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "position": "Cashier",
  "salary": 2000,
  "shopId": "507f..."
}

Response: 201 Created
```

### Get Employees
```http
GET /employees/shop/:shopId
Authorization: Bearer <token>

Response: 200 OK
```

---

## 💰 Expense Endpoints

### Add Expense
```http
POST /expenses
Authorization: Bearer <token>
Content-Type: application/json

{
  "shopId": "507f...",
  "category": "Rent",
  "amount": 1000,
  "description": "Monthly rent"
}

Response: 201 Created
```

### Get Expenses
```http
GET /expenses/shop/:shopId
Authorization: Bearer <token>

Response: 200 OK
```

---

## 🏭 Supplier Endpoints

### Add Supplier
```http
POST /suppliers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Supplier Name",
  "email": "supplier@example.com",
  "phone": "+1234567890"
}

Response: 201 Created
```

### Get Suppliers
```http
GET /suppliers/shop/:shopId
Authorization: Bearer <token>

Response: 200 OK
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token provided" | "Invalid token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Unauthorized role"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid request data"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid data |
| 401 | Unauthorized - No/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal error |

---

## Rate Limiting

Currently unlimited. Future versions will include:
- 100 requests per minute per user
- 1000 requests per minute per IP

---

## Pagination (Future)

```http
GET /products/shop/:shopId?page=1&limit=20

Response:
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## Sorting (Future)

```http
GET /sales/shop/:shopId?sort=-createdAt&sortBy=total

Response: Sorted results
```

---

## Filtering (Future)

```http
GET /sales/shop/:shopId?status=completed&paymentStatus=paid

Response: Filtered results
```

---

**API Version**: 1.0.0  
**Last Updated**: June 2026  
**Status**: Production Ready
