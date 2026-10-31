import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { SEOPanel } from '../../components/common/SEOPanel.jsx';
import { MediaPickerModal } from '../../components/common/MediaPickerModal.jsx';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Plus, Edit, Trash2, Clock, BookOpen } from 'lucide-react';

export function BlogsView() {
  const { addToast } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    featuredImage: '',
    category: 'Insights',
    tags: '',
    status: 'draft',
    seo: {},
  });
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/blogs', {
        page,
        limit: 10,
        search,
        status: statusFilter,
      });
      if (res.success) {
        setPosts(res.data);
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
    fetchPosts();
  }, [page, search, statusFilter]);

  const handleOpenCreate = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      body: '',
      featuredImage: '',
      category: 'Insights',
      tags: 'Tech, Cloud',
      status: 'draft',
      seo: { title: '', metaDescription: '', robots: 'index, follow' },
    });
    setIsEditorOpen(true);
  };

  const handleOpenEdit = async (item) => {
    try {
      const res = await api.get(`/blogs/${item._id}`);
      if (res.success) {
        setEditingPost(res.data);
        setFormData({
          title: res.data.title || '',
          slug: res.data.slug || '',
          excerpt: res.data.excerpt || '',
          body: res.data.body || '',
          featuredImage: res.data.featuredImage || '',
          category: res.data.category || 'Insights',
          tags: Array.isArray(res.data.tags) ? res.data.tags.join(', ') : '',
          status: res.data.status || 'draft',
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
        !editingPost && (!prev.slug || prev.slug === '')
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
      const payload = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (editingPost) {
        await api.put(`/blogs/${editingPost._id}`, payload);
        addToast('Article updated successfully.', 'success');
      } else {
        await api.post('/blogs', payload);
        addToast('Article created successfully.', 'success');
      }
      setIsEditorOpen(false);
      fetchPosts();
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
      await api.delete(`/blogs/${deleteId}`);
      addToast('Article moved to trash.', 'success');
      setDeleteId(null);
      fetchPosts();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Article Title',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              background: '#F1F5F9',
              overflow: 'hidden',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {row.featuredImage ? (
              <img
                src={row.featuredImage}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <BookOpen size={18} color="var(--primary)" />
            )}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{row.title}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {row.category} • /{row.slug}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Author',
      render: (row) => row.authorName || 'Editorial Team',
    },
    {
      header: 'Read Time',
      render: (row) => (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12.5px',
            color: 'var(--text-muted)',
          }}
        >
          <Clock size={13} /> {row.readingTimeMinutes || 3} min
        </span>
      ),
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Date',
      render: (row) => (
        <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
          {new Date(row.publishDate || row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => handleOpenEdit(row)}
            title="Edit Article"
          >
            <Edit size={14} /> Edit
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => setDeleteId(row._id)}
            title="Delete Article"
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
        title="Blog & Articles Publishing"
        subtitle="Write editorial articles, manage tags and taxonomies, schedule publications, and configure SEO."
        columns={columns}
        data={posts}
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
            <Plus size={16} /> Write Article
          </button>
        }
      />

      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title={editingPost ? `Edit Article: ${editingPost.title}` : 'Write New Article'}
        size="lg"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsEditorOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Article'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Article Title</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="Captivating headline..."
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
                placeholder="e.g. Technology, Insights"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tags (comma-separated)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Cloud, DevOps, Architecture"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Featured Header Image</label>
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
            <label className="form-label">Summary / Excerpt</label>
            <textarea
              rows={2}
              className="form-control"
              placeholder="Short teaser shown in blog listings..."
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Article Body</label>
            <textarea
              rows={8}
              className="form-control"
              placeholder="Full article content (supports HTML/markdown paragraphs)..."
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            />
          </div>

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
        message="Are you sure you want to delete this blog post?"
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
