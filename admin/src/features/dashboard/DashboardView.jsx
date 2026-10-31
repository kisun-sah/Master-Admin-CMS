import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  FileText,
  Briefcase,
  BookOpen,
  Inbox,
  Image as ImageIcon,
  Sliders,
  PlusCircle,
  Activity,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  GraduationCap,
  Camera,
} from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';

export function DashboardView({ onNavigate }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard');
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading dashboard telemetry and operational metrics...
      </div>
    );
  }

  const summary = data?.summary || {};
  const recentContent = data?.recentContent || {};
  const recentAudit = data?.recentAuditLogs || [];

  return (
    <div>
      {/* Top Banner Greeting */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)' }}>
            Welcome, {user?.displayName || 'Administrator'}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Live overview of enterprise web content, digital assets, and system activity.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary btn-sm" onClick={fetchDashboard}>
            Refresh Telemetry
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('pages')}>
            <PlusCircle size={15} /> Create Content
          </button>
        </div>
      </div>

      {/* KPI Cards Grid with Comparative Trend Indicators */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '18px',
          marginBottom: '24px',
        }}
      >
        {/* Pages KPI */}
        <div
          className="card"
          style={{ padding: '20px', cursor: 'pointer' }}
          onClick={() => onNavigate('pages')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Total Pages
            </span>
            <div
              style={{
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <FileText size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', margin: '10px 0 6px' }}>
            <div style={{ fontSize: '30px', fontWeight: 700, color: 'var(--text-main)' }}>
              {summary.pages?.total || 0}
            </div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--success)',
                background: 'var(--success-bg)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              +12.5%
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--success)', fontWeight: 600 }}>
              {summary.pages?.published || 0} Published
            </span>
            <span>•</span>
            <span>{summary.pages?.draft || 0} Drafts</span>
          </div>
        </div>

        {/* Services KPI */}
        <div
          className="card"
          style={{ padding: '20px', cursor: 'pointer' }}
          onClick={() => onNavigate('services')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Active Services
            </span>
            <div
              style={{
                background: '#ECFDF5',
                color: 'var(--success)',
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <Briefcase size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', margin: '10px 0 6px' }}>
            <div style={{ fontSize: '30px', fontWeight: 700, color: 'var(--text-main)' }}>
              {summary.services?.active || 0}
            </div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--success)',
                background: 'var(--success-bg)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              +8.3%
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Out of {summary.services?.total || 0} total registered
          </div>
        </div>

        {/* Blogs KPI */}
        <div
          className="card"
          style={{ padding: '20px', cursor: 'pointer' }}
          onClick={() => onNavigate('blogs')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Articles & Blogs
            </span>
            <div
              style={{
                background: '#FEF3C7',
                color: 'var(--warning)',
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <BookOpen size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', margin: '10px 0 6px' }}>
            <div style={{ fontSize: '30px', fontWeight: 700, color: 'var(--text-main)' }}>
              {summary.blogs?.published || 0}
            </div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--success)',
                background: 'var(--success-bg)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              +15.2%
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {summary.blogs?.draft || 0} drafts awaiting review
          </div>
        </div>

        {/* System Health KPI */}
        <div
          className="card"
          style={{ padding: '20px', cursor: 'pointer' }}
          onClick={() => onNavigate('system')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
              System Health & Uptime
            </span>
            <div
              style={{
                background: '#E0F2FE',
                color: 'var(--info)',
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <Activity size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', margin: '10px 0 6px' }}>
            <div style={{ fontSize: '30px', fontWeight: 700, color: 'var(--text-main)' }}>
              99.98%
            </div>
            <span className="badge badge-success" style={{ fontSize: '11px' }}>
              Healthy
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            MongoDB replica pool active (18ms latency)
          </div>
        </div>

        {/* Careers & Applications KPI */}
        <div
          className="card"
          style={{ padding: '20px', cursor: 'pointer' }}
          onClick={() => onNavigate('careers')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Open Careers & Talent
            </span>
            <div
              style={{
                background: '#F3E8FF',
                color: '#9333EA',
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <GraduationCap size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', margin: '10px 0 6px' }}>
            <div style={{ fontSize: '30px', fontWeight: 700, color: 'var(--text-main)' }}>
              {summary.careers?.open || 0}
            </div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--info)',
                background: 'var(--info-bg)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {summary.applications?.total || 0} Applicants
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {summary.careers?.total || 0} total vacancies registered
          </div>
        </div>

        {/* Organization Gallery KPI */}
        <div
          className="card"
          style={{ padding: '20px', cursor: 'pointer' }}
          onClick={() => onNavigate('gallery')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Organization Gallery
            </span>
            <div
              style={{
                background: '#ECFEFF',
                color: '#0891B2',
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <Camera size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', margin: '10px 0 6px' }}>
            <div style={{ fontSize: '30px', fontWeight: 700, color: 'var(--text-main)' }}>
              {summary.gallery?.albums || 0}
            </div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#0891B2',
                background: '#CFFAFE',
                padding: '2px 6px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {summary.gallery?.images || 0} Photos
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Published albums and event galleries
          </div>
        </div>
      </div>

      {/* Analytics Visualizations: Stream Graph & Funnel Bars */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.8fr 1.2fr',
          gap: '24px',
          marginBottom: '24px',
        }}
      >
        {/* Stream Graph */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">System Activity & Content Flow Throughput</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                7-day operational mutation and API request telemetry
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#4F46E5' }} />
                Content Mutations
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#06B6D4' }} />
                API Traffic
              </span>
            </div>
          </div>

          <div className="card-body" style={{ padding: '16px 20px 24px' }}>
            <svg
              viewBox="0 0 600 180"
              style={{ width: '100%', height: '180px', overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="gradPrimary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="gradAccent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.30" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="90" x2="600" y2="90" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="140" x2="600" y2="140" stroke="#F1F5F9" strokeWidth="1" />

              {/* Primary Area & Line */}
              <path
                d="M 0 130 C 80 110, 140 140, 200 80 C 260 20, 320 90, 380 60 C 440 30, 500 70, 600 40 L 600 180 L 0 180 Z"
                fill="url(#gradPrimary)"
              />
              <path
                d="M 0 130 C 80 110, 140 140, 200 80 C 260 20, 320 90, 380 60 C 440 30, 500 70, 600 40"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="2.5"
              />

              {/* Accent Area & Line */}
              <path
                d="M 0 150 C 90 140, 160 160, 220 120 C 290 80, 350 110, 410 90 C 480 70, 530 110, 600 70 L 600 180 L 0 180 Z"
                fill="url(#gradAccent)"
              />
              <path
                d="M 0 150 C 90 140, 160 160, 220 120 C 290 80, 350 110, 410 90 C 480 70, 530 110, 600 70"
                fill="none"
                stroke="#06B6D4"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Points */}
              <circle cx="200" cy="80" r="4" fill="#4F46E5" stroke="#fff" strokeWidth="2" />
              <circle cx="380" cy="60" r="4" fill="#4F46E5" stroke="#fff" strokeWidth="2" />
              <circle cx="600" cy="40" r="4" fill="#4F46E5" stroke="#fff" strokeWidth="2" />
            </svg>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: 'var(--text-subtle)',
                marginTop: '10px',
              }}
            >
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Funnel Bar Chart */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Content Pipeline & Funnel</h2>
            <span className="badge badge-neutral">Pipeline</span>
          </div>
          <div
            className="card-body"
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600 }}>Draft Creations</span>
                <span style={{ color: 'var(--text-muted)' }}>100%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--surface-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: '#4F46E5' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600 }}>Editorial Validation</span>
                <span style={{ color: 'var(--text-muted)' }}>75%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--surface-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '75%', height: '100%', background: '#06B6D4' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600 }}>SEO Metadata Verified</span>
                <span style={{ color: 'var(--text-muted)' }}>50%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--surface-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '50%', height: '100%', background: '#16A34A' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600 }}>Published to Public API</span>
                <span style={{ color: 'var(--text-muted)' }}>35%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--surface-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '35%', height: '100%', background: '#D97706' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Activity & Streams) / Right Column (Quick Actions & Media) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column: Recent Content & Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Recent Content */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Content Modifications</h2>
              <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('pages')}>
                View All Pages
              </button>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Slug</th>
                      <th>Status</th>
                      <th>Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(recentContent.pages || []).map((page) => (
                      <tr key={page._id}>
                        <td style={{ fontWeight: 500 }}>{page.title}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>/{page.slug}</td>
                        <td>
                          <StatusBadge status={page.status} />
                        </td>
                        <td style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                          {new Date(page.updatedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Audit Timeline */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Security & System Audit Feed</h2>
              <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('audit')}>
                Full Audit Trail
              </button>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {recentAudit.slice(0, 5).map((log) => (
                  <div
                    key={log._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: 'var(--surface-hover)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor:
                            log.status === 'failure' ? 'var(--danger)' : 'var(--primary)',
                        }}
                      />
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 600 }}>{log.action}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          by {log.actorEmail} ({log.resourceType})
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '11.5px', color: 'var(--text-subtle)' }}>
                      {new Date(log.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions & Operational Readiness */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Quick Actions Bar */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Quick Action Hub</h2>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                className="btn btn-secondary w-full"
                style={{ justifyContent: 'flex-start' }}
                onClick={() => onNavigate('pages')}
              >
                <PlusCircle size={16} color="var(--primary)" /> Create Landing Page
              </button>
              <button
                className="btn btn-secondary w-full"
                style={{ justifyContent: 'flex-start' }}
                onClick={() => onNavigate('services')}
              >
                <Briefcase size={16} color="var(--success)" /> Add Enterprise Service
              </button>
              <button
                className="btn btn-secondary w-full"
                style={{ justifyContent: 'flex-start' }}
                onClick={() => onNavigate('blogs')}
              >
                <BookOpen size={16} color="var(--warning)" /> Draft Thought Article
              </button>
              <button
                className="btn btn-secondary w-full"
                style={{ justifyContent: 'flex-start' }}
                onClick={() => onNavigate('media')}
              >
                <ImageIcon size={16} color="var(--info)" /> Upload Banner or 35MB Video
              </button>
              <button
                className="btn btn-secondary w-full"
                style={{ justifyContent: 'flex-start' }}
                onClick={() => onNavigate('contacts')}
              >
                <Inbox size={16} color="var(--danger)" /> Review Visitor Inquiries
              </button>
            </div>
          </div>

          {/* Asset Summary */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Media & Growth Health</h2>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Uploaded Media Files</span>
                <span style={{ fontWeight: 600 }}>{summary.media?.total || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Active Hero Sliders</span>
                <span style={{ fontWeight: 600 }}>{summary.sliders?.active || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Customer Testimonials</span>
                <span style={{ fontWeight: 600 }}>{summary.testimonials?.total || 0}</span>
              </div>

              <div
                style={{
                  marginTop: '8px',
                  padding: '12px',
                  background: 'var(--surface-hover)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                }}
              >
                Decoupled API is ready to serve future web clients via <code>/api/v1/public/...</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
