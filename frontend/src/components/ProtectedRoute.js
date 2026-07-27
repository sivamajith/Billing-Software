import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    const fallback = user.role === 'website_owner'
      ? `/${process.env.REACT_APP_ADMIN_SECRET_PATH || 'x7k9-super-admin-portal'}`
      : user.role === 'shop_owner' ? '/shop-owner'
      : user.role === 'cashier' ? '/cashier' : '/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;
