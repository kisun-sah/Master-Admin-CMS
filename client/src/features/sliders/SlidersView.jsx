import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { MediaPickerModal } from '../../components/common/MediaPickerModal.jsx';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Plus, Edit, Trash2, Film, Image as ImageIcon } from 'lucide-react';

export function SlidersView() {
  const { addToast } = useAuth();
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    mediaType: 'image',
    mediaUrl: '',
    ctaText: 'Discover More',
    ctaLink: '',
    order: 0,
    status: 'active',
  });
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/sliders', { status: statusFilter });
      if (res.success) {
        setSliders(res.data);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, [statusFilter]);

  const handleOpenCreate = () => {
    setEditingSlider(null);
    setFormData({
      title: '',
      subtitle: '',
      mediaType: 'image',
      mediaUrl: '',
      ctaText: 'Discover More',
      ctaLink: '',
      order: 0,
      status: 'active',
    });
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (slider) => {
    setEditingSlider(slider);
    setFormData({
      title: slider.title || '',
      subtitle: slider.subtitle || '',
      mediaType: slider.mediaType || 'image',
      mediaUrl: slider.mediaUrl || '',
      ctaText: slider.ctaText || 'Discover More',
      ctaLink: slider.ctaLink || '',
      order: slider.order || 0,
      status: slider.status || 'active',
    });
    setIsEditorOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingSlider) {
        await api.put(`/sliders/${editingSlider._id}`, formData);
        addToast('Slider banner updated.', 'success');
      } else {
        await api.post('/sliders', formData);
        addToast('Slider banner created.', 'success');
      }
      setIsEditorOpen(false);
      fetchSliders();
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
      await api.delete(`/sliders/${deleteId}`);
      addToast('Slider deleted.', 'success');
      setDeleteId(null);
      fetchSliders();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Banner Preview',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '80px',
              height: '48px',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              background: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {row.mediaType === 'video' ? (
              <Film size={20} color="#FFFFFF" />
            ) : row.mediaUrl ? (
              <img
                src={row.mediaUrl}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <ImageIcon size={20} color="var(--text-muted)" />
            )}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{row.title}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {row.subtitle || 'No subtitle'}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Type',
      render: (row) => (
        <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
          {row.mediaType}
        </span>
      ),
    },
    {
      header: 'CTA Destination',
      render: (row) => (
        <span style={{ fontSize: '13px' }}>
          {row.ctaText} → <code style={{ color: 'var(--primary)' }}>{row.ctaLink || '/'}</code>
        </span>
      ),
    },
    {
      header: 'Order',
      accessor: 'order',
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
            onClick={() => handleOpenEdit(row)}
            title="Edit Slider"
          >
            <Edit size={14} /> Edit
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => setDeleteId(row._id)}
            title="Delete Slider"
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
        title="Sliders & Dynamic Banners"
        subtitle="Manage hero carousel slides, promotional banners, and short background videos (up to 35 MB)."
        columns={columns}
        data={sliders}
        loading={loading}
        filterValue={statusFilter}
        filterOptions={[
          { value: 'all', label: 'All Statuses' },
          { value: 'active', label: 'Active Only' },
          { value: 'inactive', label: 'Inactive' },
        ]}
        onFilterChange={setStatusFilter}
        createAction={
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={16} /> Add Slider Banner
          </button>
        }
      />

      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title={editingSlider ? `Edit Slider: ${editingSlider.title}` : 'Add Slider Banner'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsEditorOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Slider'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Banner Title</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Next-Generation Cloud Systems"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Subtitle / Teaser Text</label>
            <input
              type="text"
              className="form-control"
              placeholder="Brief tagline for the slide"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Media Type</label>
              <select
                className="form-control"
                value={formData.mediaType}
                onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })}
              >
                <option value="image">Image Asset</option>
                <option value="video">Short Video (≤ 35 MB)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Display Order</label>
              <input
                type="number"
                className="form-control"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active (Visible)</option>
                <option value="inactive">Inactive (Hidden)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Media URL (Image or MP4/WebM Video)</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-control"
                required
                placeholder="https://... or /uploads/..."
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
              <label className="form-label">CTA Button Label</label>
              <input
                type="text"
                className="form-control"
                value={formData.ctaText}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">CTA Target Link</label>
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

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message="Are you sure you want to delete this slider entry?"
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
