import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { SEOPanel } from '../../components/common/SEOPanel.jsx';
import { MediaPickerModal } from '../../components/common/MediaPickerModal.jsx';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Plus, Edit, Trash2, Globe, Eye, Layers, ExternalLink } from 'lucide-react';

export function PagesView() {
  const { addToast } = useAuth();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Read-only View Modal state
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingPage, setViewingPage] = useState(null);

  // Modal editor state (Edit / Create)
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    featuredImage: '',
    order: 0,
    status: 'draft',
    layout: 'default',
    placement: { showInHeader: false, showInFooter: false, isHomepage: false },
    blocks: [],
    seo: {},
  });
  const [saving, setSaving] = useState(false);

  // Deletion confirm state
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Media picker modal
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await api.get('/pages', {
        page,
        limit: 10,
        search,
        status: statusFilter,
      });
      if (res.success) {
        setPages(res.data);
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
    fetchPages();
  }, [page, search, statusFilter]);

  const handleOpenCreate = () => {
    setEditingPage(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      featuredImage: '',
      order: pages.length + 1,
      status: 'draft',
      layout: 'default',
      placement: { showInHeader: true, showInFooter: true, isHomepage: false },
      blocks: [
        {
          type: 'rich_text',
          title: 'Introduction',
          content: '<p>Write your page content here...</p>',
          order: 0,
        },
      ],
      seo: { title: '', metaDescription: '', robots: 'index, follow' },
    });
    setIsEditorOpen(true);
  };

  const handleOpenView = async (item) => {
    try {
      const res = await api.get(`/pages/${item._id}`);
      if (res.success) {
        setViewingPage(res.data);
        setIsViewOpen(true);
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleOpenEdit = async (item) => {
    try {
      const res = await api.get(`/pages/${item._id}`);
      if (res.success) {
        setEditingPage(res.data);
        setFormData({
          title: res.data.title || '',
          slug: res.data.slug || '',
          excerpt: res.data.excerpt || '',
          featuredImage: res.data.featuredImage || '',
          order: res.data.order ?? 0,
          status: res.data.status || 'draft',
          layout: res.data.layout || 'default',
          placement: res.data.placement || {},
          blocks: res.data.blocks || [],
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
        !editingPage && (!prev.slug || prev.slug === '')
          ? val
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)+/g, '')
          : prev.slug,
    }));
  };

  const handleAddBlock = (type) => {
    const newBlock = {
      type,
      title: type === 'hero' ? 'Hero Headline' : 'Section Heading',
      content: type === 'rich_text' ? '<p>Content description...</p>' : '',
      buttonText: type === 'hero' || type === 'cta' ? 'Get Started' : '',
      buttonLink: type === 'hero' || type === 'cta' ? '/contact' : '',
      order: formData.blocks.length,
    };
    setFormData((prev) => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
  };

  const handleRemoveBlock = (index) => {
    setFormData((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((_, idx) => idx !== index),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingPage) {
        await api.put(`/pages/${editingPage._id}`, formData);
        addToast('Page updated successfully.', 'success');
      } else {
        await api.post('/pages', formData);
        addToast('Page created successfully.', 'success');
      }
      setIsEditorOpen(false);
      fetchPages();
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
      await api.delete(`/pages/${deleteId}`);
      addToast('Page moved to trash.', 'success');
      setDeleteId(null);
      fetchPages();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Title / Route',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{row.title}</div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '12px',
              color: 'var(--text-muted)',
              marginTop: '2px',
            }}
          >
            <span>/{row.slug}</span>
            <a
              href={`/${(row.slug || '').replace(/^\//, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                color: 'var(--primary)',
                opacity: 0.85,
              }}
              title="Open Public Page in New Tab"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      ),
    },
    {
      header: 'Order',
      render: (row) => (
        <span
          className="badge badge-primary"
          style={{ fontWeight: 700, padding: '3px 8px', fontSize: '12px' }}
          title="Navigation Display Order"
        >
          #{row.order ?? 0}
        </span>
      ),
    },
    {
      header: 'Placement',
      render: (row) => (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {row.placement?.isHomepage && <span className="badge badge-info">Home</span>}
          {row.placement?.showInHeader && <span className="badge badge-neutral">Header</span>}
          {row.placement?.showInFooter && <span className="badge badge-neutral">Footer</span>}
          {!row.placement?.isHomepage &&
            !row.placement?.showInHeader &&
            !row.placement?.showInFooter &&
            'Standard'}
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Last Modified',
      render: (row) => (
        <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
          {new Date(row.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => handleOpenView(row)}
            title="View Page Details (Read-Only)"
            style={{ padding: '5px 9px' }}
          >
            <Eye size={13} /> View
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => handleOpenEdit(row)}
            title="Edit Page"
            style={{ padding: '5px 9px' }}
          >
            <Edit size={13} /> Edit
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => setDeleteId(row._id)}
            title="Delete Page"
            style={{ padding: '5px 9px' }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <DataTable
        title="Pages & Content Management"
        subtitle="Manage website pages, block-based sections, layout placement, and SEO."
        columns={columns}
        data={pages}
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
            <Plus size={16} /> Create Page
          </button>
        }
      />

      {/* Page Form Modal */}
      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title={editingPage ? `Edit Page: ${editingPage.title}` : 'Create New Page'}
        size="lg"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsEditorOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Page Changes'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Page Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Solutions Overview"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">URL Slug</label>
              <input
                type="text"
                className="form-control"
                placeholder="solutions-overview"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Short Excerpt / Summary</label>
            <textarea
              rows={2}
              className="form-control"
              placeholder="Brief description of this page..."
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Publication Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="draft">Draft (Private)</option>
                <option value="published">Published (Public)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Layout Template</label>
              <select
                className="form-control"
                value={formData.layout}
                onChange={(e) => setFormData({ ...formData, layout: e.target.value })}
              >
                <option value="default">Default Page Layout</option>
                <option value="landing">Full Landing Page</option>
                <option value="full_width">Full Width Container</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Menu Order (e.g. 1, 2...)</label>
              <input
                type="number"
                min="0"
                className="form-control"
                placeholder="1"
                value={formData.order ?? 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order: parseInt(e.target.value, 10) || 0,
                  })
                }
                title="Pages with lower order numbers appear first in the navbar"
              />
            </div>
          </div>

          {/* Placement Checkboxes */}
          <div
            style={{
              padding: '12px 16px',
              background: '#F8FAFC',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
              Navigation & Placement Settings
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <input
                  type="checkbox"
                  checked={formData.placement?.showInHeader || false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      placement: { ...formData.placement, showInHeader: e.target.checked },
                    })
                  }
                />
                Show in Header
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <input
                  type="checkbox"
                  checked={formData.placement?.showInFooter || false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      placement: { ...formData.placement, showInFooter: e.target.checked },
                    })
                  }
                />
                Show in Footer
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <input
                  type="checkbox"
                  checked={formData.placement?.isHomepage || false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      placement: { ...formData.placement, isHomepage: e.target.checked },
                    })
                  }
                />
                Designate as Homepage
              </label>
            </div>
          </div>

          {/* Featured Image Selector */}
          <div className="form-group">
            <label className="form-label">Featured Image Banner</label>
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

          {/* Block-Based Content Builder */}
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={16} color="var(--primary)" />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Page Section Blocks</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleAddBlock('rich_text')}
                >
                  + Text Block
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleAddBlock('hero')}
                >
                  + Hero CTA
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleAddBlock('features')}
                >
                  + Features Grid
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {formData.blocks.map((block, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '14px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    background: '#FFFFFF',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <span className="badge badge-info" style={{ textTransform: 'uppercase' }}>
                      {block.type}
                    </span>
                    <button
                      type="button"
                      className="btn-icon"
                      style={{ color: 'var(--danger)' }}
                      onClick={() => handleRemoveBlock(idx)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <input
                    type="text"
                    className="form-control"
                    style={{ marginBottom: '8px' }}
                    placeholder="Block Title..."
                    value={block.title}
                    onChange={(e) => {
                      const updated = [...formData.blocks];
                      updated[idx].title = e.target.value;
                      setFormData({ ...formData, blocks: updated });
                    }}
                  />

                  <textarea
                    rows={3}
                    className="form-control"
                    placeholder="Block Content / Markdown / HTML..."
                    value={block.content}
                    onChange={(e) => {
                      const updated = [...formData.blocks];
                      updated[idx].content = e.target.value;
                      setFormData({ ...formData, blocks: updated });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Shared SEO Engine */}
          <SEOPanel
            seo={formData.seo}
            onChange={(seoUpdates) => setFormData({ ...formData, seo: seoUpdates })}
          />
        </form>
      </Modal>

      {/* Read-Only Page View Details Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title={viewingPage ? `Page Overview: ${viewingPage.title}` : 'Page Overview'}
        size="lg"
        footer={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <a
              href={`/${(viewingPage?.slug || '').replace(/^\//, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <ExternalLink size={14} /> Open Published Page
            </a>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsViewOpen(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  const target = viewingPage;
                  setIsViewOpen(false);
                  if (target) handleOpenEdit(target);
                }}
              >
                <Edit size={14} /> Edit This Page
              </button>
            </div>
          </div>
        }
      >
        {viewingPage && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Top Stat Summary Card */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '12px',
                padding: '14px 16px',
                background: 'var(--surface-hover)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    color: 'var(--text-subtle)',
                    fontWeight: 700,
                  }}
                >
                  Publication Status
                </div>
                <div style={{ marginTop: '4px' }}>
                  <StatusBadge status={viewingPage.status} />
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    color: 'var(--text-subtle)',
                    fontWeight: 700,
                  }}
                >
                  Navigation Order
                </div>
                <div
                  style={{
                    marginTop: '4px',
                    fontWeight: 700,
                    fontSize: '14px',
                    color: 'var(--text-main)',
                  }}
                >
                  #{viewingPage.order ?? 0}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    color: 'var(--text-subtle)',
                    fontWeight: 700,
                  }}
                >
                  Layout Template
                </div>
                <div
                  style={{
                    marginTop: '4px',
                    fontWeight: 600,
                    fontSize: '13px',
                    color: 'var(--text-main)',
                    textTransform: 'capitalize',
                  }}
                >
                  {viewingPage.layout || 'Default'}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    color: 'var(--text-subtle)',
                    fontWeight: 700,
                  }}
                >
                  Last Modified
                </div>
                <div
                  style={{
                    marginTop: '4px',
                    fontSize: '12.5px',
                    color: 'var(--text-muted)',
                  }}
                >
                  {new Date(viewingPage.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* General Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                }}
              >
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Title
                  </label>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      marginTop: '2px',
                    }}
                  >
                    {viewingPage.title}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    URL Route Slug
                  </label>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--primary)',
                      marginTop: '2px',
                    }}
                  >
                    /{viewingPage.slug}
                  </div>
                </div>
              </div>

              {viewingPage.excerpt && (
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Excerpt / Summary
                  </label>
                  <div
                    style={{
                      fontSize: '13.5px',
                      color: 'var(--text-main)',
                      marginTop: '2px',
                      lineHeight: 1.5,
                    }}
                  >
                    {viewingPage.excerpt}
                  </div>
                </div>
              )}

              {/* Placement Badges */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Placement & Navigation
                </label>
                <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                  {viewingPage.placement?.isHomepage && (
                    <span className="badge badge-info">Designated Homepage</span>
                  )}
                  {viewingPage.placement?.showInHeader && (
                    <span className="badge badge-neutral">Header Menu</span>
                  )}
                  {viewingPage.placement?.showInFooter && (
                    <span className="badge badge-neutral">Footer Links</span>
                  )}
                  {!viewingPage.placement?.isHomepage &&
                    !viewingPage.placement?.showInHeader &&
                    !viewingPage.placement?.showInFooter && (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Standard (Direct URL only)
                      </span>
                    )}
                </div>
              </div>
            </div>

            {/* Section Blocks Preview */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '8px',
                }}
              >
                <Layers size={16} color="var(--primary)" />
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
                  Content Section Blocks ({viewingPage.blocks?.length || 0})
                </span>
              </div>

              {!viewingPage.blocks || viewingPage.blocks.length === 0 ? (
                <div
                  style={{
                    fontSize: '12.5px',
                    color: 'var(--text-muted)',
                    fontStyle: 'italic',
                    padding: '12px',
                    border: '1px dashed var(--border)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  No content blocks defined for this page yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {viewingPage.blocks.map((b, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 14px',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--surface)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          className="badge badge-info"
                          style={{ textTransform: 'uppercase', fontSize: '10px' }}
                        >
                          {b.type}
                        </span>
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: '13px',
                            color: 'var(--text-main)',
                          }}
                        >
                          {b.title || `Block #${idx + 1}`}
                        </span>
                      </div>
                      {b.content && (
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'var(--text-muted)',
                            maxWidth: '260px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {b.content.replace(/<[^>]*>?/gm, '')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SEO Overview */}
            {viewingPage.seo && (viewingPage.seo.title || viewingPage.seo.metaDescription) && (
              <div
                style={{
                  padding: '12px 14px',
                  background: 'var(--surface-hover)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--text-subtle)',
                    marginBottom: '6px',
                  }}
                >
                  SEO Configuration
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                  {viewingPage.seo.title || viewingPage.title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {viewingPage.seo.metaDescription || 'No custom meta description provided.'}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message="Are you sure you want to delete this page? It will be safely moved to trash and unpublished from public APIs."
      />

      {/* Media Picker */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(url) => setFormData((prev) => ({ ...prev, featuredImage: url }))}
        currentUrl={formData.featuredImage}
      />
    </div>
  );
}
