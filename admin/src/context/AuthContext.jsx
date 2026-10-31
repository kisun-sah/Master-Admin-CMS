import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.success && res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success && res.data?.user) {
      setUser(res.data.user);
      addToast(`Welcome back, ${res.data.user.displayName}!`, 'success');
      return res.data.user;
    }
    throw new Error('Login failed.');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch (err) {
      console.warn('Logout error', err);
    } finally {
      setUser(null);
      addToast('Signed out safely.', 'info');
    }
  };

  const hasPermission = (perm) => {
    if (!user) return false;
    if (user.role === 'superadmin' || user.role === 'admin') return true;
    if (!user.permissions) return false;
    return user.permissions.includes(perm) || user.permissions.includes('*');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        logout,
        hasPermission,
        addToast,
        checkAuth,
      }}
    >
      {children}
      {/* Toast Renderer */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="toast"
            style={{
              borderColor:
                toast.type === 'error'
                  ? 'var(--danger)'
                  : toast.type === 'warning'
                  ? 'var(--warning)'
                  : 'var(--border)',
            }}
            onClick={() => removeToast(toast.id)}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor:
                  toast.type === 'error'
                    ? 'var(--danger)'
                    : toast.type === 'warning'
                    ? 'var(--warning)'
                    : 'var(--success)',
              }}
            />
            <span style={{ flex: 1 }}>{toast.message}</span>
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
