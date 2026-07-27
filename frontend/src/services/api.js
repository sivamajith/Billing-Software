import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

export const shopsAPI = {
  getAll: () => api.get('/shops'),
  getById: (id) => api.get(`/shops/${id}`),
  create: (data) => api.post('/shops', data),
  update: (id, data) => api.put(`/shops/${id}`, data),
  getStats: (id) => api.get(`/shops/${id}/stats`),
  delete: (id) => api.delete(`/shops/${id}`),
};

export const productsAPI = {
  getByShop: (shopId, params) => api.get(`/products/shop/${shopId}`, { params }),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const salesAPI = {
  getByShop: (shopId) => api.get(`/sales/shop/${shopId}`),
  create: (data) => api.post('/sales', data),
  getById: (id) => api.get(`/sales/${id}`),
};

export const invoicesAPI = {
  getByShop: (shopId) => api.get(`/invoices/shop/${shopId}`),
  getById: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post('/invoices', data),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  downloadPDF: (id) => api.get(`/invoices/${id}/pdf`, { responseType: 'blob' }),
  sendNotification: (id, data) => api.post(`/invoices/${id}/send`, data),
};

export const customersAPI = {
  getByShop: (shopId) => api.get(`/customers/shop/${shopId}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

export const inventoryAPI = {
  getByShop: (shopId) => api.get(`/inventory/shop/${shopId}`),
  getLowStock: (shopId) => api.get(`/inventory/shop/${shopId}/low-stock`),
  getLogs: (shopId) => api.get(`/inventory/shop/${shopId}/logs`),
  adjust: (productId, data) => api.put(`/inventory/adjust/${productId}`, data),
};

export const analyticsAPI = {
  getShop: (shopId, period) => api.get(`/analytics/shop/${shopId}`, { params: { period } }),
  getPlatform: () => api.get('/analytics/platform'),
};

export const plansAPI = {
  list: () => api.get('/plans'),
  create: (data) => api.post('/plans', data),
  update: (id, data) => api.put(`/plans/${id}`, data),
  deactivate: (id) => api.delete(`/plans/${id}`),
  assignToShop: (data) => api.post('/plans/assign', data),
};

export const usersAPI = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const expensesAPI = {
  getByShop: (shopId) => api.get(`/expenses/shop/${shopId}`),
  create: (data) => api.post('/expenses', data),
  delete: (id) => api.delete(`/expenses/${id}`),
};

export const suppliersAPI = {
  getByShop: (shopId) => api.get(`/suppliers/shop/${shopId}`),
  create: (data) => api.post('/suppliers', data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
};

export const reportsAPI = {
  sales: (shopId, params) => api.get(`/reports/shop/${shopId}/sales`, { params }),
  salesSummary: (shopId, params) => api.get(`/reports/shop/${shopId}/sales/summary`, { params }),
  inventory: (shopId) => api.get(`/reports/shop/${shopId}/inventory`),
  profit: (shopId) => api.get(`/reports/shop/${shopId}/profit`),
};

export const auditAPI = {
  getByShop: (shopId) => api.get(`/audit/shop/${shopId}`),
  getAll: () => api.get('/audit'),
};

export const configAPI = {
  get: () => api.get('/config'),
};

export default api;
