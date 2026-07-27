import React, { useCallback, useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Grid,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { expensesAPI } from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';

const Expenses = ({ toggleTheme, darkMode }) => {
  const { user } = useAuth();
  const shopId = user?.shopId;
  const [expenses, setExpenses] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'General', amount: '' });

  const load = useCallback(() => {
    if (!shopId) return;
    expensesAPI.getByShop(shopId).then((r) => setExpenses(r.data)).catch(() => {});
  }, [shopId]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    await expensesAPI.create({ ...form, shopId, amount: parseFloat(form.amount) });
    setOpen(false);
    setForm({ title: '', category: 'General', amount: '' });
    load();
  };

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <Layout title="Expenses" toggleTheme={toggleTheme} darkMode={darkMode}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Total: {formatCurrency(total)}</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Add Expense</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((e) => (
              <TableRow key={e._id}>
                <TableCell>{e.title}</TableCell>
                <TableCell>{e.category}</TableCell>
                <TableCell>{formatCurrency(e.amount)}</TableCell>
                <TableCell>{formatDate(e.date || e.createdAt)}</TableCell>
                <TableCell>
                  <IconButton size="small" color="error" onClick={async () => { await expensesAPI.delete(e._id); load(); }}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Expense</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}><TextField fullWidth label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Amount" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></Grid>
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

export default Expenses;
