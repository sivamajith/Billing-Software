import React, { useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, FormControl, InputLabel, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI } from '../services/api';
import { formatCurrency } from '../utils/helpers';

const COLORS = ['#1976d2', '#dc004e', '#ed6c02', '#2e7d32', '#9c27b0'];

const Analytics = ({ toggleTheme, darkMode }) => {
  const { user } = useAuth();
  const shopId = user?.shopId;
  const [period, setPeriod] = useState('month');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!shopId) return;
      setLoading(true);
      setError('');
      try {
        const r = await analyticsAPI.getShop(shopId, period);
        setData(r.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load analytics');
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, [shopId, period]);

  const pieData = (data?.topProducts || []).map((p) => ({ name: p._id, value: p.revenue }));

  return (
    <Layout title="Analytics" toggleTheme={toggleTheme} darkMode={darkMode}>
      <Box display="flex" justifyContent="flex-end" mb={3}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Period</InputLabel>
          <Select value={period} label="Period" onChange={(e) => setPeriod(e.target.value)}>
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {!shopId && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Shop not assigned to your account. Please contact admin.
        </Alert>
      )}

      {shopId && !loading && !error && (
        <>
          {!data?.dailySales?.length && !data?.topProducts?.length && (
            <Alert severity="info" sx={{ mb: 3 }}>
              No sales data available for this period yet. Once sales are created, charts and summaries will appear here.
            </Alert>
          )}

          <Grid container spacing={3} mb={3}>
        <Grid item xs={6} md={3}>
          <Card><CardContent>
            <Typography color="text.secondary">Revenue</Typography>
            <Typography variant="h5" fontWeight="bold">{formatCurrency(data?.summary?.totalRevenue)}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card><CardContent>
            <Typography color="text.secondary">Sales Count</Typography>
            <Typography variant="h5" fontWeight="bold">{data?.summary?.totalSales || 0}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card><CardContent>
            <Typography color="text.secondary">Tax Collected</Typography>
            <Typography variant="h5" fontWeight="bold">{formatCurrency(data?.summary?.totalTax)}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card><CardContent>
            <Typography color="text.secondary">Expenses</Typography>
            <Typography variant="h5" fontWeight="bold">{formatCurrency(data?.totalExpenses)}</Typography>
          </CardContent></Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Daily Sales</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.dailySales || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Bar dataKey="revenue" fill="#1976d2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card><CardContent>
            <Typography variant="h6" gutterBottom>Top Products</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Top Selling Products</Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Qty Sold</TableCell>
                  <TableCell>Revenue</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(data?.topProducts || []).map((p, i) => (
                  <TableRow key={i}>
                    <TableCell>{p._id}</TableCell>
                    <TableCell>{p.quantity}</TableCell>
                    <TableCell>{formatCurrency(p.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
        </>
      )}
    </Layout>
  );
};

export default Analytics;
