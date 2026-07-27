import React, { useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
} from '@mui/material';
import { PointOfSale, Receipt, ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { salesAPI } from '../services/api';
import { formatCurrency, formatDateTime } from '../utils/helpers';

const CashierDashboard = ({ toggleTheme, darkMode }) => {
  const [sales, setSales] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const shopId = user?.shopId;

  useEffect(() => {
    if (!shopId) return;
    salesAPI.getByShop(shopId).then((res) => setSales(res.data.slice(0, 10))).catch(() => {});
  }, [shopId]);

  const todaySales = sales.filter((s) => {
    const d = new Date(s.createdAt);
    const t = new Date();
    return d.toDateString() === t.toDateString();
  });
  const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0);

  return (
    <Layout title="Cashier Dashboard" toggleTheme={toggleTheme} darkMode={darkMode}>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={4}>
          <Card><CardContent>
            <Typography color="text.secondary">Today's Sales</Typography>
            <Typography variant="h4" fontWeight="bold">{todaySales.length}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card><CardContent>
            <Typography color="text.secondary">Today's Revenue</Typography>
            <Typography variant="h4" fontWeight="bold">{formatCurrency(todayTotal)}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button fullWidth variant="contained" size="large" startIcon={<PointOfSale />}
            onClick={() => navigate('/pos')} sx={{ height: '100%', py: 3 }}>
            Start New Sale
          </Button>
        </Grid>
      </Grid>

      <Box display="flex" gap={2} mb={3}>
        <Button variant="outlined" startIcon={<Receipt />} onClick={() => navigate('/invoices')}>Invoices</Button>
        <Button variant="outlined" startIcon={<ShoppingCart />} onClick={() => navigate('/customers')}>Customers</Button>
      </Box>

      <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Sale #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale._id}>
                <TableCell>{sale.saleNumber}</TableCell>
                <TableCell>{sale.customerName}</TableCell>
                <TableCell>{formatCurrency(sale.total)}</TableCell>
                <TableCell><Chip label={sale.paymentMethod} size="small" /></TableCell>
                <TableCell>{formatDateTime(sale.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
};

export default CashierDashboard;
