import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Select, MenuItem, Box, Chip } from '@mui/material';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { reportsAPI } from '../services/api';
import { formatCurrency } from '../utils/helpers';

const Reports = ({ toggleTheme, darkMode }) => {
  const { user } = useAuth();
  const shopId = user?.shopId;
  const [profit, setProfit] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [sales, setSales] = useState(null);
  const [summary, setSummary] = useState([]);
  const [period, setPeriod] = useState('daily');
  const [loading, setLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!shopId || !token) {
      setSummary([]);
      setProfit(null);
      setInventory(null);
      setSales(null);
      setLoading(false);
      setAuthMessage(token ? '' : 'Please sign in again to view reports.');
      return;
    }

    const loadReports = async () => {
      setLoading(true);
      setAuthMessage('');
      try {
        const [profitRes, inventoryRes, salesRes, summaryRes] = await Promise.all([
          reportsAPI.profit(shopId),
          reportsAPI.inventory(shopId),
          reportsAPI.sales(shopId),
          reportsAPI.salesSummary(shopId, { period }),
        ]);

        setProfit(profitRes.data);
        setInventory(inventoryRes.data);
        setSales(salesRes.data);
        setSummary(summaryRes.data.results || []);
      } catch (error) {
        console.error('Failed to load reports', error);
        setSummary([]);
        setAuthMessage(error.response?.status === 401 ? 'Your session expired. Please sign in again.' : 'Unable to load reports right now.');
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [shopId, period]);

  return (
    <Layout title="Reports" toggleTheme={toggleTheme} darkMode={darkMode}>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card><CardContent>
            <Typography color="text.secondary">Total Revenue</Typography>
            <Typography variant="h5">{formatCurrency(profit?.revenue)}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card><CardContent>
            <Typography color="text.secondary">Total Expenses</Typography>
            <Typography variant="h5">{formatCurrency(profit?.expenses)}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card><CardContent>
            <Typography color="text.secondary">Net Profit</Typography>
            <Typography variant="h5" color={profit?.profit >= 0 ? 'success.main' : 'error.main'}>
              {formatCurrency(profit?.profit)}
            </Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography color="text.secondary">Inventory Value</Typography>
            <Typography variant="h5">{formatCurrency(inventory?.totalValue)}</Typography>
            <Typography variant="body2" color="text.secondary">{inventory?.lowStockCount || 0} low stock items</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography color="text.secondary">Total Sales</Typography>
            <Typography variant="h5">{sales?.count || 0}</Typography>
            <Typography variant="body2">{formatCurrency(sales?.total)}</Typography>
          </CardContent></Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', mb: 2 }}>
        <Typography variant="h6">Sales Report</Typography>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="period-label">Period</InputLabel>
          <Select labelId="period-label" value={period} label="Period" onChange={(e) => setPeriod(e.target.value)}>
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Typography variant="subtitle1" gutterBottom>Sales Summary ({period})</Typography>
      {(!shopId || authMessage) && !loading && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography color="text.secondary">{authMessage || 'Sign in to a shop and reload this page to view report data.'}</Typography>
          </CardContent>
        </Card>
      )}
      {loading && <Typography color="text.secondary" sx={{ mb: 2 }}>Loading report data...</Typography>}
      {!loading && shopId && summary.length === 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography color="text.secondary">No sales found for this period yet.</Typography>
          </CardContent>
        </Card>
      )}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Period</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {summary.map((s) => (
              <TableRow key={s.period}>
                <TableCell>{s.period}</TableCell>
                <TableCell align="right">{formatCurrency(s.total)}</TableCell>
                <TableCell align="right">{s.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Sale #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Payment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(sales?.sales || []).slice(0, 20).map((s) => (
              <TableRow key={s._id}>
                <TableCell>{s.saleNumber}</TableCell>
                <TableCell>{s.customerName}</TableCell>
                <TableCell>{formatCurrency(s.total)}</TableCell>
                <TableCell>{s.paymentMethod}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
};

export default Reports;
