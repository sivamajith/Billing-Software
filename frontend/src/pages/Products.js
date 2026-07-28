import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Chip, Grid, FormControl, InputLabel, Select, MenuItem,
  InputAdornment,
} from '@mui/material';
import { Add, Edit, Delete, UploadFile, Download, Search } from '@mui/icons-material';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../services/api';
import { formatCurrency, arrayToCSV, downloadCSV, parseCSV } from '../utils/helpers';

const emptyProduct = { name: '', sku: '', barcode: '', category: 'General', price: '', costPrice: '', stock: '', lowStockThreshold: 10, unit: 'pcs' };

const Products = ({ toggleTheme, darkMode }) => {
  const { user } = useAuth();
  const shopId = user?.shopId;
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyProduct);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [importError, setImportError] = useState('');
  const fileRef = useRef();

  const load = useCallback(() => {
    if (!shopId) {
      setProducts([]);
      return;
    }
    productsAPI.getByShop(shopId).then((r) => setProducts(r.data)).catch(() => {});
  }, [shopId]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    setError('');
    const data = {
      ...form,
      shopId,
      price: parseFloat(form.price),
      costPrice: parseFloat(form.costPrice) || 0,
      stock: parseInt(form.stock, 10) || 0,
      lowStockThreshold: parseInt(form.lowStockThreshold, 10) || 10,
    };

    if (!data.name) {
      setError('Product name is required');
      return;
    }
    if (!Number.isFinite(data.price) || data.price < 0) {
      setError('Price must be a valid non-negative number');
      return;
    }
    if (!Number.isFinite(data.costPrice) || data.costPrice < 0) {
      setError('Cost price must be a valid non-negative number');
      return;
    }
    if (!Number.isFinite(data.stock) || data.stock < 0) {
      setError('Stock must be a valid non-negative number');
      return;
    }
    if (!Number.isFinite(data.lowStockThreshold) || data.lowStockThreshold < 0) {
      setError('Low stock threshold must be a valid non-negative number');
      return;
    }

    try {
      if (editId) await productsAPI.update(editId, data);
      else await productsAPI.create(data);
      setOpen(false);
      setForm(emptyProduct);
      setEditId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (p) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setForm({ ...p, price: p.price, costPrice: p.costPrice, stock: p.stock });
    setEditId(p._id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deactivate this product?')) {
      await productsAPI.delete(id);
      load();
    }
  };

  const handleExport = () => {
    const csv = arrayToCSV(products, ['name', 'sku', 'barcode', 'category', 'price', 'costPrice', 'stock', 'lowStockThreshold', 'unit']);
    downloadCSV('products.csv', csv);
  };

  const handleImportFile = () => {
    fileRef.current?.click();
  };

  const filteredProducts = products.filter((product) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    return [product.name, product.sku, product.barcode, product.category]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });

  const handleImport = async (event) => {
    setImportError('');
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const rows = parseCSV(text);
    const items = rows.map((row) => ({
      ...emptyProduct,
      name: row.name || row.Name,
      sku: row.sku || row.SKU,
      barcode: row.barcode || row.Barcode,
      category: row.category || row.Category || 'General',
      price: parseFloat(row.price || row.Price || 0) || 0,
      costPrice: parseFloat(row.costPrice || row.CostPrice || 0) || 0,
      stock: parseInt(row.stock || row.Stock || 0, 10) || 0,
      lowStockThreshold: parseInt(row.lowStockThreshold || row.LowStockThreshold || 10, 10) || 10,
      unit: row.unit || row.Unit || 'pcs',
    })).filter((item) => item.name);

    if (!items.length) {
      setImportError('No valid products found in CSV.');
      return;
    }

    try {
      await Promise.all(items.map((item) => productsAPI.create({ ...item, shopId })));
      load();
    } catch (error) {
      setImportError('Failed to import products. Check CSV format and try again.');
    }
  };

  return (
    <Layout title="Products" toggleTheme={toggleTheme} darkMode={darkMode}>
      <Box display="flex" justifyContent="flex-end" gap={1} mb={2}>
        <Button variant="outlined" startIcon={<Download />} onClick={handleExport}>Export CSV</Button>
        <Button variant="outlined" startIcon={<UploadFile />} onClick={handleImportFile}>Import CSV</Button>
        <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleImport} />
        <Button variant="contained" startIcon={<Add />} onClick={() => { setForm(emptyProduct); setEditId(null); setError(''); setOpen(true); }}>
          Add Product
        </Button>
      </Box>
      {error && <Box color="error.main" mb={2}>{error}</Box>}
      {importError && <Box color="error.main" mb={2}>{importError}</Box>}

      <TextField
        fullWidth
        placeholder="Search products by name, SKU, barcode or category"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.sku}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>{formatCurrency(p.price)}</TableCell>
                <TableCell>
                  <Chip label={p.stock} size="small"
                    color={p.stock <= p.lowStockThreshold ? 'error' : 'success'} />
                </TableCell>
                <TableCell>{p.isActive ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEdit(p)}><Edit /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(p._id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}><TextField fullWidth label="Product Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required autoComplete="name" autoFocus /></Grid>
            <Grid item xs={6}><TextField fullWidth label="SKU" value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })} autoComplete="off" /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Barcode" value={form.barcode}
              onChange={(e) => setForm({ ...form, barcode: e.target.value })} autoComplete="off" /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Price" type="number" value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })} required autoComplete="off" /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Cost Price" type="number" value={form.costPrice}
              onChange={(e) => setForm({ ...form, costPrice: e.target.value })} autoComplete="off" /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Stock" type="number" value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })} autoComplete="off" /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Low Stock Alert" type="number" value={form.lowStockThreshold}
              onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} autoComplete="off" /></Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={form.category} label="Category" onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {['General', 'Electronics', 'Accessories', 'Food', 'Clothing', 'Other'].map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
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

export default Products;
