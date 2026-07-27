import React, { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Grid, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import Layout from '../components/Layout';
import { shopsAPI, usersAPI } from '../services/api';
import { formatDateTime } from '../utils/helpers';

const initialForm = {
  name: '', email: '', password: '', role: 'cashier', shopId: '', phone: '', isActive: true, blockedUntil: '',
};

const AdminUsers = ({ toggleTheme, darkMode }) => {
  const [users, setUsers] = useState([]);
  const [shops, setShops] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const loadUsers = () => usersAPI.getAll().then((r) => setUsers(r.data)).catch(() => {});
  const loadShops = () => shopsAPI.getAll().then((r) => setShops(r.data)).catch(() => {});

  useEffect(() => {
    loadUsers();
    loadShops();
  }, []);

  const openDialog = (user = null) => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        role: user.role || 'cashier',
        shopId: user.shopId?._id || '',
        phone: user.phone || '',
        isActive: user.isActive ?? true,
        blockedUntil: user.blockedUntil ? user.blockedUntil.slice(0, 16) : '',
      });
      setEditId(user._id);
    } else {
      setForm(initialForm);
      setEditId(null);
    }
    setError('');
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email) {
      setError('Name and email are required');
      return;
    }
    try {
      setError('');
      const payload = {
        ...form,
        password: form.password || undefined,
        blockedUntil: form.blockedUntil || null,
      };
      if (editId) {
        await usersAPI.update(editId, payload);
      } else {
        await usersAPI.create(payload);
      }
      setOpen(false);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? This will deactivate their account.')) return;
    await usersAPI.delete(id);
    loadUsers();
  };

  const formatBlockedUntil = (value) => {
    if (!value) return '-';
    try {
      return formatDateTime(value);
    } catch {
      return '-';
    }
  };

  const handleActivate = async (id) => {
    await usersAPI.update(id, { isActive: true, blockedUntil: null });
    loadUsers();
  };

  const handleUnblock = async (id) => {
    await usersAPI.update(id, { blockedUntil: null });
    loadUsers();
  };

  const handleBlock = async (id) => {
    const blockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    await usersAPI.update(id, { blockedUntil: blockUntil, isActive: true });
    loadUsers();
  };

  return (
    <Layout title="Manage Users" toggleTheme={toggleTheme} darkMode={darkMode}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <strong>Total users:</strong> {users.length}
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => openDialog()}>Create User</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Shop</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Blocked Until</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => {
              const isBlocked = u.blockedUntil && new Date(u.blockedUntil) > new Date();
              const statusLabel = !u.isActive ? 'Inactive' : isBlocked ? `Blocked` : 'Active';
              const statusColor = !u.isActive ? 'default' : isBlocked ? 'warning' : 'success';
              return (
                <TableRow key={u._id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell><Chip label={u.role?.replace('_', ' ')} size="small" color={u.role === 'website_owner' ? 'error' : 'primary'} /></TableCell>
                  <TableCell>{u.shopId?.name || '-'}</TableCell>
                  <TableCell><Chip label={statusLabel} color={statusColor} size="small" /></TableCell>
                  <TableCell>{formatBlockedUntil(u.blockedUntil)}</TableCell>
                  <TableCell>{u.lastLogin ? formatDateTime(u.lastLogin) : 'Never'}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => openDialog(u)}>Edit</Button>
                    {isBlocked ? (
                      <Button size="small" onClick={() => handleUnblock(u._id)}>Unblock</Button>
                    ) : u.isActive ? (
                      <Button size="small" onClick={() => handleBlock(u._id)}>Block 24h</Button>
                    ) : (
                      <Button size="small" onClick={() => handleActivate(u._id)}>Activate</Button>
                    )}
                    <Button size="small" color="error" onClick={() => handleDelete(u._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit User' : 'Create User'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}><TextField fullWidth label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} helperText={editId ? 'Leave blank to keep existing password' : 'Enter a password'} /></Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select value={form.role} label="Role" onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <MenuItem value="cashier">Cashier</MenuItem>
                  <MenuItem value="shop_owner">Shop Owner</MenuItem>
                  <MenuItem value="employee">Employee</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Shop</InputLabel>
                <Select value={form.shopId} label="Shop" onChange={(e) => setForm({ ...form, shopId: e.target.value })}>
                  <MenuItem value="">No Shop</MenuItem>
                  {shops.map((s) => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}><TextField fullWidth label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={form.isActive ? 'active' : 'inactive'} label="Status" onChange={(e) => setForm({ ...form, isActive: e.target.value === 'active' })}>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Block Until"
                type="datetime-local"
                value={form.blockedUntil}
                onChange={(e) => setForm({ ...form, blockedUntil: e.target.value })}
                InputLabelProps={{ shrink: true }}
                helperText="Leave empty for no temporary block"
              />
            </Grid>
            {error && <Grid item xs={12}><Box color="error.main">{error}</Box></Grid>}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>{editId ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default AdminUsers;
