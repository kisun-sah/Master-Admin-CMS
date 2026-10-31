import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { LoginView } from './features/auth/LoginView.jsx';

export default function AdminLoginPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-canvas, #0B0F19)',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '4px solid var(--border, #1F2937)',
            borderTopColor: 'var(--primary, #4F46E5)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted, #94A3B8)' }}>
          Checking session credentials...
        </div>
      </div>
    );
  }

  // If already authenticated, redirect to /admin/dashboard
  if (user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <LoginView />;
}

