import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { MediaPickerModal } from '../../components/common/MediaPickerModal.jsx';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Plus, Edit, Trash2, BellRing, Eye } from 'lucide-react';

export function PopupsView() {
  const { addToast } = useAuth();
  const [popups, setPopups] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mediaUrl: '',
    ctaText: 'Learn More',
    ctaLink: '',
    frequency: 'once_per_session',
    status: 'inactive',
  });
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  // Live preview modal
  const [previewPopup, setPreviewPopup] = useState(null);

  const fetchPopups = async () => {
    try {
      setLoading(true);
      const res = await api.get('/popups');
      if (res.success) {
        setPopups(res.data);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopups();
  }, []);

  const handleOpenCreate = () => {
    setEditingPopup(null);
    setFormData({
      title: '',
      content: '',
      mediaUrl: '',
      ctaText: 'Learn More',
      ctaLink: '',
      frequency: 'once_per_session',
      status: 'inactive',
    });
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (popup) => {
    setEditingPopup(popup);
    setFormData({
      title: popup.title || '',
      content: popup.content || '',
      mediaUrl: popup.mediaUrl || '',
      ctaText: popup.ctaText || 'Learn More',
      ctaLink: popup.ctaLink || '',
      frequency: popup.frequency || 'once_per_session',
      status: popup.status || 'inactive',
    });
    setIsEditorOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingPopup) {
        await api.put(`/popups/${editingPopup._id}`, formData);
        addToast('Popup updated.', 'success');
      } else {
        await api.post('/popups', formData);
        addToast('Popup created.', 'success');
      }
      setIsEditorOpen(false);
      fetchPopups();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await api.delete(`/popups/${deleteId}`);
      addToast('Popup deleted.', 'success');
      setDeleteId(null);
      fetchPopups();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Popup Title',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BellRing size={16} color="var(--primary)" />
          <span style={{ fontWeight: 600 }}>{row.title}</span>
        </div>
      ),
    },
    {
      header: 'Frequency',
      render: (row) => (
        <span style={{ fontSize: '12.5px', textTransform: 'capitalize' }}>
          {row.frequency.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      header: 'CTA Action',
      render: (row) => (
        <span style={{ fontSize: '13px' }}>
          {row.ctaText} → {row.ctaLink || '/'}
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
            onClick={() => setPreviewPopup(row)}
            title="Preview Popup"
          >
            <Eye size={14} /> Preview
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => handleOpenEdit(row)}
            title="Edit Popup"
          >
            <Edit size={14} /> Edit
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => setDeleteId(row._id)}
            title="Delete Popup"
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
        title="Promotional & Lead Popups"
        subtitle="Manage targeted announcement modals, promotional banners, and frequency cooldowns."
        columns={columns}
        data={popups}
        loading={loading}
        createAction={
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={16} /> Create Popup
          </button>
        }
      />

      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title={editingPopup ? `Edit Popup: ${editingPopup.title}` : 'Create Marketing Popup'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsEditorOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Popup'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Popup Title / Headline</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Exclusive Q4 Strategy Session"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Body Content</label>
            <textarea
              rows={3}
              className="form-control"
              placeholder="Announcement text, offer details, or registration message..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Display Frequency</label>
              <select
                className="form-control"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              >
                <option value="once_per_session">Once per Browser Session</option>
                <option value="once_per_day">Once per Day</option>
                <option value="always">Always Display on Load</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active (Enabled)</option>
                <option value="inactive">Inactive (Disabled)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Banner Image URL</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="https://..."
                value={formData.mediaUrl}
                onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsMediaPickerOpen(true)}
              >
                Browse Media
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Button Label</label>
              <input
                type="text"
                className="form-control"
                value={formData.ctaText}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Link</label>
              <input
                type="text"
                className="form-control"
                placeholder="/contact"
                value={formData.ctaLink}
                onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Live Preview Modal */}
      {previewPopup && (
        <Modal
          isOpen={!!previewPopup}
          onClose={() => setPreviewPopup(null)}
          title={`Live Popup Preview: ${previewPopup.title}`}
          footer={
            <button className="btn btn-secondary" onClick={() => setPreviewPopup(null)}>
              Close Preview
            </button>
          }
        >
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            {previewPopup.mediaUrl && (
              <img
                src={previewPopup.mediaUrl}
                alt=""
                style={{
                  maxHeight: '180px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '16px',
                  maxWidth: '100%',
                }}
              />
            )}
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
              {previewPopup.title}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
              {previewPopup.content}
            </p>
            {previewPopup.ctaText && (
              <a
                href={previewPopup.ctaLink || '#'}
                className="btn btn-primary"
                onClick={(e) => e.preventDefault()}
              >
                {previewPopup.ctaText}
              </a>
            )}
          </div>
        </Modal>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message="Are you sure you want to delete this popup?"
      />

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(url) => setFormData((prev) => ({ ...prev, mediaUrl: url }))}
        currentUrl={formData.mediaUrl}
      />
    </div>
  );
}
