import React, { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Grid,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import Layout from '../components/Layout';
import { shopsAPI } from '../services/api';

const AdminShops = ({ toggleTheme, darkMode }) => {
  const [shops, setShops] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ 
    name: '', 
    ownerEmail: '', 
    ownerName: '', 
    ownerPassword: 'owner123', 
    email: '',
    phone: '', 
    address: '',
    city: '', 
    gstNumber: '' 
  });

  const load = () => shopsAPI.getAll().then((r) => setShops(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.name || !form.ownerEmail || !form.ownerName) {
      setError('Shop name, owner email, and owner name are required');
      return;
    }
    try {
      setError('');
      await shopsAPI.create(form);
      setOpen(false);
      setForm({ 
        name: '', 
        ownerEmail: '', 
        ownerName: '', 
        ownerPassword: 'owner123', 
        email: '',
        phone: '', 
        address: '',
        city: '', 
        gstNumber: '' 
      });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create shop');
    }
  };

  return (
    <Layout title="Manage All Shops" toggleTheme={toggleTheme} darkMode={darkMode}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Create Shop</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Shop</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shops.map((s) => (
              <TableRow key={s._id}>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.ownerId?.name} ({s.ownerId?.email})</TableCell>
                <TableCell>{s.city}</TableCell>
                <TableCell>{s.subscription?.plan}</TableCell>
                <TableCell><Chip label={s.isActive ? 'Active' : 'Inactive'} color={s.isActive ? 'success' : 'default'} size="small" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => { setOpen(false); setError(''); }} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Shop</DialogTitle>
        <DialogContent>
          {error && <Box sx={{ mb: 2, p: 1, bgcolor: 'error.light', color: 'error.main', borderRadius: 1 }}>{error}</Box>}
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}><TextField fullWidth label="Shop Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Shop Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Owner Name *" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Owner Email *" type="email" value={form.ownerEmail} onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Owner Password" value={form.ownerPassword} onChange={(e) => setForm({ ...form, ownerPassword: e.target.value })} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="GST Number" value={form.gstNumber} onChange={(e) => setForm({ ...form, gstNumber: e.target.value })} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); setError(''); }}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default AdminShops;
