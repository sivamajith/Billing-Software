import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Card, CardContent, TextField, Typography, Alert,
  Container, InputAdornment, IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Store, Login as LoginIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, getDashboardPath } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Email and password are required');
      return;
    }
    setLoading(true);
    try {
      const normalizedEmail = form.email.trim().toLowerCase();
      const data = await login(normalizedEmail, form.password);
      navigate(getDashboardPath(data.role));
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, md: 4 },
        py: { xs: 4, md: 6 },
        backgroundImage: `linear-gradient(150deg, rgba(8, 16, 36, 0.94) 0%, rgba(1, 8, 24, 0.82) 100%), url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1800&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at top left, rgba(255, 255, 255, 0.08), transparent 24%), radial-gradient(circle at bottom right, rgba(16, 185, 129, 0.14), transparent 22%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 5,
            overflow: 'hidden',
            background: 'rgba(7, 14, 28, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 32px 80px rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <CardContent sx={{ p: { xs: 4, md: 5 } }}>
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(255, 214, 111, 0.16), rgba(255, 255, 255, 0.06))',
                  border: '1px solid rgba(255, 214, 111, 0.18)',
                  mb: 3,
                }}
              >
                <Store sx={{ fontSize: 32, color: '#ffd36f' }} />
              </Box>
              <Typography variant="h4" fontWeight={800} sx={{ color: '#ffffff', mb: 1 }}>
                Modern billing, done premium.
              </Typography>
              <Typography sx={{ color: '#abb7d1', lineHeight: 1.8 }}>
                Login to your dashboard with a cleaner workflow, elegant visuals, and secure access.
              </Typography>
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  background: 'rgba(255, 88, 88, 0.14)',
                  color: '#ffdddd',
                  border: '1px solid rgba(255, 88, 88, 0.26)',
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                margin="normal"
                required
                autoComplete="email"
                InputLabelProps={{ sx: { color: '#a9b7d4' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255,255,255,0.05)',
                    color: '#eef7ff',
                    borderRadius: 3,
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 214, 111, 0.4)' },
                    '&.Mui-focused fieldset': { borderColor: 'rgba(255, 214, 111, 0.75)', boxShadow: '0 0 0 3px rgba(255, 214, 111, 0.12)' },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                margin="normal"
                required
                autoComplete="current-password"
                InputLabelProps={{ sx: { color: '#a9b7d4' } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPass(!showPass)} edge="end" sx={{ color: '#ffffff' }}>
                        {showPass ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255,255,255,0.05)',
                    color: '#eef7ff',
                    borderRadius: 3,
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 214, 111, 0.4)' },
                    '&.Mui-focused fieldset': { borderColor: 'rgba(255, 214, 111, 0.75)', boxShadow: '0 0 0 3px rgba(255, 214, 111, 0.12)' },
                  },
                }}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                startIcon={<LoginIcon />}
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.8,
                  background: 'linear-gradient(135deg, #f7c948 0%, #e9a91a 45%, #1f6ef5 100%)',
                  color: '#08101f',
                  fontWeight: 800,
                  textTransform: 'none',
                  borderRadius: 3,
                  boxShadow: '0 16px 36px rgba(31, 110, 245, 0.22)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ffdc78 0%, #f1b030 45%, #4f82ff 100%)',
                  },
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Box>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Typography sx={{ color: '#71809f', fontSize: '0.92rem' }}>
                Powered by premium design.
              </Typography>
              <Typography sx={{ color: '#71809f', fontSize: '0.92rem' }}>
                Secure, fast, and elegant.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
