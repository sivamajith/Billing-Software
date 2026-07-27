import React, { useCallback, useEffect, useState } from 'react';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, Alert, Tabs, Tab, FormControl, InputLabel, Select, MenuItem, InputAdornment, Box,
} from '@mui/material';
import { Warning, Add, Search } from '@mui/icons-material';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { inventoryAPI } from '../services/api';
import { formatCurrency, formatDateTime } from '../utils/helpers';

const Inventory = ({ toggleTheme, darkMode }) => {
  const { user } = useAuth();
  const shopId = user?.shopId;
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [inventory, setInventory] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [logs, setLogs] = useState([]);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [adjustForm, setAdjustForm] = useState({ quantity: '', type: 'in', reason: '' });

  const load = useCallback(() => {
    if (!shopId) return;
    inventoryAPI.getByShop(shopId).then((r) => setInventory(r.data)).catch(() => {});
    inventoryAPI.getLowStock(shopId).then((r) => setLowStock(r.data)).catch(() => {});
    inventoryAPI.getLogs(shopId).then((r) => setLogs(r.data)).catch(() => {});
  }, [shopId]);

  useEffect(() => { load(); }, [load]);

  const filteredInventory = inventory.filter((item) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return item.name?.toLowerCase().includes(query)
      || item.sku?.toLowerCase().includes(query);
  });

  const filteredLowStock = lowStock.filter((item) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return item.name?.toLowerCase().includes(query)
      || item.sku?.toLowerCase().includes(query);
  });

  const filteredLogs = logs.filter((log) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return log.productId?.name?.toLowerCase().includes(query)
      || log.reason?.toLowerCase().includes(query);
  });

  const handleAdjust = async () => {
    await inventoryAPI.adjust(selected._id, {
      quantity: parseInt(adjustForm.quantity),
      type: adjustForm.type,
      reason: adjustForm.reason,
    });
    setAdjustOpen(false);
    setAdjustForm({ quantity: '', type: 'in', reason: '' });
    load();
  };

  return (
    <Layout title="Inventory Management" toggleTheme={toggleTheme} darkMode={darkMode} lowStockCount={lowStock.length}>
      {lowStock.length > 0 && (
        <Alert severity="warning" icon={<Warning />} sx={{ mb: 2 }}>
          {lowStock.length} product(s) below low stock threshold!
        </Alert>
      )}

      <Box mb={2}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search inventory by product, SKU, or log reason"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
        />
      </Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label={`All Stock (${filteredInventory.length})`} />
        <Tab label={`Low Stock (${filteredLowStock.length})`} />
        <Tab label="Stock Logs" />
      </Tabs>

      {tab === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Threshold</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>{item.lowStockThreshold}</TableCell>
                  <TableCell>{formatCurrency(item.stock * item.price)}</TableCell>
                  <TableCell>
                    <Chip label={item.isLowStock ? 'Low Stock' : 'OK'}
                      color={item.isLowStock ? 'error' : 'success'} size="small" />
                  </TableCell>
                  <TableCell>
                    <Button size="small" startIcon={<Add />}
                      onClick={() => { setSelected(item); setAdjustOpen(true); }}>Adjust</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Current Stock</TableCell>
                <TableCell>Threshold</TableCell>
                <TableCell>Needed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLowStock.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell><Chip label={item.stock} color="error" size="small" /></TableCell>
                  <TableCell>{item.lowStockThreshold}</TableCell>
                  <TableCell>{Math.max(0, item.lowStockThreshold - item.stock + 5)} units</TableCell>
                </TableRow>
              ))}
              {!lowStock.length && (
                <TableRow><TableCell colSpan={4} align="center">All stock levels are healthy!</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tab === 2 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Before → After</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell>{log.productId?.name}</TableCell>
                  <TableCell><Chip label={log.type} size="small" /></TableCell>
                  <TableCell>{log.quantity}</TableCell>
                  <TableCell>{log.previousStock} → {log.newStock}</TableCell>
                  <TableCell>{log.reason}</TableCell>
                  <TableCell>{formatDateTime(log.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={adjustOpen} onClose={() => setAdjustOpen(false)}>
        <DialogTitle>Adjust Stock — {selected?.name}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select value={adjustForm.type} label="Type"
              onChange={(e) => setAdjustForm({ ...adjustForm, type: e.target.value })}>
              <MenuItem value="in">Stock In (+)</MenuItem>
              <MenuItem value="out">Stock Out (-)</MenuItem>
              <MenuItem value="adjustment">Set Exact</MenuItem>
            </Select>
          </FormControl>
          <TextField fullWidth label="Quantity" type="number" value={adjustForm.quantity}
            onChange={(e) => setAdjustForm({ ...adjustForm, quantity: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Reason" value={adjustForm.reason}
            onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdjustOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdjust}>Update Stock</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Inventory;
