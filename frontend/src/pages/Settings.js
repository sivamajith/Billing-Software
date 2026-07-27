import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Grid, TextField, Button, Divider, Switch,
  FormControlLabel, Alert, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { Save } from '@mui/icons-material';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { shopsAPI } from '../services/api';

const Settings = ({ toggleTheme, darkMode }) => {
  const { user, shop, loadUser } = useAuth();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', address: '', city: '', gstNumber: '',
    currency: 'INR', taxRate: 18, lowStockThreshold: 10, receiptFooter: 'Thank you for shopping!',
    thermalPrinterWidth: 80, enableLoyalty: true,
  });

  useEffect(() => {
    if (shop) {
      setForm({
        name: shop.name || '',
        phone: shop.phone || '',
        address: shop.address || '',
        city: shop.city || '',
        gstNumber: shop.gstNumber || '',
        currency: shop.currency || 'INR',
        taxRate: shop.taxRate || 18,
        lowStockThreshold: shop.settings?.lowStockThreshold || 10,
        receiptFooter: shop.settings?.receiptFooter || 'Thank you for shopping!',
        thermalPrinterWidth: shop.settings?.thermalPrinterWidth || 80,
        enableLoyalty: shop.settings?.enableLoyalty ?? true,
      });
    }
  }, [shop]);

  const handleSave = async () => {
    if (!shop?._id) return;
    await shopsAPI.update(shop._id, {
      name: form.name,
      phone: form.phone,
      address: form.address,
      city: form.city,
      gstNumber: form.gstNumber,
      currency: form.currency,
      taxRate: form.taxRate,
      settings: {
        lowStockThreshold: form.lowStockThreshold,
        receiptFooter: form.receiptFooter,
        thermalPrinterWidth: form.thermalPrinterWidth,
        enableLoyalty: form.enableLoyalty,
      },
    });
    await loadUser();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Layout title="Settings" toggleTheme={toggleTheme} darkMode={darkMode}>
      {saved && <Alert severity="success" sx={{ mb: 2 }}>Settings saved successfully!</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Shop Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}><TextField fullWidth label="Shop Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Grid>
                <Grid item xs={6}><TextField fullWidth label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Grid>
                <Grid item xs={6}><TextField fullWidth label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></Grid>
                <Grid item xs={12}><TextField fullWidth label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Grid>
                <Grid item xs={6}><TextField fullWidth label="GST Number" value={form.gstNumber} onChange={(e) => setForm({ ...form, gstNumber: e.target.value })} /></Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select value={form.currency} label="Currency" onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                      {['INR', 'USD', 'EUR', 'GBP', 'AED'].map((currency) => (
                        <MenuItem key={currency} value={currency}>{currency}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}><TextField fullWidth label="Tax Rate (%)" type="number" value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: e.target.value })} /></Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>POS & Printer Settings</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Thermal Printer Width</InputLabel>
                    <Select value={form.thermalPrinterWidth} label="Thermal Printer Width"
                      onChange={(e) => setForm({ ...form, thermalPrinterWidth: e.target.value })}>
                      <MenuItem value={58}>58mm</MenuItem>
                      <MenuItem value={80}>80mm</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}><TextField fullWidth label="Receipt Footer Text" value={form.receiptFooter} onChange={(e) => setForm({ ...form, receiptFooter: e.target.value })} /></Grid>
                <Grid item xs={12}><TextField fullWidth label="Low Stock Threshold" type="number" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} /></Grid>
                <Grid item xs={12}>
                  <FormControlLabel control={<Switch checked={form.enableLoyalty} onChange={(e) => setForm({ ...form, enableLoyalty: e.target.checked })} />}
                    label="Enable Loyalty Points" />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Account</Typography>
              <Typography>Name: {user?.name}</Typography>
              <Typography>Email: {user?.email}</Typography>
              <Typography>Role: {user?.role?.replace('_', ' ')}</Typography>
              <Divider sx={{ my: 2 }} />
              <FormControlLabel control={<Switch checked={darkMode} onChange={toggleTheme} />} label="Dark Mode" />
            </CardContent>
          </Card>
        </Grid>

        {shop?._id && (
          <Grid item xs={12}>
            <Button variant="contained" startIcon={<Save />} onClick={handleSave} size="large">Save Settings</Button>
          </Grid>
        )}
      </Grid>
    </Layout>
  );
};

export default Settings;
