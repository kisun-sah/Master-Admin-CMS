import React from 'react';
import { AlertTriangle, RefreshCw, LayoutDashboard } from 'lucide-react';

export class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Admin Module Error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="admin-error-fallback" style={{ padding: '32px', textAlign: 'center' }}>
          <div
            style={{
              maxWidth: '480px',
              margin: '40px auto',
              background: 'var(--bg-surface, #ffffff)',
              border: '1px solid var(--border, #e2e8f0)',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <AlertTriangle style={{ width: '24px', height: '24px' }} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text, #0f172a)', marginBottom: '8px' }}>
              Module Render Error
            </h3>

            <p style={{ fontSize: '13px', color: 'var(--text-muted, #64748b)', marginBottom: '24px', lineHeight: 1.5 }}>
              {this.state.error?.message || 'An unexpected error occurred while rendering this administrative module.'}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={this.handleRetry}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: 'var(--primary, #2563eb)',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <RefreshCw style={{ width: '14px', height: '14px' }} />
                <span>Retry Module</span>
              </button>

              {this.props.onReset && (
                <button
                  type="button"
                  onClick={this.props.onReset}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'transparent',
                    color: 'var(--text, #0f172a)',
                    border: '1px solid var(--border, #e2e8f0)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <LayoutDashboard style={{ width: '14px', height: '14px' }} />
                  <span>Go to Dashboard</span>
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
