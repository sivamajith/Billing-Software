import React, { useCallback, useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { suppliersAPI } from '../services/api';

const Suppliers = ({ toggleTheme, darkMode }) => {
  const { user } = useAuth();
  const shopId = user?.shopId;
  const [suppliers, setSuppliers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });

  const load = useCallback(() => {
    if (!shopId) return;
    suppliersAPI.getByShop(shopId).then((r) => setSuppliers(r.data)).catch(() => {});
  }, [shopId]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    await suppliersAPI.create({ ...form, shopId });
    setOpen(false);
    setForm({ name: '', email: '', phone: '', address: '' });
    load();
  };

  return (
    <Layout title="Suppliers" toggleTheme={toggleTheme} darkMode={darkMode}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Add Supplier</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((s) => (
              <TableRow key={s._id}>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell>{s.phone}</TableCell>
                <TableCell>{s.address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Supplier</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}><TextField fullWidth label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Suppliers;
