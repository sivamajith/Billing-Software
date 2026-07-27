export const printThermalReceipt = (sale, shop) => {
  const width = shop?.settings?.thermalPrinterWidth || 80;
  const charsPerLine = width === 58 ? 32 : 48;
  const line = (char = '-') => char.repeat(charsPerLine);
  const center = (text) => {
    const pad = Math.max(0, Math.floor((charsPerLine - text.length) / 2));
    return ' '.repeat(pad) + text;
  };
  const row = (left, right) => {
    const space = charsPerLine - left.length - right.length;
    return left + ' '.repeat(Math.max(1, space)) + right;
  };

  let receipt = '';
  receipt += center(shop?.name || 'BILLING STORE') + '\n';
  if (shop?.address) receipt += center(shop.address) + '\n';
  if (shop?.phone) receipt += center(`Tel: ${shop.phone}`) + '\n';
  if (shop?.gstNumber) receipt += center(`GST: ${shop.gstNumber}`) + '\n';
  receipt += line() + '\n';
  receipt += `Sale: ${sale.saleNumber}\n`;
  receipt += `Date: ${new Date(sale.createdAt || Date.now()).toLocaleString('en-IN')}\n`;
  receipt += `Customer: ${sale.customerName || 'Walk-in'}\n`;
  receipt += line() + '\n';

  (sale.items || []).forEach((item) => {
    const itemLineTotal = (item.price * item.quantity - (item.discount || 0)).toFixed(2);
    receipt += `${item.name}\n`;
    receipt += row(`  ${item.quantity} x ₹${item.price}`, `₹${itemLineTotal}`) + '\n';
  });

  receipt += line() + '\n';
  receipt += row('Subtotal:', `₹${(sale.subtotal || 0).toFixed(2)}`) + '\n';
  if (sale.discount > 0) receipt += row('Discount:', `-₹${sale.discount.toFixed(2)}`) + '\n';
  if (sale.tax > 0) receipt += row('Tax:', `₹${sale.tax.toFixed(2)}`) + '\n';
  receipt += row('TOTAL:', `₹${(sale.total || 0).toFixed(2)}`) + '\n';
  receipt += row('Paid:', `${(sale.paymentMethod || 'cash').toUpperCase()}`) + '\n';
  if (sale.change > 0) receipt += row('Change:', `₹${sale.change.toFixed(2)}`) + '\n';
  receipt += line() + '\n';
  receipt += center(shop?.settings?.receiptFooter || 'Thank you!') + '\n';
  receipt += center('***') + '\n';

  const printWindow = window.open('', '_blank', 'width=400,height=600');
  if (!printWindow) {
    alert('Please allow popups for thermal printing');
    return;
  }
  printWindow.document.write(`
    <html><head><title>Receipt</title>
    <style>
      body { font-family: 'Courier New', monospace; font-size: 12px; margin: 0; padding: 10px; }
      pre { white-space: pre-wrap; word-wrap: break-word; margin: 0; }
      @media print { body { margin: 0; } }
    </style></head>
    <body><pre>${receipt}</pre>
    <script>window.onload = function() { window.print(); }</script>
    </body></html>
  `);
  printWindow.document.close();
};

export const downloadInvoicePDF = async (invoicesAPI, invoiceId, invoiceNumber) => {
  const response = await invoicesAPI.downloadPDF(invoiceId);
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `invoice-${invoiceNumber}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
