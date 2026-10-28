import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { MediaPickerModal } from '../../components/common/MediaPickerModal.jsx';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Plus, Edit, Trash2, Star } from 'lucide-react';

export function TestimonialsView() {
  const { addToast } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    clientName: '',
    clientRole: '',
    company: '',
    avatar: '',
    rating: 5,
    quote: '',
    order: 0,
    status: 'published',
    featured: false,
  });
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/testimonials');
      if (res.success) {
        setItems(res.data);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      clientName: '',
      clientRole: '',
      company: '',
      avatar: '',
      rating: 5,
      quote: '',
      order: 0,
      status: 'published',
      featured: false,
    });
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      clientName: item.clientName || '',
      clientRole: item.clientRole || '',
      company: item.company || '',
      avatar: item.avatar || '',
      rating: item.rating || 5,
      quote: item.quote || '',
      order: item.order || 0,
      status: item.status || 'published',
      featured: !!item.featured,
    });
    setIsEditorOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingItem) {
        await api.put(`/testimonials/${editingItem._id}`, formData);
        addToast('Testimonial updated.', 'success');
      } else {
        await api.post('/testimonials', formData);
        addToast('Testimonial created.', 'success');
      }
      setIsEditorOpen(false);
      fetchItems();
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
      await api.delete(`/testimonials/${deleteId}`);
      addToast('Testimonial deleted.', 'success');
      setDeleteId(null);
      fetchItems();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Client / Company',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '12px',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {row.avatar ? (
              <img
                src={row.avatar}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              row.clientName.charAt(0)
            )}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{row.clientName}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {row.clientRole ? `${row.clientRole}, ` : ''}
              {row.company}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Rating',
      render: (row) => (
        <div style={{ display: 'flex', gap: '2px', color: '#EAB308' }}>
          {Array.from({ length: row.rating || 5 }).map((_, i) => (
            <Star key={i} size={14} fill="#EAB308" />
          ))}
        </div>
      ),
    },
    {
      header: 'Quote Snippet',
      render: (row) => (
        <span
          style={{
            fontSize: '13px',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            maxWidth: '300px',
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          "{row.quote}"
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
            onClick={() => handleOpenEdit(row)}
            title="Edit Testimonial"
          >
            <Edit size={14} /> Edit
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => setDeleteId(row._id)}
            title="Delete Testimonial"
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
        title="Customer Testimonials & Reviews"
        subtitle="Manage client endorsements, verified quotes, star ratings, and homepage placement."
        columns={columns}
        data={items}
        loading={loading}
        createAction={
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={16} /> Add Testimonial
          </button>
        }
      />

      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title={editingItem ? `Edit Testimonial: ${editingItem.clientName}` : 'Add Testimonial'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsEditorOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Testimonial'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Client Name</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. Elena Rostova"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Client Role / Position</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Chief Technology Officer"
                value={formData.clientRole}
                onChange={(e) => setFormData({ ...formData, clientRole: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Vanguard Logistics"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rating (Stars)</label>
              <select
                className="form-control"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              >
                <option value={5}>5 Stars ★★★★★</option>
                <option value={4}>4 Stars ★★★★☆</option>
                <option value={3}>3 Stars ★★★☆☆</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="published">Published</option>
                <option value="pending">Pending Review</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Avatar Photo URL</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="https://..."
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
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

          <div className="form-group">
            <label className="form-label">Quote Text</label>
            <textarea
              rows={4}
              className="form-control"
              required
              placeholder="What did the client say about your company or services?"
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
            />
          </div>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13.5px',
              fontWeight: 500,
            }}
          >
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            />
            Feature on Homepage Testimonial Carousel
          </label>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message="Are you sure you want to delete this testimonial?"
      />

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(url) => setFormData((prev) => ({ ...prev, avatar: url }))}
        currentUrl={formData.avatar}
      />
    </div>
  );
}
