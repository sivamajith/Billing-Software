import React, { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Grid,
  FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';

const Employees = ({ toggleTheme, darkMode }) => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'cashier', phone: '' });

  const load = () => {
    setError('');
    usersAPI.getAll().then((r) => setEmployees(r.data)).catch((err) => {
      console.error('Failed to load employees:', err);
      setError('Unable to load employees. Please refresh or log in again.');
    });
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Name, email, and password are required.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    try {
      await usersAPI.create({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
        phone: form.phone.trim(),
        shopId: user?.shopId,
      });
      setOpen(false);
      setForm({ name: '', email: '', password: '', role: 'cashier', phone: '' });
      load();
    } catch (err) {
      console.error('Create employee failed:', err);
      setError(err.response?.data?.message || 'Unable to add employee.');
    }
  };

  return (
    <Layout title="Employees" toggleTheme={toggleTheme} darkMode={darkMode}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Add Employee</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((e) => (
              <TableRow key={e._id}>
                <TableCell>{e.name}</TableCell>
                <TableCell>{e.email}</TableCell>
                <TableCell><Chip label={e.role} size="small" /></TableCell>
                <TableCell>{e.phone}</TableCell>
                <TableCell><Chip label={e.isActive ? 'Active' : 'Inactive'} color={e.isActive ? 'success' : 'default'} size="small" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Employee</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSave} noValidate>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}><TextField fullWidth label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required helperText="Password must be at least 6 characters." /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select value={form.role} label="Role" onChange={(e) => setForm({ ...form, role: e.target.value })}>
                    <MenuItem value="cashier">Cashier</MenuItem>
                
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" type="submit" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Employees;
