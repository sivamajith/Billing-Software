const axios = require('axios');
const API = 'http://127.0.0.1:5000/api';
(async () => {
  try {
    const login = await axios.post(`${API}/auth/login`, { email: 'cashier@shop.com', password: 'cashier123' });
    const token = login.data.token;
    const shopId = login.data.shopId;
    console.log('TOKEN', token);
    console.log('SHOPID', shopId);
    const payload = { name: 'Debug Product', sku: 'DBG2', barcode: '0002', category: 'General', price: NaN, costPrice: 0.5, stock: 5, lowStockThreshold: 2, unit: 'pcs', shopId };
    console.log('PAYLOAD', payload);
    const create = await axios.post(`${API}/products`, payload, { headers: { Authorization: `Bearer ${token}` } });
    console.log('CREATE', create.data);
  } catch (err) {
    if (err.response) {
      console.error('RESP', err.response.status, err.response.data);
    } else {
      console.error('ERR', err.message);
    }
    process.exit(1);
  }
})();
