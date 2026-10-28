import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import {
  Globe,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Plus,
  Trash2,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

export function SEOView() {
  const { addToast } = useAuth();
  const [activeTab, setActiveTab] = useState('health'); // 'health' | 'redirects'
  const [seoHealth, setSeoHealth] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(true);

  // Redirects state
  const [redirects, setRedirects] = useState([]);
  const [loadingRedirects, setLoadingRedirects] = useState(false);
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);
  const [redirectForm, setRedirectForm] = useState({
    sourcePath: '',
    destinationPath: '',
    statusCode: 301,
    isActive: true,
  });
  const [savingRedirect, setSavingRedirect] = useState(false);
  const [deleteRedirectId, setDeleteRedirectId] = useState(null);

  const fetchSeoHealth = async () => {
    try {
      setLoadingHealth(true);
      const res = await api.get('/seo/health');
      if (res.success) {
        setSeoHealth(res.data);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoadingHealth(false);
    }
  };

  const fetchRedirects = async () => {
    try {
      setLoadingRedirects(true);
      const res = await api.get('/seo/redirects');
      if (res.success) {
        setRedirects(res.data);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoadingRedirects(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'health') {
      fetchSeoHealth();
    } else {
      fetchRedirects();
    }
  }, [activeTab]);

  const handleSaveRedirect = async (e) => {
    e.preventDefault();
    try {
      setSavingRedirect(true);
      await api.post('/seo/redirects', redirectForm);
      addToast('Redirect rule created.', 'success');
      setIsRedirectModalOpen(false);
      fetchRedirects();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSavingRedirect(false);
    }
  };

  const handleDeleteRedirect = async () => {
    if (!deleteRedirectId) return;
    try {
      await api.delete(`/seo/redirects/${deleteRedirectId}`);
      addToast('Redirect rule deleted.', 'success');
      setDeleteRedirectId(null);
      fetchRedirects();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const redirectColumns = [
    {
      header: 'Source Path',
      render: (row) => <code style={{ fontWeight: 600 }}>{row.sourcePath}</code>,
    },
    {
      header: 'Destination URL',
      render: (row) => (
        <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {row.destinationPath}
        </span>
      ),
    },
    {
      header: 'Type',
      render: (row) => (
        <span className="badge badge-info">{row.statusCode} Permanent</span>
      ),
    },
    {
      header: 'Hit Count',
      accessor: 'hitCount',
    },
    {
      header: 'Actions',
      render: (row) => (
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={() => setDeleteRedirectId(row._id)}
          title="Delete Rule"
        >
          <Trash2 size={14} />
        </button>
      ),
    },
  ];

  return (
    <div>
      <div
        className="card"
        style={{
          padding: '20px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)' }}>
            Central SEO Health & Redirects Engine
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Audit indexability scores, identify missing metadata, and configure 301/302 redirects.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <a
            href="/api/v1/public/sitemap.xml"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <Globe size={14} /> View Live sitemap.xml <ExternalLink size={12} />
          </a>
          <button className="btn btn-secondary btn-sm" onClick={fetchSeoHealth}>
            <RefreshCw size={14} /> Run SEO Audit
          </button>
        </div>
      </div>

      <div className="card">
        <div className="tabs-header" style={{ padding: '0 20px', marginBottom: 0 }}>
          <button
            className={`tab-btn ${activeTab === 'health' ? 'active' : ''}`}
            onClick={() => setActiveTab('health')}
          >
            SEO Health & Quality Audit
          </button>
          <button
            className={`tab-btn ${activeTab === 'redirects' ? 'active' : ''}`}
            onClick={() => setActiveTab('redirects')}
          >
            URL Redirects (301/302)
          </button>
        </div>

        <div className="card-body">
          {activeTab === 'health' && (
            <div>
              {loadingHealth ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  Scanning database content for SEO metadata completeness...
                </div>
              ) : (
                <div>
                  {/* Score Card */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '24px',
                      padding: '24px',
                      background: '#F8FAFC',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      marginBottom: '24px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background:
                          (seoHealth?.score || 0) >= 80
                            ? 'var(--success-bg)'
                            : (seoHealth?.score || 0) >= 60
                            ? 'var(--warning-bg)'
                            : 'var(--danger-bg)',
                        color:
                          (seoHealth?.score || 0) >= 80
                            ? 'var(--success)'
                            : (seoHealth?.score || 0) >= 60
                            ? 'var(--warning)'
                            : 'var(--danger)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '26px',
                        fontWeight: 800,
                      }}
                    >
                      {seoHealth?.score || 85}%
                    </div>

                    <div>
                      <h2 style={{ fontSize: '18px', fontWeight: 700 }}>
                        Overall Content Indexability Score
                      </h2>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Evaluated across {seoHealth?.totalItems || 0} core content records (pages, blogs, services) and digital assets.
                      </p>
                      <div style={{ marginTop: '8px', fontSize: '13px' }}>
                        <strong>{seoHealth?.totalIssues || 0}</strong> item(s) require SEO optimization or alt text.
                      </div>
                    </div>
                  </div>

                  {/* Issues List */}
                  <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '14px' }}>
                    Identified SEO Optimization Opportunities
                  </h3>

                  {seoHealth?.issues?.length === 0 ? (
                    <div
                      style={{
                        padding: '30px',
                        textAlign: 'center',
                        background: '#ECFDF5',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--success)',
                        fontWeight: 500,
                      }}
                    >
                      <CheckCircle size={24} style={{ display: 'inline', marginRight: '8px' }} />
                      All indexed content meets SEO best practice baselines!
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {seoHealth?.issues?.map((issue, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            background: '#FFFFFF',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-sm)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <AlertTriangle
                              size={16}
                              color={
                                issue.type === 'error'
                                  ? 'var(--danger)'
                                  : issue.type === 'warning'
                                  ? 'var(--warning)'
                                  : 'var(--info)'
                              }
                            />
                            <div>
                              <span style={{ fontWeight: 600, fontSize: '13.5px' }}>
                                [{issue.module}] {issue.title}
                              </span>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                {issue.message}
                              </div>
                            </div>
                          </div>

                          <span
                            className={`badge ${
                              issue.type === 'error'
                                ? 'badge-danger'
                                : issue.type === 'warning'
                                ? 'badge-warning'
                                : 'badge-info'
                            }`}
                          >
                            {issue.type.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'redirects' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Prevent broken 404 links by routing legacy URLs to active content endpoints.
                </span>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsRedirectModalOpen(true)}
                >
                  <Plus size={14} /> Add 301 Redirect Rule
                </button>
              </div>

              <DataTable
                columns={redirectColumns}
                data={redirects}
                loading={loadingRedirects}
              />
            </div>
          )}
        </div>
      </div>

      {/* Add Redirect Modal */}
      <Modal
        isOpen={isRedirectModalOpen}
        onClose={() => setIsRedirectModalOpen(false)}
        title="Add URL Redirect Rule"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsRedirectModalOpen(false)}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSaveRedirect}
              disabled={savingRedirect}
            >
              {savingRedirect ? 'Creating...' : 'Save Redirect'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveRedirect}>
          <div className="form-group">
            <label className="form-label">Incoming Source Path</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="/old-services-page"
              value={redirectForm.sourcePath}
              onChange={(e) => setRedirectForm({ ...redirectForm, sourcePath: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Destination URL or Path</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="/services or https://..."
              value={redirectForm.destinationPath}
              onChange={(e) =>
                setRedirectForm({ ...redirectForm, destinationPath: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">HTTP Status Code</label>
            <select
              className="form-control"
              value={redirectForm.statusCode}
              onChange={(e) =>
                setRedirectForm({ ...redirectForm, statusCode: Number(e.target.value) })
              }
            >
              <option value={301}>301 Permanent Redirect (SEO Link Equity Transferred)</option>
              <option value={302}>302 Temporary Redirect</option>
            </select>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteRedirectId}
        onClose={() => setDeleteRedirectId(null)}
        onConfirm={handleDeleteRedirect}
        message="Are you sure you want to delete this redirect rule?"
      />
    </div>
  );
}
