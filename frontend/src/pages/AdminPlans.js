import React, { useEffect, useState } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import Layout from '../components/Layout';
import { plansAPI, shopsAPI } from '../services/api';
import { ADMIN_PATH } from '../utils/helpers';

const AdminPlans = ({ toggleTheme, darkMode }) => {
  const [plans, setPlans] = useState([]);
  const [shops, setShops] = useState([]);
  const [open, setOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [selectedShopId, setSelectedShopId] = useState('');
  const [assignError, setAssignError] = useState('');
  const [form, setForm] = useState({ name: '', key: '', priceMonthly: 0 });

  const load = async () => {
    try {
      const [pRes, sRes] = await Promise.all([plansAPI.list(), shopsAPI.getAll()]);
      setPlans(pRes.data);
      setShops(sRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    try {
      await plansAPI.create(form);
      setOpen(false);
      setForm({ name: '', key: '', priceMonthly: 0 });
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignClick = (planId) => {
    setSelectedPlanId(planId);
    setSelectedShopId('');
    setAssignError('');
    setAssignOpen(true);
  };

  const handleAssignConfirm = async () => {
    if (!selectedShopId) {
      setAssignError('Please select a shop to assign.');
      return;
    }

    try {
      await plansAPI.assignToShop({ shopId: selectedShopId, planId: selectedPlanId });
      setAssignOpen(false);
      setSelectedPlanId('');
      setSelectedShopId('');
      load();
    } catch (err) {
      console.error(err);
      setAssignError('Failed to assign plan. Please try again.');
    }
  };

  return (
    <Layout title="Manage Plans" toggleTheme={toggleTheme} darkMode={darkMode}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <h2>Plans</h2>
        <Box>
          <Button variant="contained" onClick={() => setOpen(true)}>Create Plan</Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Key</TableCell>
              <TableCell>Monthly</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans.map((p) => (
              <TableRow key={p._id} hover>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.key}</TableCell>
                <TableCell>{p.priceMonthly}</TableCell>
                <TableCell>{p.active ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleAssignClick(p._id)}>Assign to Shop</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Plan</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Key" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth type="number" label="Monthly Price" value={form.priceMonthly} onChange={(e) => setForm({ ...form, priceMonthly: Number(e.target.value) })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={assignOpen} onClose={() => setAssignOpen(false)}>
        <DialogTitle>Assign Plan to Shop</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>Select the shop that should receive this plan.</Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="shop-select-label">Shop</InputLabel>
            <Select
              labelId="shop-select-label"
              value={selectedShopId}
              label="Shop"
              onChange={(e) => {
                setSelectedShopId(e.target.value);
                setAssignError('');
              }}
            >
              {shops.map((shop) => (
                <MenuItem key={shop._id} value={shop._id}>
                  {shop.name} ({shop.city || 'No city'})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {assignError && <Typography color="error" sx={{ mb: 2 }}>{assignError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignOpen(false)}>Cancel</Button>
          <Button onClick={handleAssignConfirm} variant="contained">Assign</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default AdminPlans;
