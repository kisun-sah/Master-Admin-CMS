import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { History, Eye, ShieldCheck, AlertCircle } from 'lucide-react';

export function AuditView() {
  const { addToast } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/audit', { page, limit: 15 });
      if (res.success) {
        setLogs(res.data);
        setTotalPages(res.meta?.totalPages || 1);
        setTotalItems(res.meta?.total || 0);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const columns = [
    {
      header: 'Timestamp',
      render: (row) => (
        <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
          {new Date(row.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' })}
        </span>
      ),
    },
    {
      header: 'Actor',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.actorName}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{row.actorEmail}</div>
        </div>
      ),
    },
    {
      header: 'Action Key',
      render: (row) => (
        <code style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '13px' }}>
          {row.action}
        </code>
      ),
    },
    {
      header: 'Target Resource',
      render: (row) => (
        <span style={{ fontSize: '13px' }}>
          {row.resourceType} {row.resourceId ? `(${row.resourceId.slice(-6)})` : ''}
        </span>
      ),
    },
    {
      header: 'Outcome',
      render: (row) => (
        <span
          className={`badge ${row.status === 'failure' ? 'badge-danger' : 'badge-success'}`}
        >
          {row.status.toUpperCase()}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setSelectedLog(row)}
          title="Inspect Audit Metadata"
        >
          <Eye size={14} /> Payload
        </button>
      ),
    },
  ];

  return (
    <div>
      <DataTable
        title="Security & System Audit Log"
        subtitle="Append-only immutable record of administrative actions, authentication attempts, and system mutations."
        columns={columns}
        data={logs}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      {/* Audit Detail Modal */}
      {selectedLog && (
        <Modal
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title={`Audit Event: ${selectedLog.action}`}
          footer={
            <button className="btn btn-secondary" onClick={() => setSelectedLog(null)}>
              Close
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                padding: '14px',
                background: '#F8FAFC',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                fontSize: '13px',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11.5px' }}>ACTOR</span>
                <div>
                  <strong>{selectedLog.actorName}</strong> ({selectedLog.actorEmail})
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11.5px' }}>NETWORK IP</span>
                <div>{selectedLog.ipAddress || '127.0.0.1'}</div>
              </div>
            </div>

            <div>
              <span className="form-label">Client User-Agent</span>
              <div
                style={{
                  padding: '8px 12px',
                  background: '#F8FAFC',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border)',
                }}
              >
                {selectedLog.userAgent || 'Direct API Execution'}
              </div>
            </div>

            <div>
              <span className="form-label">Safe Audit Event Payload</span>
              <pre
                style={{
                  background: '#0F172A',
                  color: '#F8FAFC',
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12.5px',
                  overflowX: 'auto',
                }}
              >
                {JSON.stringify(selectedLog.details, null, 2)}
              </pre>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
