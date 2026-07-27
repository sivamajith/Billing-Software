import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, FormControl, InputLabel, Select, MenuItem, InputAdornment,
} from '@mui/material';
import { Download, Search } from '@mui/icons-material';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { invoicesAPI } from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import { downloadInvoicePDF } from '../utils/thermalPrint';

const Invoices = ({ toggleTheme, darkMode }) => {
  const { user } = useAuth();
  const shopId = user?.shopId;
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState('');
  const [sendOpen, setSendOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [sendMethod, setSendMethod] = useState('email');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [sendResult, setSendResult] = useState(null);
  const [sendError, setSendError] = useState('');

  useEffect(() => {
    if (!shopId) return;
    invoicesAPI.getByShop(shopId).then((r) => setInvoices(r.data)).catch(() => {});
  }, [shopId]);

  const statusColor = { paid: 'success', sent: 'info', draft: 'default', overdue: 'error', cancelled: 'default' };

  const filteredInvoices = invoices.filter((inv) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return inv.invoiceNumber.toLowerCase().includes(query)
      || inv.customerName?.toLowerCase().includes(query)
      || inv.customerEmail?.toLowerCase().includes(query)
      || inv.customerPhone?.toLowerCase().includes(query);
  });

  const openSendDialog = (invoice) => {
    setSelectedInvoice(invoice);
    setSendMethod('email');
    setRecipient(invoice.customerEmail || invoice.customerPhone || '');
    setMessage(`Invoice ${invoice.invoiceNumber} for ₹${invoice.total.toFixed(2)}.`);
    setSendResult('');
    setSendError('');
    setSendOpen(true);
  };

  const handleSend = async () => {
    if (!selectedInvoice) return;
    if (!recipient) {
      setSendError('Recipient is required');
      return;
    }
    try {
      setSendError('');
      const response = await invoicesAPI.sendNotification(selectedInvoice._id, {
        method: sendMethod,
        to: recipient,
        message,
      });
      setSendResult(response.data);
    } catch (error) {
      setSendResult(null);
      setSendError(error.response?.data?.message || 'Failed to send notification');
    }
  };

  return (
    <Layout title="Invoices" toggleTheme={toggleTheme} darkMode={darkMode}>
      <Box mb={2}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search invoices by number, customer, email, or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Tax</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInvoices.map((inv) => (
              <TableRow key={inv._id}>
                <TableCell>{inv.invoiceNumber}</TableCell>
                <TableCell>{inv.customerName}</TableCell>
                <TableCell>{formatCurrency(inv.total)}</TableCell>
                <TableCell>{formatCurrency(inv.tax)}</TableCell>
                <TableCell><Chip label={inv.status} color={statusColor[inv.status] || 'default'} size="small" /></TableCell>
                <TableCell>{formatDate(inv.createdAt)}</TableCell>
                <TableCell>
                  <IconButton size="small" title="Download PDF"
                    onClick={() => downloadInvoicePDF(invoicesAPI, inv._id, inv.invoiceNumber)}>
                    <Download />
                  </IconButton>
                  <IconButton size="small" title="Send Invoice" onClick={() => openSendDialog(inv)}>
                    
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {!invoices.length && (
              <TableRow><TableCell colSpan={7} align="center">No invoices yet. Complete a sale in POS!</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={sendOpen} onClose={() => setSendOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Invoice</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Method</InputLabel>
            <Select value={sendMethod} label="Method" onChange={(e) => setSendMethod(e.target.value)}>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="sms">SMS</MenuItem>
              <MenuItem value="whatsapp">WhatsApp</MenuItem>
              <MenuItem value="all">All</MenuItem>
            </Select>
          </FormControl>
          <TextField fullWidth sx={{ mt: 2 }} label="Recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} helperText={sendMethod === 'email' ? 'Email address' : 'Phone number'} />
          <TextField fullWidth multiline rows={3} sx={{ mt: 2 }} label="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
          {sendResult && (
            <Box sx={{ mt: 2, color: 'success.main' }}>
              <strong>Success:</strong>
              {sendResult.email && <Box>Email: {sendResult.email}</Box>}
              {sendResult.sms && <Box>SMS: {sendResult.sms}</Box>}
              {sendResult.whatsapp && <Box>WhatsApp: {sendResult.whatsapp}</Box>}
              {sendResult.whatsappLink && (
                <Box>
                  WhatsApp link: <a href={sendResult.whatsappLink} target="_blank" rel="noreferrer">Open</a>
                </Box>
              )}
            </Box>
          )}
          {sendError && <Box sx={{ mt: 2, color: 'error.main' }}>Error: {sendError}</Box>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSendOpen(false)}>Close</Button>
          <Button variant="contained" onClick={handleSend}>Send</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Invoices;
