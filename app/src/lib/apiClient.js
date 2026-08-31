// Enhanced API client with authentication support
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

let accessToken = localStorage.getItem('ft_access_token') || null;
let refreshToken = localStorage.getItem('ft_refresh_token') || null;
let onLogout = null;

export function setAuthTokens(access, refresh) {
  accessToken = access;
  refreshToken = refresh;
  if (access) localStorage.setItem('ft_access_token', access);
  else localStorage.removeItem('ft_access_token');
  if (refresh) localStorage.setItem('ft_refresh_token', refresh);
  else localStorage.removeItem('ft_refresh_token');
}

export function setOnLogout(cb) {
  onLogout = cb;
}

export function getAccessToken() {
  return accessToken;
}

async function tryRefreshToken() {
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) throw new Error('Refresh failed');
    const data = await res.json();
    setAuthTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    setAuthTokens(null, null);
    if (onLogout) onLogout();
    return false;
  }
}

/**
 * Authenticated fetch wrapper — auto-attaches token, handles refresh
 */
export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let res = await fetch(url, { ...options, headers });

  // If 401, try refresh
  if (res.status === 401 && refreshToken) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${accessToken}`;
      res = await fetch(url, { ...options, headers });
    }
  }

  return res;
}

/**
 * Typed API methods
 */
export const api = {
  // Auth
  async register(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw json;
    setAuthTokens(json.accessToken, json.refreshToken);
    return json;
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) throw json;
    setAuthTokens(json.accessToken, json.refreshToken);
    return json;
  },

  async logout() {
    try {
      await apiFetch('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    } catch { /* ok */ }
    setAuthTokens(null, null);
    localStorage.removeItem('ft_user');
  },

  async getMe() {
    const res = await apiFetch('/auth/me');
    if (!res.ok) throw await res.json();
    return res.json();
  },

  // Catalog
  async getPartners(params) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`${API_BASE}/catalog/partners${qs}`);
    return res.json();
  },

  async getPartner(id) {
    const res = await fetch(`${API_BASE}/catalog/partners/${id}`);
    return res.json();
  },

  async getDishes(params) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`${API_BASE}/catalog/dishes${qs}`);
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/catalog/categories`);
    return res.json();
  },

  async getOccasions() {
    const res = await fetch(`${API_BASE}/catalog/occasions`);
    return res.json();
  },

  // AI
  async recommendMenu(data) {
    const res = await apiFetch('/ai/recommend-menu', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw json;
    return json;
  },

  async getRecommendation(id) {
    const res = await apiFetch(`/ai/recommendations/${id}`);
    return res.json();
  },

  // Orders
  async createOrder(data) {
    const res = await apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw json;
    return json;
  },

  async getOrders(params) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await apiFetch(`/orders${qs}`);
    return res.json();
  },

  async getOrder(id) {
    const res = await apiFetch(`/orders/${id}`);
    return res.json();
  },

  async updateOrderStatus(id, status, note) {
    const res = await apiFetch(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    });
    const json = await res.json();
    if (!res.ok) throw json;
    return json;
  },

  // Saved Menus
  async saveMenu(data) {
    const res = await apiFetch('/orders/saved-menus', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw json;
    return json;
  },

  async getSavedMenus() {
    const res = await apiFetch('/orders/saved-menus');
    return res.json();
  },

  async deleteSavedMenu(id) {
    const res = await apiFetch(`/orders/saved-menus/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // User profile
  async updateProfile(data) {
    const res = await apiFetch('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updatePreferences(data) {
    const res = await apiFetch('/users/preferences', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Partner
  async getPartnerDashboard() {
    const res = await apiFetch('/partner/dashboard');
    return res.json();
  },

  async getPartnerOrders(params) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await apiFetch(`/partner/orders${qs}`);
    return res.json();
  },

  async getPartnerDishes() {
    const res = await apiFetch('/partner/dishes');
    return res.json();
  },

  async createPartnerDish(data) {
    const res = await apiFetch('/partner/dishes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updatePartnerDish(id, data) {
    const res = await apiFetch(`/partner/dishes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deletePartnerDish(id) {
    await apiFetch(`/partner/dishes/${id}`, { method: 'DELETE' });
  },

  async getPartnerAnalytics(days = 30) {
    const res = await apiFetch(`/partner/analytics?days=${days}`);
    return res.json();
  },

  // Admin
  async getAdminDashboard() {
    const res = await apiFetch('/admin/dashboard');
    return res.json();
  },

  async getAdminUsers(params) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await apiFetch(`/admin/users${qs}`);
    return res.json();
  },

  async deleteAdminUser(id) {
    const res = await apiFetch(`/admin/users/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async getAdminPartners(params) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await apiFetch(`/admin/partners${qs}`);
    return res.json();
  },

  async updateAdminPartner(id, data) {
    const res = await apiFetch(`/admin/partners/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getAdminOrders(params) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await apiFetch(`/admin/orders${qs}`);
    return res.json();
  },

  async getAdminAILogs(params) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await apiFetch(`/admin/ai-logs${qs}`);
    return res.json();
  },

  async getAdminAnalytics(days = 30) {
    const res = await apiFetch(`/admin/analytics?days=${days}`);
    return res.json();
  },

  // Admin Catalog Management
  async getAdminCategories() {
    const res = await apiFetch('/admin/categories');
    return res.json();
  },
  
  async createAdminCategory(data) {
    const res = await apiFetch('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteAdminCategory(id) {
    await apiFetch(`/admin/categories/${id}`, { method: 'DELETE' });
  },

  async getAdminDishes(params) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await apiFetch(`/admin/dishes${qs}`);
    return res.json();
  },

  async createAdminDish(data) {
    const res = await apiFetch('/admin/dishes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateAdminDish(id, data) {
    const res = await apiFetch(`/admin/dishes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteAdminDish(id) {
    await apiFetch(`/admin/dishes/${id}`, { method: 'DELETE' });
  },

  // Health
  async health() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },
};
