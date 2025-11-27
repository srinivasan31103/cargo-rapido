import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear all authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('auth-storage'); // Clear Zustand persist storage
      sessionStorage.clear();

      // Redirect to appropriate login page based on current path
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/admin')) {
        window.location.href = '/admin/login';
      } else if (currentPath.startsWith('/driver')) {
        window.location.href = '/driver/login';
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  registerDriver: (data) => api.post('/auth/driver/register', data),
  loginDriver: (data) => api.post('/auth/driver/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Booking APIs
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  estimate: (data) => api.post('/bookings/estimate', data),
  getById: (id) => api.get(`/bookings/${id}`),
  getUserBookings: (userId, params) => api.get(`/bookings/user/${userId}`, { params }),
  getDriverBookings: (driverId, params) => api.get(`/bookings/driver/${driverId}`, { params }),
  updateStatus: (id, data) => api.put(`/bookings/${id}/status`, data),
  cancel: (id, data) => api.put(`/bookings/${id}/cancel`, data),
  rate: (id, data) => api.post(`/bookings/${id}/rate`, data)
};

// Driver APIs
export const driverAPI = {
  getNearby: (params) => api.get('/drivers/nearby', { params }),
  updateStatus: (status) => api.put('/drivers/status', { status }),
  updateLocation: (data) => api.put('/drivers/location', data),
  uploadDocuments: (formData) => api.post('/drivers/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  registerVehicle: (data) => api.post('/drivers/vehicle', data),
  getStats: () => api.get('/drivers/stats'),
  getAll: (params) => api.get('/drivers/all', { params })
};

// POD APIs
export const podAPI = {
  uploadPickup: (formData) => api.post('/pod/pickup', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  verifyPickup: (data) => api.post('/pod/pickup/verify', data),
  uploadDelivery: (formData) => api.post('/pod/delivery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  verifyDelivery: (data) => api.post('/pod/delivery/verify', data),
  getRecord: (bookingId) => api.get(`/pod/${bookingId}`)
};

// Payment APIs
export const paymentAPI = {
  createOrder: (data) => api.post('/pay/create-order', data),
  verify: (data) => api.post('/pay/verify', data),
  rechargeWallet: (data) => api.post('/pay/wallet/recharge', data),
  verifyRecharge: (data) => api.post('/pay/wallet/verify', data),
  payWithWallet: (data) => api.post('/pay/wallet/pay', data),
  getTransactions: (params) => api.get('/pay/transactions', { params }),
  getBalance: () => api.get('/pay/wallet/balance')
};

// AI APIs
export const aiAPI = {
  getPricing: (data) => api.post('/ai/pricing', data),
  classifyCargo: (data) => api.post('/ai/cargo-classify', data),
  getRoute: (data) => api.post('/ai/route', data),
  getInsights: (params) => api.get('/ai/business-insights', { params })
};
