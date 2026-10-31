import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Activity, Database, Cpu, CheckCircle, RefreshCw, HardDrive, UploadCloud } from 'lucide-react';

export function SystemView() {
  const { addToast } = useAuth();
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(false);
  const fileInputRef = useRef(null);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      const res = await api.get('/system/health');
      if (res.success) {
        setHealth(res.data);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      addToast('Please select a valid .json backup file.', 'error');
      return;
    }

    try {
      setRestoring(true);
      addToast('Reading and validating backup file...', 'info');
      const text = await file.text();
      const backupData = JSON.parse(text);

      if (!backupData || !backupData.collections) {
        throw new Error('Invalid backup file structure: missing collections object.');
      }

      const res = await api.post('/system/restore', { backupData });
      if (res.success) {
        addToast(res.data.message || 'Database successfully restored!', 'success');
        fetchHealth();
      }
    } catch (err) {
      addToast(err.message || 'Failed to restore database.', 'error');
    } finally {
      setRestoring(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const formatUptime = (seconds) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d > 0 ? d + 'd ' : ''}${h}h ${m}m ${s}s`;
  };

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
            System Health & Infrastructure Telemetry
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Real-time status of MongoDB connection pool, memory allocations, server uptime, and collection records.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <a
            href="http://localhost:5000/api/docs"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-sm"
          >
            OpenAPI Docs Explorer
          </a>
          <a
            href="/api/v1/system/backup"
            download
            className="btn btn-primary btn-sm"
            onClick={() => addToast('Generating full database JSON backup...', 'info')}
          >
            <HardDrive size={14} /> Download Database Backup
          </a>
          
          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          <button
            className="btn btn-outline btn-sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={restoring}
          >
            <UploadCloud size={14} /> {restoring ? 'Restoring...' : 'Restore Backup JSON'}
          </button>

          <button className="btn btn-secondary btn-sm" onClick={fetchHealth} disabled={loading}>
            <RefreshCw size={14} /> Refresh Telemetry
          </button>
        </div>
      </div>


      {loading && !health ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Probing system telemetry and database health...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Status Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  System Status
                </span>
                <CheckCircle size={18} color="var(--success)" />
              </div>
              <div style={{ fontSize: '22px', fontWeight: 700, margin: '8px 0 4px', color: 'var(--success)' }}>
                {health?.status?.toUpperCase()}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Node.js {health?.nodeVersion} • {health?.environment}
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  MongoDB Connection
                </span>
                <Database size={18} color="var(--primary)" />
              </div>
              <div style={{ fontSize: '22px', fontWeight: 700, margin: '8px 0 4px', color: 'var(--primary)' }}>
                {health?.database?.status?.toUpperCase()}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {health?.database?.name} @ {health?.database?.host}
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  API Server Uptime
                </span>
                <Activity size={18} color="var(--info)" />
              </div>
              <div style={{ fontSize: '22px', fontWeight: 700, margin: '8px 0 4px' }}>
                {formatUptime(health?.uptimeSeconds || 0)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Continuous execution without restart
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Memory Allocation (RSS)
                </span>
                <Cpu size={18} color="var(--warning)" />
              </div>
              <div style={{ fontSize: '22px', fontWeight: 700, margin: '8px 0 4px' }}>
                {health?.memory?.rssMb} MB
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Heap Used: {health?.memory?.heapUsedMb} MB / {health?.memory?.heapTotalMb} MB
              </div>
            </div>
          </div>

          {/* Database Collections Breakdown */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HardDrive size={18} color="var(--primary)" />
                MongoDB Collections & Document Cardinality
              </h2>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Collection Name</th>
                      <th>Document Count</th>
                      <th>Operational Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(health?.database?.collections || []).map((col, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600 }}>
                          <code>{col.name}</code>
                        </td>
                        <td>
                          <span className="badge badge-neutral" style={{ fontSize: '12px' }}>
                            {col.documentCount} documents
                          </span>
                        </td>
                        <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                          {col.name === 'users' && 'Administrator credentials & RBAC mapping'}
                          {col.name === 'pages' && 'Web pages and structured layout blocks'}
                          {col.name === 'services' && 'Enterprise capability catalog'}
                          {col.name === 'blogposts' && 'Editorial thoughts and articles'}
                          {col.name === 'mediaassets' && 'Digital media assets metadata'}
                          {col.name === 'auditevents' && 'Immutable audit & security event logs'}
                          {col.name === 'sessions' && 'Active MongoDB-persisted session store'}
                          {col.name === 'contactsubmissions' && 'Visitor inquiries and leads'}
                          {col.name === 'navigationmenus' && 'Header and footer link structures'}
                          {col.name === 'sitesettings' && 'Singleton website configuration and colors'}
                          {col.name === 'roles' && 'RBAC security access levels'}
                          {col.name === 'sliders' && 'Hero carousel and 35MB video banners'}
                          {col.name === 'testimonials' && 'Customer reviews and ratings'}
                          {col.name === 'teammembers' && 'Staff and leadership roster'}
                          {col.name === 'partners' && 'Partner company logos'}
                          {col.name === 'faqs' && 'Frequently asked questions'}
                          {col.name === 'popups' && 'Promotional alert modals'}
                          {col.name === 'redirects' && '301/302 link routing rules'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
