export const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: currency || 'INR' }).format(amount || 0);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const formatDateTime = (date) =>
  new Date(date).toLocaleString('en-IN');

export const arrayToCSV = (rows, columns) => {
  const header = columns.join(',');
  const lines = rows.map((row) => columns.map((col) => {
    const value = row[col] ?? '';
    const escaped = typeof value === 'string'
      ? `"${value.replace(/"/g, '""')}"`
      : value;
    return escaped;
  }).join(','));
  return [header, ...lines].join('\r\n');
};

export const downloadCSV = (filename, csv) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const parseCSV = (text) => {
  const rows = text.trim().split(/\r?\n/).filter((line) => line.trim());
  const headers = rows.shift().split(',').map((h) => h.trim());
  return rows.map((line) => {
    const values = line.match(/(?:"([^"]*(?:""[^"]*)*)"|([^,]+))/g)?.map((value) =>
      value.replace(/^"|"$/g, '').replace(/""/g, '"').trim()
    ) || [];
    return headers.reduce((obj, header, index) => ({
      ...obj,
      [header]: values[index] ?? '',
    }), {});
  });
};

export const ADMIN_PATH = process.env.REACT_APP_ADMIN_SECRET_PATH || 'x7k9-super-admin-portal';
