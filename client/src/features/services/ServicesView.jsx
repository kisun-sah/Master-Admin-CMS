import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { SEOPanel } from '../../components/common/SEOPanel.jsx';
import { MediaPickerModal } from '../../components/common/MediaPickerModal.jsx';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Plus, Edit, Trash2, Star, Briefcase } from 'lucide-react';

export function ServicesView() {
  const { addToast } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    content: '',
    category: 'General',
    icon: '',
    featuredImage: '',
    featured: false,
    order: 0,
    status: 'published',
    ctaLabel: 'Learn More',
    ctaLink: '',
    seo: {},
  });
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/services', {
        page,
        limit: 10,
        search,
        status: statusFilter,
      });
      if (res.success) {
        setServices(res.data);
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
    fetchServices();
  }, [page, search, statusFilter]);

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData({
      title: '',
      slug: '',
      shortDescription: '',
      content: '',
      category: 'General',
      icon: '',
      featuredImage: '',
      featured: false,
      order: 0,
      status: 'published',
      ctaLabel: 'Learn More',
      ctaLink: '',
      seo: { title: '', metaDescription: '', robots: 'index, follow' },
    });
    setIsEditorOpen(true);
  };

  const handleOpenEdit = async (item) => {
    try {
      const res = await api.get(`/services/${item._id}`);
      if (res.success) {
        setEditingService(res.data);
        setFormData({
          title: res.data.title || '',
          slug: res.data.slug || '',
          shortDescription: res.data.shortDescription || '',
          content: res.data.content || '',
          category: res.data.category || 'General',
          icon: res.data.icon || '',
          featuredImage: res.data.featuredImage || '',
          featured: !!res.data.featured,
          order: res.data.order || 0,
          status: res.data.status || 'published',
          ctaLabel: res.data.ctaLabel || 'Learn More',
          ctaLink: res.data.ctaLink || '',
          seo: res.data.seo || {},
        });
        setIsEditorOpen(true);
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleTitleChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug:
        !editingService && (!prev.slug || prev.slug === '')
          ? val
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)+/g, '')
          : prev.slug,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingService) {
        await api.put(`/services/${editingService._id}`, formData);
        addToast('Service updated successfully.', 'success');
      } else {
        await api.post('/services', formData);
        addToast('Service created successfully.', 'success');
      }
      setIsEditorOpen(false);
      fetchServices();
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
      await api.delete(`/services/${deleteId}`);
      addToast('Service deleted successfully.', 'success');
      setDeleteId(null);
      fetchServices();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Service',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              background: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {row.featuredImage ? (
              <img
                src={row.featuredImage}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Briefcase size={18} color="var(--primary)" />
            )}
          </div>
          <div>
            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              {row.title}
              {row.featured && <Star size={13} fill="#EAB308" color="#EAB308" />}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {row.category} • /{row.slug}
            </div>
          </div>
        </div>
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
            title="Edit Service"
          >
            <Edit size={14} /> Edit
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => setDeleteId(row._id)}
            title="Delete Service"
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
        title="Services Management"
        subtitle="Manage business offerings, service category cards, rich descriptions, and SEO."
        columns={columns}
        data={services}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        filterValue={statusFilter}
        filterOptions={[
          { value: 'all', label: 'All Statuses' },
          { value: 'published', label: 'Published' },
          { value: 'draft', label: 'Draft' },
        ]}
        onFilterChange={setStatusFilter}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        createAction={
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={16} /> Add Service
          </button>
        }
      />

      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title={editingService ? `Edit Service: ${editingService.title}` : 'Add New Service'}
        size="lg"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsEditorOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Service'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Service Title</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. Cloud Infrastructure Consulting"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">URL Slug</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Cloud, Consulting"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
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
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Featured Image Thumbnail</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Image URL..."
                value={formData.featuredImage}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
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
            <label className="form-label">Short Summary</label>
            <textarea
              rows={2}
              className="form-control"
              placeholder="Brief description for service cards and summaries..."
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Content</label>
            <textarea
              rows={5}
              className="form-control"
              placeholder="In-depth service specifications, process details, and value proposition..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">CTA Button Label</label>
              <input
                type="text"
                className="form-control"
                value={formData.ctaLabel}
                onChange={(e) => setFormData({ ...formData, ctaLabel: e.target.value })}
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

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13.5px',
              fontWeight: 500,
              margin: '12px 0',
            }}
          >
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            />
            Highlight as Featured Service on Homepage
          </label>

          <SEOPanel
            seo={formData.seo}
            onChange={(seo) => setFormData({ ...formData, seo })}
          />
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message="Are you sure you want to delete this service record?"
      />

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(url) => setFormData((prev) => ({ ...prev, featuredImage: url }))}
        currentUrl={formData.featuredImage}
      />
    </div>
  );
}
