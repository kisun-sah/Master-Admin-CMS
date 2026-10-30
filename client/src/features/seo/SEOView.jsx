import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { MediaPickerModal } from '../../components/common/MediaPickerModal.jsx';
import {
  Globe,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  RefreshCw,
  Search,
  Download,
  Upload,
  FileText,
  ArrowRight,
  TrendingUp,
  Sliders,
  Check,
  X,
  ShieldAlert,
  BarChart2,
  Settings as SettingsIcon,
  Link as LinkIcon,
  Image as ImageIcon,
} from 'lucide-react';

export function SEOView({ onNavigate }) {
  const { addToast } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'audit' | 'redirects' | 'settings'

  // --- Health & Dashboard State ---
  const [seoHealth, setSeoHealth] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [auditTrends, setAuditTrends] = useState([]);
  const [loadingTrends, setLoadingTrends] = useState(false);

  // --- Audit Filter State ---
  const [auditTypeFilter, setAuditTypeFilter] = useState('all');
  const [auditSeverityFilter, setAuditSeverityFilter] = useState('all');
  const [auditSearch, setAuditSearch] = useState('');

  // --- Redirects State ---
  const [redirects, setRedirects] = useState([]);
  const [loadingRedirects, setLoadingRedirects] = useState(false);
  const [redirectPage, setRedirectPage] = useState(1);
  const [redirectLimit] = useState(15);
  const [redirectTotalPages, setRedirectTotalPages] = useState(1);
  const [redirectTotalCount, setRedirectTotalCount] = useState(0);
  const [redirectSearch, setRedirectSearch] = useState('');
  const [redirectCodeFilter, setRedirectCodeFilter] = useState('');
  const [redirectActiveFilter, setRedirectActiveFilter] = useState('');

  // Redirect Modal State
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);
  const [editingRedirectId, setEditingRedirectId] = useState(null);
  const [redirectForm, setRedirectForm] = useState({
    sourcePath: '',
    destinationPath: '',
    statusCode: 301,
    isActive: true,
    description: '',
  });
  const [savingRedirect, setSavingRedirect] = useState(false);
  const [redirectWarning, setRedirectWarning] = useState(null);
  const [deleteRedirectId, setDeleteRedirectId] = useState(null);

  // CSV Import State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  // --- Global SEO Settings State ---
  const [seoSettings, setSeoSettings] = useState({
    siteTitle: '',
    siteUrl: '',
    defaultMetaDescription: '',
    defaultOgImage: '',
    defaultTwitterImage: '',
    defaultCanonicalBase: '',
    robotsDirective: 'index, follow',
    customRobotsTxt: '',
  });
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState(null); // 'og' | 'twitter' | null

  // Fetch SEO Health
  const fetchSeoHealth = async () => {
    try {
      setLoadingHealth(true);
      const res = await api.get('/seo/health');
      if (res.success) {
        setSeoHealth(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Failed to scan SEO health.', 'error');
    } finally {
      setLoadingHealth(false);
    }
  };

  // Fetch SEO Historical Trends
  const fetchAuditTrends = async () => {
    try {
      setLoadingTrends(true);
      const res = await api.get('/seo/trends', { limit: 10 });
      if (res.success) {
        setAuditTrends(res.data || []);
      }
    } catch (err) {
      console.warn('Failed to load SEO audit trends:', err.message);
    } finally {
      setLoadingTrends(false);
    }
  };

  // Fetch Redirects with server-side pagination & filtering
  const fetchRedirects = async () => {
    try {
      setLoadingRedirects(true);
      const params = {
        page: redirectPage,
        limit: redirectLimit,
        search: redirectSearch,
      };
      if (redirectCodeFilter) params.statusCode = redirectCodeFilter;
      if (redirectActiveFilter) params.isActive = redirectActiveFilter;

      const res = await api.get('/seo/redirects', params);
      if (res.success) {
        setRedirects(res.data || []);
        if (res.meta) {
          setRedirectTotalPages(res.meta.totalPages || 1);
          setRedirectTotalCount(res.meta.total || 0);
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch redirect rules.', 'error');
    } finally {
      setLoadingRedirects(false);
    }
  };

  // Fetch Global SEO Settings
  const fetchSeoSettings = async () => {
    try {
      setLoadingSettings(true);
      const res = await api.get('/seo/settings');
      if (res.success && res.data) {
        setSeoSettings({
          siteTitle: res.data.siteTitle || '',
          siteUrl: res.data.siteUrl || '',
          defaultMetaDescription: res.data.defaultMetaDescription || '',
          defaultOgImage: res.data.defaultOgImage || '',
          defaultTwitterImage: res.data.defaultTwitterImage || '',
          defaultCanonicalBase: res.data.defaultCanonicalBase || '',
          robotsDirective: res.data.robotsDirective || 'index, follow',
          customRobotsTxt: res.data.customRobotsTxt || '',
        });
      }
    } catch (err) {
      addToast(err.message || 'Failed to load SEO settings.', 'error');
    } finally {
      setLoadingSettings(false);
    }
  };

  // Tab change effect
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchSeoHealth();
      fetchAuditTrends();
    } else if (activeTab === 'audit') {
      if (!seoHealth) fetchSeoHealth();
    } else if (activeTab === 'redirects') {
      fetchRedirects();
    } else if (activeTab === 'settings') {
      fetchSeoSettings();
    }
  }, [activeTab]);

  // Refetch redirects on filter/page change
  useEffect(() => {
    if (activeTab === 'redirects') {
      fetchRedirects();
    }
  }, [redirectPage, redirectSearch, redirectCodeFilter, redirectActiveFilter]);

  // Open Add Redirect Modal
  const handleOpenAddRedirect = () => {
    setEditingRedirectId(null);
    setRedirectWarning(null);
    setRedirectForm({
      sourcePath: '',
      destinationPath: '',
      statusCode: 301,
      isActive: true,
      description: '',
    });
    setIsRedirectModalOpen(true);
  };

  // Open Edit Redirect Modal
  const handleOpenEditRedirect = (item) => {
    setEditingRedirectId(item._id);
    setRedirectWarning(null);
    setRedirectForm({
      sourcePath: item.sourcePath || '',
      destinationPath: item.destinationPath || '',
      statusCode: item.statusCode || 301,
      isActive: item.isActive !== false,
      description: item.description || '',
    });
    setIsRedirectModalOpen(true);
  };

  // Save / Update Redirect Rule
  const handleSaveRedirect = async (e) => {
    e.preventDefault();
    try {
      setSavingRedirect(true);
      setRedirectWarning(null);

      let res;
      if (editingRedirectId) {
        res = await api.put(`/seo/redirects/${editingRedirectId}`, redirectForm);
        addToast('Redirect rule updated successfully.', 'success');
      } else {
        res = await api.post('/seo/redirects', redirectForm);
        addToast('Redirect rule created successfully.', 'success');
      }

      if (res.warning) {
        setRedirectWarning(res.warning);
        addToast(res.warning, 'warning');
      } else {
        setIsRedirectModalOpen(false);
      }
      fetchRedirects();
    } catch (err) {
      addToast(err.message || 'Failed to save redirect rule.', 'error');
    } finally {
      setSavingRedirect(false);
    }
  };

  // Toggle Redirect Active State
  const handleToggleRedirectActive = async (item) => {
    try {
      await api.put(`/seo/redirects/${item._id}`, {
        isActive: !item.isActive,
      });
      addToast(`Redirect ${!item.isActive ? 'activated' : 'deactivated'}.`, 'success');
      fetchRedirects();
    } catch (err) {
      addToast(err.message || 'Failed to toggle status.', 'error');
    }
  };

  // Delete Redirect Rule
  const handleDeleteRedirect = async () => {
    if (!deleteRedirectId) return;
    try {
      await api.delete(`/seo/redirects/${deleteRedirectId}`);
      addToast('Redirect rule deleted.', 'success');
      setDeleteRedirectId(null);
      fetchRedirects();
    } catch (err) {
      addToast(err.message || 'Failed to delete redirect rule.', 'error');
    }
  };

  // Export CSV
  const handleExportCsv = async () => {
    try {
      const res = await fetch('/api/v1/seo/redirects/export/csv', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to export CSV file.');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `redirects-export-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      addToast('Redirects CSV file exported successfully.', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to download CSV.', 'error');
    }
  };

  // Import CSV
  const handleImportCsv = async (e) => {
    e.preventDefault();
    if (!importFile) {
      addToast('Please select a valid CSV file to upload.', 'error');
      return;
    }
    try {
      setImporting(true);
      setImportResult(null);
      const formData = new FormData();
      formData.append('file', importFile);
      const res = await api.post('/seo/redirects/import/csv', formData);
      if (res.success) {
        setImportResult(res);
        addToast(res.message || 'Redirects imported successfully.', 'success');
        fetchRedirects();
      }
    } catch (err) {
      addToast(err.message || 'Failed to import CSV.', 'error');
    } finally {
      setImporting(false);
    }
  };

  // Save Global SEO Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      const res = await api.put('/seo/settings', seoSettings);
      if (res.success) {
        addToast('Global SEO & indexing settings saved successfully.', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to update SEO settings.', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  // Filtered issues for the Audit table
  const filteredIssues = (seoHealth?.issues || []).filter((issue) => {
    if (auditTypeFilter !== 'all' && issue.itemType !== auditTypeFilter) return false;
    if (auditSeverityFilter !== 'all' && issue.severity !== auditSeverityFilter) return false;
    if (auditSearch.trim()) {
      const q = auditSearch.toLowerCase();
      const titleMatch = (issue.title || '').toLowerCase().includes(q);
      const msgMatch = (issue.issue || '').toLowerCase().includes(q);
      const recMatch = (issue.recommendation || '').toLowerCase().includes(q);
      if (!titleMatch && !msgMatch && !recMatch) return false;
    }
    return true;
  });

  // Calculate score color helper
  const getScoreColor = (score = 0) => {
    if (score >= 80) return 'var(--success)';
    if (score >= 60) return 'var(--warning)';
    return 'var(--danger)';
  };

  const getScoreBg = (score = 0) => {
    if (score >= 80) return 'var(--success-bg)';
    if (score >= 60) return 'var(--warning-bg)';
    return 'var(--danger-bg)';
  };

  // Redirect table columns
  const redirectColumns = [
    {
      header: 'Source Path',
      render: (row) => (
        <div>
          <code style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '13px' }}>
            {row.sourcePath}
          </code>
          {row.description && (
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {row.description}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Destination URL',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowRight size={13} color="var(--text-muted)" />
          <span style={{ color: 'var(--primary)', fontWeight: 500, wordBreak: 'break-all' }}>
            {row.destinationPath}
          </span>
        </div>
      ),
    },
    {
      header: 'Status Code',
      render: (row) => (
        <span className={`badge ${row.statusCode === 301 ? 'badge-info' : 'badge-warning'}`}>
          {row.statusCode} {row.statusCode === 301 ? 'Permanent' : 'Temporary'}
        </span>
      ),
    },
    {
      header: 'Active State',
      render: (row) => (
        <button
          onClick={() => handleToggleRedirectActive(row)}
          className={`badge ${row.isActive ? 'badge-success' : 'badge-danger'}`}
          style={{ cursor: 'pointer', border: 'none', padding: '4px 8px' }}
          title="Click to toggle active state"
        >
          {row.isActive ? 'Active' : 'Inactive'}
        </button>
      ),
    },
    {
      header: 'Hits',
      render: (row) => (
        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
          {row.hitCount || 0}
        </span>
      ),
    },
    {
      header: 'Last Triggered',
      render: (row) => (
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {row.lastTriggeredAt
            ? new Date(row.lastTriggeredAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Never'}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => handleOpenEditRedirect(row)}
            title="Edit Rule"
          >
            <Edit2 size={13} />
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => setDeleteRedirectId(row._id)}
            title="Delete Rule"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Top Banner & Fast Actions */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <Globe size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)' }}>
                SEO Health & 301 Redirects Engine
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Complete search engine optimization suite: dynamic sitemap, robots.txt, 301/302 redirects, and indexability audits.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <a
            href="/api/v1/public/sitemap.xml"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-sm"
            title="View dynamic XML sitemap generated from published content"
          >
            <Globe size={14} /> View sitemap.xml <ExternalLink size={12} />
          </a>
          <a
            href="/robots.txt"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-sm"
            title="View live robots.txt crawler directives"
          >
            <FileText size={14} /> View robots.txt <ExternalLink size={12} />
          </a>
          <button
            className="btn btn-primary btn-sm"
            onClick={fetchSeoHealth}
            disabled={loadingHealth}
          >
            <RefreshCw size={14} className={loadingHealth ? 'animate-spin' : ''} />
            {loadingHealth ? 'Scanning...' : 'Run Full SEO Audit'}
          </button>
        </div>
      </div>

      {/* Main Feature Tabs */}
      <div className="card">
        <div className="tabs-header" style={{ padding: '0 20px', marginBottom: 0 }}>
          <button
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <BarChart2 size={15} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
            SEO Dashboard & Trends
          </button>
          <button
            className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            <ShieldAlert size={15} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
            Content Audit
            {seoHealth?.totalIssues > 0 && (
              <span
                style={{
                  marginLeft: '8px',
                  background: 'var(--danger-bg)',
                  color: 'var(--danger)',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                {seoHealth.totalIssues}
              </span>
            )}
          </button>
          <button
            className={`tab-btn ${activeTab === 'redirects' ? 'active' : ''}`}
            onClick={() => setActiveTab('redirects')}
          >
            <LinkIcon size={15} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
            Redirect Manager (301/302)
          </button>
          <button
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <SettingsIcon size={15} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
            Global SEO & Robots Settings
          </button>
        </div>

        <div className="card-body">
          {/* ========================================================= */}
          {/* TAB 1: SEO DASHBOARD & TRENDS                             */}
          {/* ========================================================= */}
          {activeTab === 'dashboard' && (
            <div>
              {loadingHealth ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                  <RefreshCw
                    size={28}
                    className="animate-spin"
                    style={{ margin: '0 auto 12px', color: 'var(--primary)' }}
                  />
                  <div style={{ fontSize: '15px', fontWeight: 600 }}>
                    Scanning database records for SEO completeness & technical health...
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Auditing title tags, meta descriptions, H1 headings, open graph, alt attributes, and broken links.
                  </div>
                </div>
              ) : (
                <div>
                  {/* Top Score Banner */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '24px',
                      background: '#F8FAFC',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      marginBottom: '24px',
                      flexWrap: 'wrap',
                      gap: '20px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                      <div
                        style={{
                          width: '90px',
                          height: '90px',
                          borderRadius: '50%',
                          background: getScoreBg(seoHealth?.score),
                          color: getScoreColor(seoHealth?.score),
                          border: `3px solid ${getScoreColor(seoHealth?.score)}`,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <span style={{ fontSize: '28px', fontWeight: 800, lineHeight: 1 }}>
                          {seoHealth?.score ?? 0}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                          Score
                        </span>
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)' }}>
                            {seoHealth?.status || 'SEO Quality Assessment'}
                          </h2>
                          <span
                            className={`badge ${
                              (seoHealth?.score || 0) >= 80
                                ? 'badge-success'
                                : (seoHealth?.score || 0) >= 60
                                ? 'badge-warning'
                                : 'badge-danger'
                            }`}
                          >
                            {(seoHealth?.score || 0) >= 80
                              ? 'Indexable & Healthy'
                              : (seoHealth?.score || 0) >= 60
                              ? 'Needs Attention'
                              : 'Critical Issues'}
                          </span>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Evaluated across <strong>{seoHealth?.totalItems || 0}</strong> published content items (Pages, Services, Blogs) and media assets.
                        </p>
                        <div style={{ fontSize: '12px', color: 'var(--text-subtle)', marginTop: '6px' }}>
                          Last scanned:{' '}
                          {seoHealth?.lastAuditAt
                            ? new Date(seoHealth.lastAuditAt).toLocaleString()
                            : 'Just now'}
                        </div>
                      </div>
                    </div>

                    {/* Sub-Score Breakdown Cards */}
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <div
                        style={{
                          padding: '12px 18px',
                          background: '#FFFFFF',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border)',
                          minWidth: '130px',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                          METADATA QUALITY
                        </div>
                        <div
                          style={{
                            fontSize: '22px',
                            fontWeight: 800,
                            color: getScoreColor(seoHealth?.metadataScore),
                            marginTop: '2px',
                          }}
                        >
                          {seoHealth?.metadataScore ?? 100}%
                        </div>
                      </div>

                      <div
                        style={{
                          padding: '12px 18px',
                          background: '#FFFFFF',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border)',
                          minWidth: '130px',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                          ACCESSIBILITY
                        </div>
                        <div
                          style={{
                            fontSize: '22px',
                            fontWeight: 800,
                            color: getScoreColor(seoHealth?.accessibilityScore),
                            marginTop: '2px',
                          }}
                        >
                          {seoHealth?.accessibilityScore ?? 100}%
                        </div>
                      </div>

                      <div
                        style={{
                          padding: '12px 18px',
                          background: '#FFFFFF',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border)',
                          minWidth: '130px',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                          TECHNICAL / INDEX
                        </div>
                        <div
                          style={{
                            fontSize: '22px',
                            fontWeight: 800,
                            color: getScoreColor(seoHealth?.technicalScore),
                            marginTop: '2px',
                          }}
                        >
                          {seoHealth?.technicalScore ?? 100}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Metric Counters */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px',
                      marginBottom: '24px',
                    }}
                  >
                    <div
                      style={{
                        padding: '16px',
                        background: '#FFFFFF',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                      }}
                    >
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '8px',
                          background: 'var(--danger-bg)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--danger)',
                        }}
                      >
                        <ShieldAlert size={22} />
                      </div>
                      <div>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--danger)' }}>
                          {seoHealth?.errorsCount || 0}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                          Critical Errors
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '16px',
                        background: '#FFFFFF',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                      }}
                    >
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '8px',
                          background: 'var(--warning-bg)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--warning)',
                        }}
                      >
                        <AlertTriangle size={22} />
                      </div>
                      <div>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--warning)' }}>
                          {seoHealth?.warningsCount || 0}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                          Warnings
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '16px',
                        background: '#FFFFFF',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                      }}
                    >
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '8px',
                          background: 'var(--info-bg)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--info)',
                        }}
                      >
                        <HelpCircle size={22} />
                      </div>
                      <div>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--info)' }}>
                          {seoHealth?.infoCount || 0}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                          Recommendations
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Breakdown Section */}
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px' }}>
                    Content Coverage & Health by Type
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '16px',
                      marginBottom: '32px',
                    }}
                  >
                    {[
                      {
                        label: 'Standard Pages',
                        type: 'pages',
                        data: seoHealth?.breakdown?.pages,
                        route: 'pages',
                      },
                      {
                        label: 'Services',
                        type: 'services',
                        data: seoHealth?.breakdown?.services,
                        route: 'services',
                      },
                      {
                        label: 'Blog Articles',
                        type: 'blogs',
                        data: seoHealth?.breakdown?.blogs,
                        route: 'blogs',
                      },
                      {
                        label: 'Media Assets (Images)',
                        type: 'media',
                        data: seoHealth?.breakdown?.media,
                        route: 'media',
                      },
                    ].map((item) => (
                      <div
                        key={item.type}
                        style={{
                          padding: '16px',
                          background: '#FFFFFF',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-md)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '10px',
                          }}
                        >
                          <span style={{ fontWeight: 600, fontSize: '14px' }}>{item.label}</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {item.data?.total || 0} items
                          </span>
                        </div>
                        <div style={{ fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Audit Issues:</span>
                          <span
                            style={{
                              fontWeight: 700,
                              color:
                                (item.data?.issues || 0) > 0 ? 'var(--danger)' : 'var(--success)',
                            }}
                          >
                            {item.data?.issues || 0} found
                          </span>
                        </div>
                        {onNavigate && (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ width: '100%', marginTop: '12px', fontSize: '12px' }}
                            onClick={() => onNavigate(item.route)}
                          >
                            Manage {item.label}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Historical Audit Trends */}
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px' }}>
                    Historical Audit Trends
                  </h3>
                  {auditTrends.length === 0 ? (
                    <div
                      style={{
                        padding: '24px',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        background: 'var(--bg-canvas)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px',
                      }}
                    >
                      No historical audits recorded yet. Re-running audits logs your SEO progression over time.
                    </div>
                  ) : (
                    <div
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                      }}
                    >
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '10px 16px', textAlign: 'left' }}>Date & Time</th>
                            <th style={{ padding: '10px 16px', textAlign: 'center' }}>Overall Score</th>
                            <th style={{ padding: '10px 16px', textAlign: 'center' }}>Metadata</th>
                            <th style={{ padding: '10px 16px', textAlign: 'center' }}>Accessibility</th>
                            <th style={{ padding: '10px 16px', textAlign: 'center' }}>Technical</th>
                            <th style={{ padding: '10px 16px', textAlign: 'right' }}>Issues Found</th>
                          </tr>
                        </thead>
                        <tbody>
                          {auditTrends.map((trend, i) => (
                            <tr
                              key={trend._id || i}
                              style={{ borderBottom: '1px solid var(--border)' }}
                            >
                              <td style={{ padding: '10px 16px', color: 'var(--text-muted)' }}>
                                {new Date(trend.createdAt).toLocaleString(undefined, {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                })}
                              </td>
                              <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                                <span
                                  style={{
                                    fontWeight: 700,
                                    color: getScoreColor(trend.overallScore),
                                    background: getScoreBg(trend.overallScore),
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                  }}
                                >
                                  {trend.overallScore}%
                                </span>
                              </td>
                              <td style={{ padding: '10px 16px', textAlign: 'center', fontWeight: 600 }}>
                                {trend.metadataScore}%
                              </td>
                              <td style={{ padding: '10px 16px', textAlign: 'center', fontWeight: 600 }}>
                                {trend.accessibilityScore}%
                              </td>
                              <td style={{ padding: '10px 16px', textAlign: 'center', fontWeight: 600 }}>
                                {trend.technicalScore}%
                              </td>
                              <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                                <span style={{ color: 'var(--danger)', fontWeight: 600, marginRight: '8px' }}>
                                  {trend.errorsCount || 0} err
                                </span>
                                <span style={{ color: 'var(--warning)', fontWeight: 600 }}>
                                  {trend.warningsCount || 0} warn
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: SEO CONTENT AUDIT TABLE                            */}
          {/* ========================================================= */}
          {activeTab === 'audit' && (
            <div>
              {/* Filter and Search Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '18px',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: '240px' }}>
                    <Search
                      size={14}
                      style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                      }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      style={{ paddingLeft: '32px', height: '36px' }}
                      placeholder="Search audit issues..."
                      value={auditSearch}
                      onChange={(e) => setAuditSearch(e.target.value)}
                    />
                  </div>

                  <select
                    className="form-control"
                    style={{ width: '160px', height: '36px' }}
                    value={auditTypeFilter}
                    onChange={(e) => setAuditTypeFilter(e.target.value)}
                  >
                    <option value="all">All Content Types</option>
                    <option value="page">Pages</option>
                    <option value="service">Services</option>
                    <option value="blog">Blog Articles</option>
                    <option value="media">Media Assets</option>
                  </select>

                  <select
                    className="form-control"
                    style={{ width: '150px', height: '36px' }}
                    value={auditSeverityFilter}
                    onChange={(e) => setAuditSeverityFilter(e.target.value)}
                  >
                    <option value="all">All Severities</option>
                    <option value="error">Critical Errors</option>
                    <option value="warning">Warnings</option>
                    <option value="info">Recommendations</option>
                  </select>
                </div>

                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Showing <strong>{filteredIssues.length}</strong> of{' '}
                  <strong>{seoHealth?.issues?.length || 0}</strong> identified issue(s)
                </div>
              </div>

              {/* Issues List / Table */}
              {loadingHealth ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  Scanning database content for SEO metadata completeness...
                </div>
              ) : filteredIssues.length === 0 ? (
                <div
                  style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    background: '#ECFDF5',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--success)',
                    border: '1px solid #A7F3D0',
                  }}
                >
                  <CheckCircle size={32} style={{ display: 'block', margin: '0 auto 10px' }} />
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>
                    No SEO issues match the current filter!
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    All evaluated items satisfy best-practice indexability, metadata, and accessibility requirements.
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {filteredIssues.map((issue, idx) => (
                    <div
                      key={issue.id || idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        background: '#FFFFFF',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-sm)',
                        flexWrap: 'wrap',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1, minWidth: '280px' }}>
                        <div style={{ marginTop: '2px' }}>
                          {issue.severity === 'error' ? (
                            <ShieldAlert size={20} color="var(--danger)" />
                          ) : issue.severity === 'warning' ? (
                            <AlertTriangle size={20} color="var(--warning)" />
                          ) : (
                            <HelpCircle size={20} color="var(--info)" />
                          )}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, fontSize: '14.5px', color: 'var(--text-main)' }}>
                              {issue.title}
                            </span>
                            <span className="badge badge-secondary" style={{ textTransform: 'capitalize' }}>
                              {issue.itemType}
                            </span>
                            <span
                              className={`badge ${
                                issue.severity === 'error'
                                  ? 'badge-danger'
                                  : issue.severity === 'warning'
                                  ? 'badge-warning'
                                  : 'badge-info'
                              }`}
                            >
                              {issue.severity.toUpperCase()}
                            </span>
                          </div>

                          <div
                            style={{
                              fontSize: '13px',
                              color: 'var(--text-main)',
                              fontWeight: 500,
                              marginTop: '4px',
                            }}
                          >
                            {issue.issue}
                          </div>

                          <div
                            style={{
                              fontSize: '12.5px',
                              color: 'var(--text-muted)',
                              marginTop: '2px',
                            }}
                          >
                            <strong>Action:</strong> {issue.recommendation}
                          </div>
                        </div>
                      </div>

                      {/* Direct Edit Button */}
                      {onNavigate && issue.editRoute && (
                        <div>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => onNavigate(issue.editRoute)}
                            title={`Navigate to ${issue.editRoute} to fix this issue`}
                          >
                            <Edit2 size={13} /> Edit in {issue.itemType}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: REDIRECT MANAGER (301/302)                         */}
          {/* ========================================================= */}
          {activeTab === 'redirects' && (
            <div>
              {/* Header Controls */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: '220px' }}>
                    <Search
                      size={14}
                      style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                      }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      style={{ paddingLeft: '32px', height: '36px' }}
                      placeholder="Search source/destination..."
                      value={redirectSearch}
                      onChange={(e) => {
                        setRedirectSearch(e.target.value);
                        setRedirectPage(1);
                      }}
                    />
                  </div>

                  <select
                    className="form-control"
                    style={{ width: '130px', height: '36px' }}
                    value={redirectCodeFilter}
                    onChange={(e) => {
                      setRedirectCodeFilter(e.target.value);
                      setRedirectPage(1);
                    }}
                  >
                    <option value="">All Codes</option>
                    <option value="301">301 Permanent</option>
                    <option value="302">302 Temporary</option>
                  </select>

                  <select
                    className="form-control"
                    style={{ width: '130px', height: '36px' }}
                    value={redirectActiveFilter}
                    onChange={(e) => {
                      setRedirectActiveFilter(e.target.value);
                      setRedirectPage(1);
                    }}
                  >
                    <option value="">All States</option>
                    <option value="true">Active Only</option>
                    <option value="false">Inactive Only</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button className="btn btn-secondary btn-sm" onClick={handleExportCsv} title="Export CSV">
                    <Download size={14} /> Export CSV
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setImportResult(null);
                      setImportFile(null);
                      setIsImportModalOpen(true);
                    }}
                    title="Import CSV"
                  >
                    <Upload size={14} /> Import CSV
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={handleOpenAddRedirect}>
                    <Plus size={14} /> Add 301/302 Rule
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <DataTable
                columns={redirectColumns}
                data={redirects}
                loading={loadingRedirects}
              />

              {/* Pagination Controls */}
              {redirectTotalPages > 1 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '16px',
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                  }}
                >
                  <div>
                    Page <strong>{redirectPage}</strong> of <strong>{redirectTotalPages}</strong> ({redirectTotalCount} total rules)
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      disabled={redirectPage <= 1}
                      onClick={() => setRedirectPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      disabled={redirectPage >= redirectTotalPages}
                      onClick={() => setRedirectPage((p) => p + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: GLOBAL SEO & ROBOTS SETTINGS                       */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
            <div>
              {loadingSettings ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Loading SEO settings...</div>
              ) : (
                <form onSubmit={handleSaveSettings} style={{ maxWidth: '820px' }}>
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Website Canonical Base URL
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://example.com"
                      value={seoSettings.siteUrl}
                      onChange={(e) => setSeoSettings({ ...seoSettings, siteUrl: e.target.value })}
                    />
                    <small style={{ color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                      Used as the root canonical origin for all public links and sitemap.xml entries.
                    </small>
                  </div>

                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Default Website Title / Brand Suffix
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="My Organization | Enterprise Platform"
                      value={seoSettings.siteTitle}
                      onChange={(e) => setSeoSettings({ ...seoSettings, siteTitle: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <label className="form-label" style={{ fontWeight: 600 }}>
                        Default Meta Description
                      </label>
                      <span
                        style={{
                          fontSize: '12px',
                          color:
                            seoSettings.defaultMetaDescription.length >= 120 &&
                            seoSettings.defaultMetaDescription.length <= 160
                              ? 'var(--success)'
                              : 'var(--text-muted)',
                        }}
                      >
                        {seoSettings.defaultMetaDescription.length} / 160 chars (optimal 120-160)
                      </span>
                    </div>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Fallback meta description used whenever an individual page or blog does not define a custom description."
                      value={seoSettings.defaultMetaDescription}
                      onChange={(e) =>
                        setSeoSettings({ ...seoSettings, defaultMetaDescription: e.target.value })
                      }
                    />
                  </div>

                  {/* Open Graph Image */}
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Default Open Graph (OG) Image
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="https://example.com/uploads/og-image.jpg or /uploads/..."
                        value={seoSettings.defaultOgImage}
                        onChange={(e) =>
                          setSeoSettings({ ...seoSettings, defaultOgImage: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setMediaPickerTarget('og')}
                      >
                        <ImageIcon size={15} /> Select Media
                      </button>
                    </div>
                    {seoSettings.defaultOgImage && (
                      <div style={{ marginTop: '8px' }}>
                        <img
                          src={seoSettings.defaultOgImage}
                          alt="Default OG preview"
                          style={{
                            maxHeight: '90px',
                            borderRadius: '4px',
                            border: '1px solid var(--border)',
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Twitter / X Image */}
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Default Twitter / X Card Image
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="https://example.com/uploads/twitter-card.jpg"
                        value={seoSettings.defaultTwitterImage}
                        onChange={(e) =>
                          setSeoSettings({ ...seoSettings, defaultTwitterImage: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setMediaPickerTarget('twitter')}
                      >
                        <ImageIcon size={15} /> Select Media
                      </button>
                    </div>
                    {seoSettings.defaultTwitterImage && (
                      <div style={{ marginTop: '8px' }}>
                        <img
                          src={seoSettings.defaultTwitterImage}
                          alt="Default Twitter preview"
                          style={{
                            maxHeight: '90px',
                            borderRadius: '4px',
                            border: '1px solid var(--border)',
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Global Search Engine Directives */}
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Global Search Engine Directives (Robots Default)
                    </label>
                    <select
                      className="form-control"
                      value={seoSettings.robotsDirective}
                      onChange={(e) =>
                        setSeoSettings({ ...seoSettings, robotsDirective: e.target.value })
                      }
                    >
                      <option value="index, follow">index, follow (Allow full indexing & link equity)</option>
                      <option value="noindex, nofollow">noindex, nofollow (Block all crawlers — Staging/Dev mode)</option>
                      <option value="index, nofollow">index, nofollow (Index pages, do not follow internal links)</option>
                      <option value="noindex, follow">noindex, follow (Do not index, but follow internal links)</option>
                    </select>

                    {seoSettings.robotsDirective.includes('noindex') && (
                      <div
                        style={{
                          marginTop: '8px',
                          padding: '10px 14px',
                          background: 'var(--warning-bg)',
                          border: '1px solid #FDE68A',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '12.5px',
                          color: '#92400E',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <AlertTriangle size={16} />
                        <strong>Warning:</strong> Selecting <code>noindex</code> will prevent Google and search engines from indexing the website.
                      </div>
                    )}
                  </div>

                  {/* Custom Robots.txt Content */}
                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Custom robots.txt Directives
                    </label>
                    <textarea
                      className="form-control"
                      rows={5}
                      style={{ fontFamily: 'monospace', fontSize: '13px' }}
                      placeholder={`# Add custom crawler directives here:\nDisallow: /checkout/\nCrawl-delay: 10`}
                      value={seoSettings.customRobotsTxt}
                      onChange={(e) =>
                        setSeoSettings({ ...seoSettings, customRobotsTxt: e.target.value })
                      }
                    />
                    <small style={{ color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                      These lines are appended into the dynamic <code>/robots.txt</code> response along with automatic <code>/api</code> and <code>/admin</code> exclusions.
                    </small>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={savingSettings}
                    style={{ padding: '10px 24px', fontWeight: 600 }}
                  >
                    {savingSettings ? 'Saving Settings...' : 'Save Global SEO Settings'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Redirect Modal */}
      <Modal
        isOpen={isRedirectModalOpen}
        onClose={() => setIsRedirectModalOpen(false)}
        title={editingRedirectId ? 'Edit Redirect Rule' : 'Create 301/302 Redirect Rule'}
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
              {savingRedirect ? 'Saving...' : editingRedirectId ? 'Update Rule' : 'Create Redirect'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveRedirect}>
          {redirectWarning && (
            <div
              style={{
                padding: '10px 14px',
                background: 'var(--warning-bg)',
                border: '1px solid #FCD34D',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '16px',
                fontSize: '12.5px',
                color: '#92400E',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertTriangle size={16} />
              {redirectWarning}
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label" style={{ fontWeight: 600 }}>
              Source Path (Incoming URL) <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="/old-services-page"
              value={redirectForm.sourcePath}
              onChange={(e) => setRedirectForm({ ...redirectForm, sourcePath: e.target.value })}
            />
            <small style={{ color: 'var(--text-muted)', fontSize: '11.5px' }}>
              Must start with a leading slash (e.g., <code>/old-services</code>).
            </small>
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label" style={{ fontWeight: 600 }}>
              Destination Path or Full URL <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="/services/new-offering or https://..."
              value={redirectForm.destinationPath}
              onChange={(e) =>
                setRedirectForm({ ...redirectForm, destinationPath: e.target.value })
              }
            />
            <small style={{ color: 'var(--text-muted)', fontSize: '11.5px' }}>
              Can be an internal path (<code>/services</code>) or an external URL (<code>https://...</code>).
            </small>
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label" style={{ fontWeight: 600 }}>
              HTTP Status Code
            </label>
            <select
              className="form-control"
              value={redirectForm.statusCode}
              onChange={(e) =>
                setRedirectForm({ ...redirectForm, statusCode: Number(e.target.value) })
              }
            >
              <option value={301}>301 Moved Permanently (Passes full SEO link juice)</option>
              <option value={302}>302 Found / Temporary Redirect (Does not pass link equity)</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label" style={{ fontWeight: 600 }}>
              Optional Description / Audit Reason
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Migrated from old WordPress URL structure"
              value={redirectForm.description}
              onChange={(e) => setRedirectForm({ ...redirectForm, description: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="isActiveCheck"
              checked={redirectForm.isActive}
              onChange={(e) => setRedirectForm({ ...redirectForm, isActive: e.target.checked })}
            />
            <label htmlFor="isActiveCheck" style={{ fontSize: '13px', cursor: 'pointer', userSelect: 'none' }}>
              Rule is active and will redirect live traffic immediately
            </label>
          </div>
        </form>
      </Modal>

      {/* CSV Bulk Import Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Bulk Import Redirect Rules from CSV"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsImportModalOpen(false)}>
              Close
            </button>
            <button
              className="btn btn-primary"
              onClick={handleImportCsv}
              disabled={importing || !importFile}
            >
              {importing ? 'Importing...' : 'Upload & Process CSV'}
            </button>
          </>
        }
      >
        <div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Upload a CSV file containing your redirect mappings. Existing identical source paths will be safely skipped.
          </p>

          <div
            style={{
              padding: '12px 16px',
              background: '#F8FAFC',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              marginBottom: '16px',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}
          >
            <strong>Accepted CSV Format Header:</strong>
            <br />
            sourcePath,destinationPath,statusCode,isActive,description
            <br />
            /old-page,/new-page,301,true,Old campaign page
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 600 }}>
              Select CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              className="form-control"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
            />
          </div>

          {importResult && (
            <div
              style={{
                padding: '12px',
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                color: 'var(--success)',
              }}
            >
              <div style={{ fontWeight: 700 }}>{importResult.message}</div>
              {importResult.errors?.length > 0 && (
                <div style={{ marginTop: '6px', color: 'var(--danger)', fontSize: '12px' }}>
                  <strong>Errors during import:</strong>
                  <ul style={{ paddingLeft: '18px', marginTop: '4px' }}>
                    {importResult.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* Media Picker Modal for OG and Twitter card images */}
      <MediaPickerModal
        isOpen={!!mediaPickerTarget}
        onClose={() => setMediaPickerTarget(null)}
        currentUrl={
          mediaPickerTarget === 'og'
            ? seoSettings.defaultOgImage
            : seoSettings.defaultTwitterImage
        }
        onSelect={(url) => {
          if (mediaPickerTarget === 'og') {
            setSeoSettings({ ...seoSettings, defaultOgImage: url });
          } else if (mediaPickerTarget === 'twitter') {
            setSeoSettings({ ...seoSettings, defaultTwitterImage: url });
          }
          setMediaPickerTarget(null);
        }}
      />

      {/* Delete Rule Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteRedirectId}
        onClose={() => setDeleteRedirectId(null)}
        onConfirm={handleDeleteRedirect}
        title="Delete Redirect Rule"
        message="Are you sure you want to delete this redirect rule? Visitors requesting this source URL will no longer be forwarded."
      />
    </div>
  );
}
