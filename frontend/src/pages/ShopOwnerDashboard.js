import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Grid, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, Button, Alert,
} from '@mui/material';
import {
  AttachMoney, ShoppingCart, People, Warning, PointOfSale, Inventory,
  TrendingUp, 
} from '@mui/icons-material';
import Layout from '../components/Layout';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI } from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import {
  FloatingCard3D, GradientText,
} from '../components/LiquidGlassUI';
import '../styles/liquidGlass.css';

const StatCard = ({ title, value, icon, color, onClick, trend }) => (
  <FloatingCard3D delay={0}>
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        background: 'linear-gradient(135deg, rgba(20, 33, 61, 0.8) 0%, rgba(30, 45, 75, 0.8) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 8px 32px rgba(0, 212, 255, 0.15)',
        transition: 'all 0.3s ease',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography 
            color="textSecondary" 
            variant="body2" 
            sx={{ fontWeight: 500, fontSize: '0.875rem' }}
          >
            {title}
          </Typography>
          <Typography 
            variant="h5" 
            fontWeight="700" 
            sx={{ 
              mt: 1, 
              background: 'linear-gradient(135deg, #00d4ff, #ff00ff)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {value}
          </Typography>
          {trend && (
            <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 1 }}>
              <TrendingUp sx={{ fontSize: '1rem', color: '#00ff88' }} />
              <Typography variant="caption" sx={{ color: '#00ff88' }}>
                {trend}% increase
              </Typography>
            </Box>
          )}
        </Box>
        <motion.div
          whileHover={{ rotate: 10 }}
          style={{
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 102, 255, 0.2))',
            padding: '16px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00d4ff',
          }}
        >
          {icon}
        </motion.div>
      </Box>
    </motion.div>
  </FloatingCard3D>
);

const ShopOwnerDashboard = ({ toggleTheme, darkMode }) => {
  const [data, setData] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const shopId = user?.shopId;

  useEffect(() => {
    if (!shopId) return;

    analyticsAPI.getShop(shopId, 'month')
      .then((res) => {
        setData(res.data);
      })
      .catch(() => {
        setData({
          summary: { totalRevenue: 0, totalSales: 0, totalDiscount: 0, totalTax: 0 },
          lowStock: [], recentSales: [], totalCustomers: 0, totalExpenses: 0,
        });
      });
  }, [shopId]);

  const lowStockCount = data?.lowStock?.length || 0;

  return (
    <Layout title="Shop Owner Dashboard" toggleTheme={toggleTheme} darkMode={darkMode} lowStockCount={lowStockCount}>
      {!shopId && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Alert 
            severity="warning"
            icon={<ErrorOutlineIcon/>}
            sx={{ 
              background: 'linear-gradient(135deg, rgba(255, 170, 0, 0.1), rgba(255, 100, 0, 0.1))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 170, 0, 0.3)',
            }}
          >
            No shop assigned to your account.
          </Alert>
        </motion.div>
      )}

      {lowStockCount > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: '24px' }}
        >
          <Alert 
            severity="warning"
            icon={<Warning />}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => navigate('/inventory')}
                sx={{ fontWeight: 600 }}
              >
                View Inventory
              </Button>
            }
            sx={{ 
              background: 'linear-gradient(135deg, rgba(255, 170, 0, 0.1), rgba(255, 100, 0, 0.1))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 170, 0, 0.3)',
            }}
          >
            <GradientText>{lowStockCount} product(s) are running low on stock!</GradientText>
          </Alert>
        </motion.div>
      )}

      {/* Stats Cards with Animations */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Monthly Revenue" 
            value={formatCurrency(data?.summary?.totalRevenue || 0)}
            icon={<AttachMoney sx={{ fontSize: '1.5rem' }} />} 
            color="primary"
            trend={12}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Sales" 
            value={data?.summary?.totalSales || 0}
            icon={<ShoppingCart sx={{ fontSize: '1.5rem' }} />} 
            color="success" 
            onClick={() => navigate('/analytics')}
            trend={8}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Customers" 
            value={data?.totalCustomers || 0}
            icon={<People sx={{ fontSize: '1.5rem' }} />} 
            color="info" 
            onClick={() => navigate('/customers')}
            trend={15}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Low Stock Items" 
            value={lowStockCount}
            icon={<Warning sx={{ fontSize: '1.5rem' }} />} 
            color="error" 
            onClick={() => navigate('/inventory')}
          />
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              fullWidth 
              variant="contained" 
              size="large" 
              startIcon={<PointOfSale />}
              onClick={() => navigate('/pos')} 
              sx={{ 
                py: 2,
                background: 'linear-gradient(135deg, #00d4ff, #0066ff)',
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
                '&:hover': {
                  boxShadow: '0 0 30px rgba(0, 212, 255, 0.5)',
                },
              }}
            >
              Open POS System
            </Button>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={4}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Button 
              fullWidth 
              variant="outlined" 
              size="large" 
              startIcon={<Inventory />}
              onClick={() => navigate('/products')} 
              sx={{ 
                py: 2,
                border: '2px solid rgba(0, 212, 255, 0.5)',
                color: '#00d4ff',
                '&:hover': {
                  border: '2px solid rgba(0, 212, 255, 1)',
                  background: 'rgba(0, 212, 255, 0.1)',
                },
              }}
            >
              Manage Products
            </Button>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={4}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              fullWidth 
              variant="outlined" 
              size="large" 
              startIcon={<ShoppingCart />}
              onClick={() => navigate('/invoices')} 
              sx={{ 
                py: 2,
                border: '2px solid rgba(0, 212, 255, 0.5)',
                color: '#00d4ff',
                '&:hover': {
                  border: '2px solid rgba(0, 212, 255, 1)',
                  background: 'rgba(0, 212, 255, 0.1)',
                },
              }}
            >
              View Invoices
            </Button>
          </motion.div>
        </Grid>
      </Grid>

      {/* Recent Sales Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ 
            fontWeight: 700, 
            mb: 2,
            background: 'linear-gradient(135deg, #00d4ff, #ff00ff)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Recent Sales
        </Typography>
        <TableContainer 
          component={Paper}
          sx={{
            background: 'linear-gradient(135deg, rgba(20, 33, 61, 0.8) 0%, rgba(30, 45, 75, 0.8) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 212, 255, 0.15)',
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 102, 255, 0.1))' }}>
                <TableCell sx={{ fontWeight: 700, color: '#00d4ff' }}>Sale #</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#00d4ff' }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#00d4ff' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#00d4ff' }}>Payment</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#00d4ff' }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(data?.recentSales || []).map((sale, index) => (
                <TableRow
                  key={sale._id}
                  sx={{
                    '&:hover': {
                      background: 'rgba(0, 212, 255, 0.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <TableCell sx={{ color: '#e0e7ff' }}>{sale.saleNumber}</TableCell>
                  <TableCell sx={{ color: '#e0e7ff' }}>{sale.customerName}</TableCell>
                  <TableCell sx={{ color: '#00ff88', fontWeight: 600 }}>{formatCurrency(sale.total)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={sale.paymentMethod} 
                      size="small"
                      sx={{
                        background: 'rgba(0, 212, 255, 0.2)',
                        color: '#00d4ff',
                        border: '1px solid rgba(0, 212, 255, 0.4)',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#a0afc0' }}>{formatDate(sale.createdAt)}</TableCell>
                </TableRow>
              ))}
              {!data?.recentSales?.length && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3, color: '#a0afc0' }}>
                    No sales yet. Open POS System to start selling!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>
    </Layout>
  );
};

export default ShopOwnerDashboard;
