import axios from 'axios';

const rawApiUrl =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
  'http://localhost:3001/api';

export const API_URL = rawApiUrl.endsWith('/api')
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/+$/, '')}/api`;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  // ── Auth ──────────────────────────────────
  login: (credentials) => apiClient.post('/auth/login', credentials).then(r => r.data),
  register: (data) => apiClient.post('/auth/register', data).then(r => r.data),
  getMe: () => apiClient.get('/auth/me').then(r => r.data),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return apiClient.post('/auth/logout').catch(() => {}).then(() => ({ success: true }));
  },

  // ── Catalog ───────────────────────────────
  getPartners: (params) => apiClient.get('/catalog/partners', { params }).then(r => r.data),
  getPartnerById: (id) => apiClient.get(`/catalog/partners/${id}`).then(r => r.data),
  getDishes: (params) => apiClient.get('/catalog/dishes', { params }).then(r => r.data),
  getCategories: () => apiClient.get('/catalog/categories').then(r => r.data),
  getOccasions: () => apiClient.get('/catalog/occasions').then(r => r.data),
  getCuisines: () => apiClient.get('/catalog/cuisines').then(r => r.data),

  // ── AI Menu Intelligence ──────────────────
  recommendMenu: (payload) => apiClient.post('/ai/recommend-menu', payload).then(r => r.data),
  getAiHistory: (params) => apiClient.get('/ai/history', { params }).then(r => r.data),
  getAiHistoryById: (id) => apiClient.get(`/ai/history/${id}`).then(r => r.data),

  // ── Orders ────────────────────────────────
  createOrder: (orderData) => apiClient.post('/orders', orderData).then(r => r.data),
  getOrders: (params) => apiClient.get('/orders', { params }).then(r => r.data),
  getOrderById: (id) => apiClient.get(`/orders/${id}`).then(r => r.data),
  updateOrderStatus: (id, status, note) => apiClient.patch(`/orders/${id}/status`, { status, note }).then(r => r.data),
  payOrder: (id) => apiClient.post(`/orders/${id}/pay`).then(r => r.data),
  verifyPayment: (id, paymentData) => apiClient.post(`/orders/${id}/verify-payment`, paymentData).then(r => r.data),

  // ── Saved Menus ───────────────────────────
  getSavedMenus: () => apiClient.get('/orders/saved-menus').then(r => r.data),
  saveMenu: (data) => apiClient.post('/orders/saved-menus', data).then(r => r.data),
  deleteSavedMenu: (id) => apiClient.delete(`/orders/saved-menus/${id}`).then(r => r.data),

  // ── Partner Portal ────────────────────────
  getPartnerDashboard: () => apiClient.get('/partner/dashboard').then(r => r.data),
  getPartnerProfile: () => apiClient.get('/partner/profile').then(r => r.data),
  updatePartnerProfile: (data) => apiClient.patch('/partner/profile', data).then(r => r.data),
  getPartnerDishes: () => apiClient.get('/partner/dishes').then(r => r.data),
  getPartnerOrders: (params) => apiClient.get('/partner/orders', { params }).then(r => r.data),
  updatePartnerOrderStatus: (id, status, note) => apiClient.patch(`/partner/orders/${id}/status`, { status, note }).then(r => r.data),
  updatePartnerDish: (id, data) => apiClient.patch(`/partner/dishes/${id}`, data).then(r => r.data),

  // ── Admin Portal ──────────────────────────
  getAdminDashboard: () => apiClient.get('/admin/dashboard').then(r => r.data),
  getAdminOrders: (params) => apiClient.get('/admin/orders', { params }).then(r => r.data),
  updateAdminOrderStatus: (id, status, note) => apiClient.patch(`/admin/orders/${id}/status`, { status, note }).then(r => r.data),
  getAdminPartners: (params) => apiClient.get('/admin/partners', { params }).then(r => r.data),
  updateAdminPartner: (id, data) => apiClient.patch(`/admin/partners/${id}`, data).then(r => r.data),
  getAdminUsers: (params) => apiClient.get('/admin/users', { params }).then(r => r.data),
  updateAdminUser: (id, data) => apiClient.patch(`/admin/users/${id}`, data).then(r => r.data),
  getAdminAiLogs: (params) => apiClient.get('/admin/ai-logs', { params }).then(r => r.data),
  getAdminAnalytics: (days) => apiClient.get('/admin/analytics', { params: { days } }).then(r => r.data),

  // ── Onboarding Portal ─────────────────────
  getOnboardingStatus: () => apiClient.get('/onboarding/status').then(r => r.data),
  saveOnboardingDraft: (data) => apiClient.post('/onboarding/draft', data).then(r => r.data),
  submitOnboarding: (data) => apiClient.post('/onboarding/submit', data).then(r => r.data),
  getAdminOnboardingApplications: (params) => apiClient.get('/onboarding/admin/applications', { params }).then(r => r.data),
  updateAdminOnboardingStatus: (id, status, reviewNotes) => apiClient.post(`/onboarding/admin/${id}/status`, { status, reviewNotes }).then(r => r.data),
};

export default apiClient;
