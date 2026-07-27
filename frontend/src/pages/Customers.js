import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Chip, Grid, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { Add, Edit, Delete, UploadFile, Download } from '@mui/icons-material';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { customersAPI } from '../services/api';
import { formatCurrency, arrayToCSV, downloadCSV, parseCSV } from '../utils/helpers';

const emptyCustomer = { name: '', email: '', phone: '', address: '', type: 'regular', creditLimit: 0 };

const Customers = ({ toggleTheme, darkMode }) => {
  const { user } = useAuth();
  const shopId = user?.shopId;
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyCustomer);
  const [editId, setEditId] = useState(null);
  const [importError, setImportError] = useState('');
  const fileRef = useRef();

  const load = useCallback(() => {
    if (!shopId) return;
    customersAPI.getByShop(shopId).then((r) => setCustomers(r.data)).catch(() => {});
  }, [shopId]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    const data = { ...form, shopId, creditLimit: parseFloat(form.creditLimit) || 0 };
    if (editId) await customersAPI.update(editId, data);
    else await customersAPI.create(data);
    setOpen(false);
    setForm(emptyCustomer);
    setEditId(null);
    load();
  };

  const handleExport = () => {
    const csv = arrayToCSV(customers, ['name', 'phone', 'email', 'address', 'type', 'creditLimit', 'loyaltyPoints']);
    downloadCSV('customers.csv', csv);
  };

  const handleImportFile = () => {
    fileRef.current?.click();
  };

  const handleImport = async (event) => {
    setImportError('');
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const rows = parseCSV(text);
    const items = rows.map((row) => ({
      ...emptyCustomer,
      name: row.name || row.Name,
      phone: row.phone || row.Phone || '',
      email: row.email || row.Email || '',
      address: row.address || row.Address || '',
      type: row.type || row.Type || 'regular',
      creditLimit: parseFloat(row.creditLimit || row.CreditLimit || 0) || 0,
    })).filter((item) => item.name);

    if (!items.length) {
      setImportError('No valid customers found in CSV.');
      return;
    }

    try {
      await Promise.all(items.map((item) => customersAPI.create({ ...item, shopId })));
      load();
    } catch (error) {
      setImportError('Failed to import customers. Check CSV format and try again.');
    }
  };

  return (
    <Layout title="Customers" toggleTheme={toggleTheme} darkMode={darkMode}>
      <Box display="flex" justifyContent="flex-end" gap={1} mb={2}>
        <Button variant="outlined" startIcon={<Download />} onClick={handleExport}>Export CSV</Button>
        <Button variant="outlined" startIcon={<UploadFile />} onClick={handleImportFile}>Import CSV</Button>
        <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleImport} />
        <Button variant="contained" startIcon={<Add />} onClick={() => { setForm(emptyCustomer); setEditId(null); setOpen(true); }}>
          Add Customer
        </Button>
      </Box>
      {importError && <Box color="error.main" mb={2}>{importError}</Box>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Loyalty Points</TableCell>
              <TableCell>Total Purchases</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c._id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell><Chip label={c.type} size="small" color={c.type === 'vip' ? 'warning' : 'default'} /></TableCell>
                <TableCell>{c.loyaltyPoints}</TableCell>
                <TableCell>{formatCurrency(c.totalPurchases)}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => { setForm(c); setEditId(c._id); setOpen(true); }}><Edit /></IconButton>
                  <IconButton size="small" color="error" onClick={async () => { await customersAPI.delete(c._id); load(); }}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}><TextField fullWidth label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select value={form.type} label="Type" onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <MenuItem value="regular">Regular</MenuItem>
                  <MenuItem value="vip">VIP</MenuItem>
                  <MenuItem value="wholesale">Wholesale</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}><TextField fullWidth label="Credit Limit" type="number" value={form.creditLimit} onChange={(e) => setForm({ ...form, creditLimit: e.target.value })} /></Grid>
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

export default Customers;
