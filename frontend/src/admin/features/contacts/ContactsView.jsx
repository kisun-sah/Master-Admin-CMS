import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Download, Mail, Phone, Calendar, Trash2, Eye } from 'lucide-react';

export function ContactsView() {
  const { addToast } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [status, setStatus] = useState('new');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/contacts', {
        page,
        limit: 10,
        search,
        status: statusFilter,
      });
      if (res.success) {
        setSubmissions(res.data);
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
    fetchSubmissions();
  }, [page, search, statusFilter]);

  const handleOpenDetail = (sub) => {
    setSelectedSubmission(sub);
    setStatus(sub.status || 'new');
    setNotes(sub.notes || '');
  };

  const handleUpdateStatus = async () => {
    if (!selectedSubmission) return;
    try {
      setUpdating(true);
      await api.put(`/contacts/${selectedSubmission._id}`, { status, notes });
      addToast('Inquiry status updated.', 'success');
      setSelectedSubmission(null);
      fetchSubmissions();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await api.delete(`/contacts/${deleteId}`);
      addToast('Submission removed from inbox.', 'success');
      setDeleteId(null);
      fetchSubmissions();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCsv = () => {
    window.open('/api/v1/contacts/export', '_blank');
    addToast('Contact submissions CSV exported.', 'info');
  };

  const columns = [
    {
      header: 'Sender Details',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{row.email}</div>
          {row.phone && (
            <div style={{ fontSize: '11.5px', color: 'var(--text-subtle)' }}>{row.phone}</div>
          )}
        </div>
      ),
    },
    {
      header: 'Subject & Message',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: '13px' }}>{row.subject}</div>
          <span
            style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              maxWidth: '320px',
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {row.message}
          </span>
        </div>
      ),
    },
    {
      header: 'Received Date',
      render: (row) => (
        <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
          {new Date(row.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => handleOpenDetail(row)}
            title="View Details"
          >
            <Eye size={14} /> Review
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => setDeleteId(row._id)}
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <DataTable
        title="Contact Form Inquiries Inbox"
        subtitle="Review visitor submissions, change resolution status, record internal staff notes, and export CSV."
        columns={columns}
        data={submissions}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        filterValue={statusFilter}
        filterOptions={[
          { value: 'all', label: 'All Statuses' },
          { value: 'new', label: 'New / Unread' },
          { value: 'in_progress', label: 'In Progress' },
          { value: 'replied', label: 'Replied' },
          { value: 'spam', label: 'Spam' },
          { value: 'archived', label: 'Archived' },
        ]}
        onFilterChange={setStatusFilter}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        createAction={
          <button className="btn btn-secondary" onClick={handleExportCsv}>
            <Download size={16} /> Export to CSV
          </button>
        }
      />

      {/* Submission Review Modal */}
      {selectedSubmission && (
        <Modal
          isOpen={!!selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          title={`Inquiry from ${selectedSubmission.name}`}
          footer={
            <>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedSubmission(null)}
              >
                Close
              </button>
              <button className="btn btn-primary" onClick={handleUpdateStatus} disabled={updating}>
                {updating ? 'Saving...' : 'Update Status & Notes'}
              </button>
            </>
          }
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                padding: '14px',
                background: '#F8FAFC',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>FROM</div>
                <div style={{ fontWeight: 600 }}>{selectedSubmission.name}</div>
                <div style={{ fontSize: '13px', color: 'var(--primary)' }}>
                  {selectedSubmission.email}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PHONE / SOURCE</div>
                <div style={{ fontSize: '13px' }}>{selectedSubmission.phone || 'None provided'}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Origin: {selectedSubmission.sourcePage}
                </div>
              </div>
            </div>

            <div>
              <label className="form-label">Subject</label>
              <div
                style={{
                  padding: '10px 12px',
                  background: '#FFFFFF',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                {selectedSubmission.subject}
              </div>
            </div>

            <div>
              <label className="form-label">Message Payload</label>
              <div
                style={{
                  padding: '14px',
                  background: '#F8FAFC',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13.5px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {selectedSubmission.message}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Workflow Status</label>
                <select
                  className="form-control"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="new">New (Unread)</option>
                  <option value="in_progress">In Progress</option>
                  <option value="replied">Replied</option>
                  <option value="spam">Flag as Spam</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Internal Staff Notes</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Assigned to John for client demo on Thursday"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message="Are you sure you want to delete this contact submission?"
      />
    </div>
  );
}
