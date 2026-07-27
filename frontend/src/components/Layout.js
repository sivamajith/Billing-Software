import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AppBar, Box, Drawer, IconButton, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Toolbar, Typography, Badge, useMediaQuery, useTheme,
  Divider, Avatar, Menu, MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard, PointOfSale, Receipt, People, Inventory,
  Analytics, Settings, Store, Logout, ShoppingCart, Warning, Assessment,
  DarkMode, LightMode, AccountBalance, LocalShipping, Group,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

const Layout = ({ children, title, toggleTheme, darkMode, lowStockCount = 0 }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, shop, logout } = useAuth();

  const role = user?.role;
  const shopMenus = [
    { text: 'Dashboard', icon: <Dashboard />, path: role === 'cashier' ? '/cashier' : '/shop-owner' },
    { text: 'POS System', icon: <PointOfSale />, path: '/pos' },
    { text: 'Products', icon: <ShoppingCart />, path: '/products' },
    { text: 'Inventory', icon: <Inventory />, path: '/inventory', badge: lowStockCount },
    { text: 'Invoices', icon: <Receipt />, path: '/invoices' },
    { text: 'Customers', icon: <People />, path: '/customers' },
    { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
    { text: 'Reports', icon: <Assessment />, path: '/reports' },
    { text: 'Expenses', icon: <AccountBalance />, path: '/expenses' },
    { text: 'Suppliers', icon: <LocalShipping />, path: '/suppliers' },
    { text: 'Employees', icon: <Group />, path: '/employees' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  const adminMenus = [
    { text: 'Platform Dashboard', icon: <Dashboard />, path: `/${process.env.REACT_APP_ADMIN_SECRET_PATH || 'x7k9-super-admin-portal'}` },
    { text: 'All Shops', icon: <Store />, path: `/${process.env.REACT_APP_ADMIN_SECRET_PATH || 'x7k9-super-admin-portal'}/shops` },
    { text: 'All Users', icon: <Group />, path: `/${process.env.REACT_APP_ADMIN_SECRET_PATH || 'x7k9-super-admin-portal'}/users` },
    { text: 'Audit Logs', icon: <Warning />, path: `/${process.env.REACT_APP_ADMIN_SECRET_PATH || 'x7k9-super-admin-portal'}/audit` },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  const cashierMenus = [
    { text: 'Cashier Dashboard', icon: <Dashboard />, path: '/cashier' },
    { text: 'POS System', icon: <PointOfSale />, path: '/pos' },
    { text: 'Invoices', icon: <Receipt />, path: '/invoices' },
    { text: 'Customers', icon: <People />, path: '/customers' },
  ];

  const menus = role === 'website_owner' ? adminMenus
    : role === 'cashier' ? cashierMenus : shopMenus;

  const drawer = (
    <Box sx={{ height: '100%' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Toolbar 
          sx={{ 
            background: 'linear-gradient(135deg, #00d4ff, #0066ff)',
            color: 'white',
            boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3)',
          }}
        >
          <Store sx={{ mr: 1, fontSize: '1.5rem' }} />
          <Typography variant="h6" noWrap fontWeight="bold">
            {role === 'website_owner' ? 'Admin Panel' : (shop?.name || 'Billing Pro')}
          </Typography>
        </Toolbar>
      </motion.div>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      <List>
        {menus.map((item, index) => (
          <motion.div
            key={item.text}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <ListItem disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }}
                sx={{
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 102, 255, 0.2))',
                    borderLeft: '4px solid #00d4ff',
                    borderRadius: '0 12px 12px 0',
                  },
                  '&:hover': {
                    background: 'rgba(0, 212, 255, 0.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? '#00d4ff' : 'inherit' }}>
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error">{item.icon}</Badge>
                  ) : item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          </motion.div>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(25, 35, 60, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 255, 0.95) 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0, 212, 255, 0.1)'
            : '0 8px 32px rgba(0, 102, 255, 0.1)',
        }}
      >
        <Toolbar>
          <IconButton 
            color="inherit" 
            edge="start" 
            onClick={() => setMobileOpen(!mobileOpen)} 
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              variant="h6" 
              noWrap 
              sx={{ fontWeight: 600 }}
            >
              {title}
            </Typography>
            {shop?.name && role !== 'website_owner' && (
              <Typography variant="body2" color="inherit" sx={{ opacity: 0.8 }}>
                {shop.name}
              </Typography>
            )}
          </Box>
          {toggleTheme && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <IconButton color="inherit" onClick={toggleTheme}>
                {darkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            </motion.div>
          )}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 1 }}>
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  background: 'linear-gradient(135deg, #00d4ff, #ff00ff)',
                  boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)',
                }}
              >
                {user?.name?.[0]?.toUpperCase()}
              </Avatar>
            </IconButton>
          </motion.div>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem disabled>
              <Typography variant="body2">{user?.name} ({user?.role?.replace('_', ' ')})</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { logout(); navigate('/login'); }}>
              <ListItemIcon><Logout fontSize="small" /></ListItemIcon> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          sx={{
            '& .MuiDrawer-paper': { 
              width: drawerWidth, 
              boxSizing: 'border-box',
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(180deg, rgba(10, 14, 39, 0.95) 0%, rgba(20, 30, 50, 0.95) 100%)'
                : 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 255, 0.95) 100%)',
              backdropFilter: 'blur(10px)',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, mt: 8, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
