import React from 'react';
import { useAuth } from './context/AuthContext.jsx';
import { LoginView } from './features/auth/LoginView.jsx';
import { AppLayout } from './components/layout/AppLayout.jsx';

export default function App() {
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
          background: 'var(--bg-canvas)',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '4px solid var(--border)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>
          Validating Master Admin CMS Session...
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  return <AppLayout />;
}
