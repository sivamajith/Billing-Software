import React, { useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, Alert, Button,
} from '@mui/material';
import {
  Store, People, AttachMoney, TrendingUp, Add,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI, shopsAPI } from '../services/api';
import { formatCurrency } from '../utils/helpers';
import { ADMIN_PATH } from '../utils/helpers';

const StatCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography color="text.secondary" variant="body2">{title}</Typography>
          <Typography variant="h5" fontWeight="bold">{value}</Typography>
        </Box>
        <Box sx={{ bgcolor: `${color}.light`, p: 1.5, borderRadius: 2, color: `${color}.main` }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const WebsiteOwnerDashboard = ({ toggleTheme, darkMode }) => {
  const [stats, setStats] = useState(null);
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role !== 'website_owner') {
      navigate('/login');
      return;
    }
    const load = async () => {
      try {
        const [platformRes, shopsRes] = await Promise.all([
          analyticsAPI.getPlatform(),
          shopsAPI.getAll(),
        ]);
        setStats(platformRes.data);
        setShops(shopsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [user, navigate]);

  return (
    <Layout title="Platform Admin Dashboard" toggleTheme={toggleTheme} darkMode={darkMode}>
      <Alert severity="info" sx={{ mb: 3 }}>
        🔒 Hidden Admin Panel — Full platform access control
      </Alert>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Shops" value={stats?.totalShops || 0} icon={<Store />} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Shops" value={stats?.activeShops || 0} icon={<TrendingUp />} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={<People />} color="info" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Platform Revenue" value={formatCurrency(stats?.totalRevenue)} icon={<AttachMoney />} color="warning" />
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">All Shops</Typography>
        <Button variant="contained" startIcon={<Add />}
          onClick={() => navigate(`/${ADMIN_PATH}/shops`)}>
          Manage Shops
        </Button>
        <Button variant="outlined" sx={{ ml: 2 }} onClick={() => navigate(`/${ADMIN_PATH}/plans`)}>Manage Plans</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Shop Name</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(shops.length ? shops : stats?.recentShops || []).map((shop) => (
              <TableRow key={shop._id} hover>
                <TableCell>{shop.name}</TableCell>
                <TableCell>{shop.ownerId?.name || 'N/A'}</TableCell>
                <TableCell>{shop.city || '-'}</TableCell>
                <TableCell>{shop.subscription?.plan || 'basic'}</TableCell>
                <TableCell>
                  <Chip label={shop.isActive ? 'Active' : 'Inactive'}
                    color={shop.isActive ? 'success' : 'default'} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
};

export default WebsiteOwnerDashboard;
