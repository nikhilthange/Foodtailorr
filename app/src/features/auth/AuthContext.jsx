// Auth context — manages authentication state across the app
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, setOnLogout, getAccessToken } from '../../lib/apiClient.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ft_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  // Set logout callback
  useEffect(() => {
    setOnLogout(() => {
      setUser(null);
      localStorage.removeItem('ft_user');
    });
  }, []);

  // Check existing auth on mount
  useEffect(() => {
    const token = getAccessToken();
    if (token && !user) {
      api.getMe()
        .then(data => {
          setUser(data);
          localStorage.setItem('ft_user', JSON.stringify(data));
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem('ft_user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await api.login(email, password);
    setUser(result.user);
    localStorage.setItem('ft_user', JSON.stringify(result.user));
    return result.user;
  }, []);

  const register = useCallback(async (data) => {
    const result = await api.register(data);
    setUser(result.user);
    localStorage.setItem('ft_user', JSON.stringify(result.user));
    return result.user;
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
    localStorage.removeItem('ft_user');
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isPartner: user?.role === 'PARTNER',
    isCustomer: user?.role === 'CUSTOMER',
    login,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
