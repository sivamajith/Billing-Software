require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Billing API is running' });
});

app.get('/api/config', (req, res) => {
  res.json({ adminSecretPath: process.env.ADMIN_SECRET_PATH || 'x7k9-super-admin-portal' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/shops', require('./routes/shops'));
app.use('/api/products', require('./routes/products').router);
app.use('/api/plans', require('./routes/plans'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/invoices', require('./routes/invoices'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/audit', require('./routes/audit'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
