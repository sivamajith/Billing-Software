import React, { useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, TextField, Button, IconButton,
  List, ListItem, ListItemText, Divider, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, FormControl, InputLabel, Select, MenuItem, Alert, InputAdornment,
  Stack,
} from '@mui/material';
import {
  Add, Remove, Delete, Search, Print, Payment, ShoppingCart,
  QrCodeScanner,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { productsAPI, salesAPI, customersAPI } from '../services/api';
import { formatCurrency } from '../utils/helpers';
import { printThermalReceipt } from '../utils/thermalPrint';

const POSSystem = ({ toggleTheme, darkMode }) => {
  const { user, shop } = useAuth();
  const shopId = user?.shopId;
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [discount, setDiscount] = useState(0);
  const [taxPercent, setTaxPercent] = useState('');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [priceOverride, setPriceOverride] = useState('');

  useEffect(() => {
    if (!shopId) return;
    productsAPI.getByShop(shopId).then((r) => setProducts(r.data)).catch(() => {});
    customersAPI.getByShop(shopId).then((r) => setCustomers(r.data)).catch(() => {});
  }, [shopId]);

  const categories = Array.from(new Set(products.map((p) => p.category || 'General').filter(Boolean)));
  const filtered = products.filter((p) => {
    const query = search.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(query) ||
      p.sku?.toLowerCase().includes(query) ||
      p.barcode?.includes(search);
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory || (!p.category && selectedCategory === 'General');
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    if (product.stock <= 0) { setError(`${product.name} is out of stock`); return; }
    setError('');
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        if (existing.quantity >= product.stock) { setError('Not enough stock'); return prev; }
        return prev.map((i) => i.productId === product._id
          ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.price }
          : i);
      }
      return [...prev, {
        productId: product._id, name: product.name, price: product.price,
        quantity: 1, discount: 0, tax: 0, total: product.price,
      }];
    });
  };

  const updateQty = (productId, delta) => {
    setCart((prev) => prev.map((i) => {
      if (i.productId !== productId) return i;
      const product = products.find((p) => p._id === productId);
      const qty = Math.max(1, Math.min(product?.stock || 99, i.quantity + delta));
      return { ...i, quantity: qty, total: qty * i.price };
    }));
  };

  const removeItem = (productId) => setCart((prev) => prev.filter((i) => i.productId !== productId));

  const subtotal = cart.reduce((s, i) => s + i.total, 0);
  const numericTaxPercent = parseFloat(taxPercent);
  const hasTaxPercent = taxPercent !== '' && taxPercent !== null && !Number.isNaN(numericTaxPercent);
  const tax = hasTaxPercent ? (subtotal - discount) * (numericTaxPercent / 100) : 0;
  const total = subtotal - discount + tax;
  const effectiveAmountPaid = parseFloat(amountPaid) || 0;
  const change = Math.max(0, effectiveAmountPaid - total);

  const handleBarcodeLookup = () => {
    const code = barcodeInput.trim();
    if (!code) {
      setError('Enter a barcode or SKU');
      return;
    }

    const product = products.find((item) =>
      item.barcode?.toLowerCase() === code.toLowerCase() || item.sku?.toLowerCase() === code.toLowerCase()
    );

    if (!product) {
      setError('No matching product found');
      return;
    }

    addToCart(product);
    setBarcodeInput('');
    setSearch(product.name);
    setError('');
  };

  const handlePriceSave = () => {
    if (!editingPriceId) return;
    const priceValue = parseFloat(priceOverride);
    if (Number.isNaN(priceValue) || priceValue < 0) {
      setError('Enter a valid price');
      return;
    }
    setCart((prev) => prev.map((item) => item.productId === editingPriceId ? { ...item, price: priceValue, total: priceValue * item.quantity } : item));
    setEditingPriceId(null);
    setPriceOverride('');
    setError('');
  };

  const handleCheckout = async () => {
    if (!cart.length) { setError('Cart is empty'); return; }
    setLoading(true);
    setError('');
    try {
      const { data } = await salesAPI.create({
        shopId, items: cart, subtotal, discount, tax, total,
        paymentMethod,
        amountPaid: effectiveAmountPaid || total,
        change,
        customerId: customerId || undefined, customerName,
        taxPercent: hasTaxPercent ? numericTaxPercent : 0,
      });
      setSuccess(data);
      printThermalReceipt(data.sale, shop);
      setCart([]);
      setCheckoutOpen(false);
      setAmountPaid('');
      productsAPI.getByShop(shopId).then((r) => setProducts(r.data));
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="POS System" toggleTheme={toggleTheme} darkMode={darkMode}>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}
          action={<Button color="inherit" size="small" onClick={() => printThermalReceipt(success.sale, shop)}>
            <Print sx={{ mr: 0.5 }} /> Reprint
          </Button>}>
          Sale completed! Invoice: {success.invoice?.invoiceNumber}
        </Alert>
      )}
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <TextField fullWidth placeholder="Search products by name, SKU or barcode..."
            value={search} onChange={(e) => setSearch(e.target.value)} sx={{ mb: 2 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
          />
          <TextField fullWidth size="small" placeholder="Scan barcode or enter SKU"
            value={barcodeInput} onChange={(e) => setBarcodeInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBarcodeLookup()}
            sx={{ mb: 2 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><QrCodeScanner /></InputAdornment> }}
          />
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
            {['All', ...categories].map((category) => (
              <Chip key={category} label={category} color={selectedCategory === category ? 'primary' : 'default'} variant={selectedCategory === category ? 'filled' : 'outlined'} onClick={() => setSelectedCategory(category)} sx={{ cursor: 'pointer' }} />
            ))}
          </Stack>
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
            {[1, 2, 5, 10].map((qty) => (
              <Chip key={qty} label={`+${qty}`} variant="outlined" onClick={() => setSearch(String(qty))} sx={{ cursor: 'pointer' }} />
            ))}
          </Stack>
          <Grid container spacing={1}>
            {filtered.map((p) => (
              <Grid item xs={6} sm={4} md={3} key={p._id}>
                <Card sx={{ cursor: 'pointer', opacity: p.stock <= 0 ? 0.5 : 1 }}
                  onClick={() => addToCart(p)}>
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Typography variant="body2" fontWeight="bold" noWrap>{p.name}</Typography>
                    <Typography variant="h6" color="primary">{formatCurrency(p.price)}</Typography>
                    <Chip label={`Stock: ${p.stock}`} size="small"
                      color={p.stock <= p.lowStockThreshold ? 'error' : 'default'} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ position: { md: 'sticky' }, top: 80 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <ShoppingCart sx={{ mr: 1 }} />
                <Typography variant="h6">Cart ({cart.length})</Typography>
              </Box>

              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Customer</InputLabel>
                <Select value={customerId} label="Customer" onChange={(e) => {
                  setCustomerId(e.target.value);
                  const c = customers.find((x) => x._id === e.target.value);
                  setCustomerName(c?.name || 'Walk-in Customer');
                }}>
                  <MenuItem value="">Walk-in Customer</MenuItem>
                  {customers.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
                </Select>
              </FormControl>

              
              

             
             

              <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                {cart.map((item) => (
                  <ListItem key={item.productId} secondaryAction={
                    <IconButton edge="end" onClick={() => removeItem(item.productId)}><Delete /></IconButton>
                  }>
                    <ListItemText
                      primary={item.name}
                      secondary={
                        <Box display="flex" flexDirection="column" gap={0.5}>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <IconButton size="small" onClick={() => updateQty(item.productId, -1)}><Remove fontSize="small" /></IconButton>
                            <Typography variant="body2">{item.quantity}</Typography>
                            <IconButton size="small" onClick={() => updateQty(item.productId, 1)}><Add fontSize="small" /></IconButton>
                            <Typography variant="body2" ml={1}>{formatCurrency(item.total)}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            {editingPriceId === item.productId ? (
                              <>
                                <TextField size="small" label="Price" type="number" value={priceOverride}
                                  onChange={(e) => setPriceOverride(e.target.value)} sx={{ width: 90 }} />
                                <Button size="small" onClick={handlePriceSave}>Save</Button>
                              </>
                            ) : (
                              <Button size="small" variant="text" onClick={() => { setEditingPriceId(item.productId); setPriceOverride(item.price); }}>Edit price</Button>
                            )}
                          </Box>
                        </Box>
                      }
                      secondaryTypographyProps={{ component: 'div' }}
                    />
                  </ListItem>
                ))}
                {!cart.length && <Typography color="text.secondary" align="center" py={3}>Cart is empty</Typography>}
              </List>

              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between"><Typography>Subtotal</Typography><Typography>{formatCurrency(subtotal)}</Typography></Box>
              <Box display="flex" justifyContent="space-between"><Typography>Tax</Typography><Typography>{formatCurrency(tax)}</Typography></Box>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">{formatCurrency(total)}</Typography>
              </Box>

              <Button fullWidth variant="contained" size="large" startIcon={<Payment />}
                disabled={!cart.length} onClick={() => setCheckoutOpen(true)} sx={{ mt: 2, color: '#ffffff' }}>
                Checkout
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={checkoutOpen} onClose={() => setCheckoutOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Complete Payment</DialogTitle>
        <DialogContent>
          <Typography variant="h5" align="center" my={2}>{formatCurrency(total)}</Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Payment Method</InputLabel>
            <Select value={paymentMethod} label="Payment Method" onChange={(e) => setPaymentMethod(e.target.value)}>
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="card">Card</MenuItem>
              <MenuItem value="upi">UPI</MenuItem>
              <MenuItem value="credit">Credit</MenuItem>
            </Select>
          </FormControl>
          <TextField fullWidth label="Discount (₹)" type="number" value={discount}
            onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))} sx={{ mb: 2 }} />
          <TextField fullWidth label="Tax % (optional)" type="number" value={taxPercent}
            onChange={(e) => setTaxPercent(e.target.value)} sx={{ mb: 2 }}
            helperText="Leave empty for no tax" />
          <TextField fullWidth label="Amount Paid (₹)" type="number" value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)} />
          {effectiveAmountPaid > 0 && <Typography mt={1}>Change: {formatCurrency(change)}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckoutOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCheckout} disabled={loading}>
            {loading ? 'Processing...' : 'Complete Sale & Print'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default POSSystem;
