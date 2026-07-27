import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { createLiquidGlassTheme } from './theme/liquidGlassTheme';
import { AnimatedBackgroundGradient } from './components/LiquidGlassUI';
import { ADMIN_PATH } from './utils/helpers';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ShopOwnerDashboard from './pages/ShopOwnerDashboard';
import WebsiteOwnerDashboard from './pages/WebsiteOwnerDashboard';
import CashierDashboard from './pages/CashierDashboard';
import POSSystem from './pages/POSSystem';
import Invoices from './pages/Invoices';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import Expenses from './pages/Expenses';
import Suppliers from './pages/Suppliers';
import Employees from './pages/Employees';
import AdminShops from './pages/AdminShops';
import AdminUsers from './pages/AdminUsers';
import AdminAudit from './pages/AdminAudit';
import AdminPlans from './pages/AdminPlans';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const toggleTheme = () => setDarkMode(!darkMode);
  const themeProps = { toggleTheme, darkMode };

  const theme = createLiquidGlassTheme(darkMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AnimatedBackgroundGradient darkMode={darkMode} />
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Hidden Website Owner Admin URL */}
            <Route path={`/${ADMIN_PATH}`} element={
              <ProtectedRoute roles={['website_owner']}>
                <WebsiteOwnerDashboard {...themeProps} />
              </ProtectedRoute>
            } />
            <Route path={`/${ADMIN_PATH}/shops`} element={
              <ProtectedRoute roles={['website_owner']}>
                <AdminShops {...themeProps} />
              </ProtectedRoute>
            } />
            <Route path={`/${ADMIN_PATH}/users`} element={
              <ProtectedRoute roles={['website_owner']}>
                <AdminUsers {...themeProps} />
              </ProtectedRoute>
            } />
            <Route path={`/${ADMIN_PATH}/audit`} element={
              <ProtectedRoute roles={['website_owner']}>
                <AdminAudit {...themeProps} />
              </ProtectedRoute>
            } />
            <Route path={`/${ADMIN_PATH}/plans`} element={
              <ProtectedRoute roles={['website_owner']}>
                <AdminPlans {...themeProps} />
              </ProtectedRoute>
            } />

            {/* Shop Owner Routes */}
            <Route path="/shop-owner" element={
              <ProtectedRoute roles={['shop_owner']}>
                <ShopOwnerDashboard {...themeProps} />
              </ProtectedRoute>
            } />

            {/* Cashier Routes */}
            <Route path="/cashier" element={
              <ProtectedRoute roles={['cashier']}>
                <CashierDashboard {...themeProps} />
              </ProtectedRoute>
            } />

            {/* Shared Shop Routes */}
            <Route path="/pos" element={
              <ProtectedRoute roles={['shop_owner', 'cashier']}>
                <POSSystem {...themeProps} />
              </ProtectedRoute>
            } />
            <Route path="/invoices" element={
              <ProtectedRoute roles={['shop_owner', 'cashier']}>
                <Invoices {...themeProps} />
              </ProtectedRoute>
            } />
            <Route path="/customers" element={
              <ProtectedRoute roles={['shop_owner', 'cashier']}>
                <Customers {...themeProps} />
              </ProtectedRoute>
            } />
            <Route path="/products" element={
              <ProtectedRoute roles={['shop_owner']}>
                <Products {...themeProps} />
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute roles={['shop_owner']}>
                <Inventory {...themeProps} />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute roles={['shop_owner']}>
                <Analytics {...themeProps} />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute roles={['shop_owner']}>
                <Reports {...themeProps} />
              </ProtectedRoute>
            } />
            <Route path="/expenses" element={
              <ProtectedRoute roles={['shop_owner']}>
                <Expenses {...themeProps} />
              </ProtectedRoute>
            } />
            <Route path="/suppliers" element={
              <ProtectedRoute roles={['shop_owner']}>
                <Suppliers {...themeProps} />
              </ProtectedRoute>
            } />
            <Route path="/employees" element={
              <ProtectedRoute roles={['shop_owner']}>
                <Employees {...themeProps} />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute roles={['website_owner', 'shop_owner', 'cashier']}>
                <Settings {...themeProps} />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
