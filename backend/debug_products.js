const axios = require('axios');
const API = 'http://127.0.0.1:5000/api';
(async () => {
  try {
    const login = await axios.post(`${API}/auth/login`, { email: 'cashier@shop.com', password: 'cashier123' });
    console.log('LOGIN', login.data);
    const token = login.data?.token;
    if (!token) throw new Error('No token from login');
    const me = await axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
    console.log('ME', me.data);
    const shopId = me.data?.user?.shopId;
    console.log('SHOPID', shopId);
    const products = await axios.get(`${API}/products/shop/${shopId}`, { headers: { Authorization: `Bearer ${token}` } });
    console.log('PRODUCTS', products.data);
  } catch (err) {
    if (err.response) {
      console.error('RESP', err.response.status, err.response.data);
    } else {
      console.error('ERR', err.message);
    }
    process.exit(1);
  }
})();
