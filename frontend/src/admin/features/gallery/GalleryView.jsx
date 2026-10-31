import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { SEOPanel } from '../../components/common/SEOPanel.jsx';
import { MediaPickerModal } from '../../components/common/MediaPickerModal.jsx';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Images,
  FolderPlus,
  UploadCloud,
  Edit,
  Trash2,
  Calendar,
  Layers,
  Eye,
  Grid,
  List,
  CheckCircle2,
  XCircle,
  Plus,
  Move,
  Tag,
  ArrowUpDown,
} from 'lucide-react';

export function GalleryView() {
  const { addToast } = useAuth();
  const [activeTab, setActiveTab] = useState('albums'); // 'albums' | 'images'

  // ---------------- ALBUMS STATE ----------------
  const [albums, setAlbums] = useState([]);
  const [loadingAlbums, setLoadingAlbums] = useState(true);
  const [albumPage, setAlbumPage] = useState(1);
  const [albumTotalPages, setAlbumTotalPages] = useState(1);
  const [albumTotalItems, setAlbumTotalItems] = useState(0);
  const [albumSearch, setAlbumSearch] = useState('');
  const [albumCategoryFilter, setAlbumCategoryFilter] = useState('all');
  const [albumStatusFilter, setAlbumStatusFilter] = useState('all');

  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [albumFormData, setAlbumFormData] = useState({
    title: '',
    slug: '',
    description: '',
    coverImage: '',
    category: 'Events',
    eventDate: '',
    displayOrder: 0,
    status: 'published',
    seo: { title: '', metaDescription: '', robots: 'index, follow' },
  });
  const [savingAlbum, setSavingAlbum] = useState(false);
  const [deleteAlbumId, setDeleteAlbumId] = useState(null);
  const [deletingAlbum, setDeletingAlbum] = useState(false);
  const [isCoverPickerOpen, setIsCoverPickerOpen] = useState(false);

  // ---------------- IMAGES STATE ----------------
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [imagePage, setImagePage] = useState(1);
  const [imageTotalPages, setImageTotalPages] = useState(1);
  const [imageTotalItems, setImageTotalItems] = useState(0);
  const [imageSearch, setImageSearch] = useState('');
  const [imageAlbumFilter, setImageAlbumFilter] = useState('all');
  const [imageStatusFilter, setImageStatusFilter] = useState('all');
  const [imageCategoryFilter, setImageCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Batch Upload Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedUploadFiles, setSelectedUploadFiles] = useState([]);
  const [uploadTargetAlbum, setUploadTargetAlbum] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Events');
  const [uploading, setUploading] = useState(false);

  // Edit Image Modal
  const [editingImage, setEditingImage] = useState(null);
  const [imageFormData, setImageFormData] = useState({
    title: '',
    altText: '',
    caption: '',
    description: '',
    albumId: '',
    category: 'General',
    displayOrder: 0,
    status: 'published',
  });
  const [savingImage, setSavingImage] = useState(false);
  const [deleteImageId, setDeleteImageId] = useState(null);
  const [deletingImage, setDeletingImage] = useState(false);

  // Add from Media Library
  const [isMediaPickerForImageOpen, setIsMediaPickerForImageOpen] = useState(false);

  // Fetch Albums
  const fetchAlbums = async () => {
    try {
      setLoadingAlbums(true);
      const res = await api.get('/gallery/albums', {
        page: albumPage,
        limit: 10,
        search: albumSearch,
        category: albumCategoryFilter,
        status: albumStatusFilter,
      });
      if (res.success) {
        setAlbums(res.data || []);
        setAlbumTotalPages(res.meta?.totalPages || 1);
        setAlbumTotalItems(res.meta?.total || 0);
      }
    } catch (err) {
      addToast(err.message || 'Failed to load albums', 'error');
    } finally {
      setLoadingAlbums(false);
    }
  };

  // Fetch Images
  const fetchImages = async () => {
    try {
      setLoadingImages(true);
      const res = await api.get('/gallery/images', {
        page: imagePage,
        limit: 24,
        search: imageSearch,
        album: imageAlbumFilter !== 'all' ? imageAlbumFilter : undefined,
        category: imageCategoryFilter !== 'all' ? imageCategoryFilter : undefined,
        status: imageStatusFilter !== 'all' ? imageStatusFilter : undefined,
      });
      if (res.success) {
        setImages(res.data || []);
        setImageTotalPages(res.meta?.totalPages || 1);
        setImageTotalItems(res.meta?.total || 0);
      }
    } catch (err) {
      addToast(err.message || 'Failed to load gallery images', 'error');
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'albums') {
      fetchAlbums();
    } else {
      fetchImages();
    }
  }, [
    activeTab,
    albumPage,
    albumSearch,
    albumCategoryFilter,
    albumStatusFilter,
    imagePage,
    imageSearch,
    imageAlbumFilter,
    imageCategoryFilter,
    imageStatusFilter,
  ]);

  // Handle Album Create/Edit
  const handleOpenCreateAlbum = () => {
    setEditingAlbum(null);
    setAlbumFormData({
      title: '',
      slug: '',
      description: '',
      coverImage: '',
      category: 'Events',
      eventDate: '',
      displayOrder: 0,
      status: 'published',
      seo: { title: '', metaDescription: '', robots: 'index, follow' },
    });
    setIsAlbumModalOpen(true);
  };

  const handleOpenEditAlbum = async (album) => {
    try {
      const res = await api.get(`/gallery/albums/${album._id}`);
      if (res.success && res.data) {
        const a = res.data;
        setEditingAlbum(a);
        setAlbumFormData({
          title: a.title || '',
          slug: a.slug || '',
          description: a.description || '',
          coverImage: a.coverImage || '',
          category: a.category || 'Events',
          eventDate: a.eventDate ? a.eventDate.slice(0, 10) : '',
          displayOrder: a.displayOrder || 0,
          status: a.status || 'published',
          seo: a.seo || { title: '', metaDescription: '', robots: 'index, follow' },
        });
        setIsAlbumModalOpen(true);
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleSaveAlbum = async (e) => {
    e.preventDefault();
    try {
      setSavingAlbum(true);
      if (editingAlbum) {
        await api.put(`/gallery/albums/${editingAlbum._id}`, albumFormData);
        addToast('Album updated successfully', 'success');
      } else {
        await api.post('/gallery/albums', albumFormData);
        addToast('New album created successfully', 'success');
      }
      setIsAlbumModalOpen(false);
      fetchAlbums();
    } catch (err) {
      addToast(err.message || 'Failed to save album', 'error');
    } finally {
      setSavingAlbum(false);
    }
  };

  const handleDeleteAlbumConfirm = async () => {
    if (!deleteAlbumId) return;
    try {
      setDeletingAlbum(true);
      const res = await api.delete(`/gallery/albums/${deleteAlbumId}`);
      addToast(res.data?.message || 'Album deleted', 'success');
      setDeleteAlbumId(null);
      fetchAlbums();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setDeletingAlbum(false);
    }
  };

  // Handle Image Upload
  const handleBatchUpload = async (e) => {
    e.preventDefault();
    if (!selectedUploadFiles || selectedUploadFiles.length === 0) {
      addToast('Please select at least one image file', 'error');
      return;
    }

    try {
      setUploading(true);
      const data = new FormData();
      for (let i = 0; i < selectedUploadFiles.length; i++) {
        data.append('images', selectedUploadFiles[i]);
      }
      if (uploadTargetAlbum) {
        data.append('albumId', uploadTargetAlbum);
      }
      data.append('category', uploadCategory);

      const res = await api.post('/gallery/images/upload', data);
      if (res.success) {
        addToast(`${res.data.length} images uploaded to gallery successfully!`, 'success');
        setIsUploadModalOpen(false);
        setSelectedUploadFiles([]);
        fetchImages();
        fetchAlbums();
      }
    } catch (err) {
      addToast(err.message || 'Image upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Handle Edit Image
  const handleOpenEditImage = (img) => {
    setEditingImage(img);
    setImageFormData({
      title: img.title || '',
      altText: img.altText || '',
      caption: img.caption || '',
      description: img.description || '',
      albumId: img.album?._id || img.album || '',
      category: img.category || 'General',
      displayOrder: img.displayOrder || 0,
      status: img.status || 'published',
    });
  };

  const handleSaveImage = async (e) => {
    e.preventDefault();
    if (!editingImage) return;

    try {
      setSavingImage(true);
      await api.put(`/gallery/images/${editingImage._id}`, imageFormData);
      addToast('Gallery image metadata updated successfully', 'success');
      setEditingImage(null);
      fetchImages();
      fetchAlbums();
    } catch (err) {
      addToast(err.message || 'Failed to update image', 'error');
    } finally {
      setSavingImage(false);
    }
  };

  const handleDeleteImageConfirm = async () => {
    if (!deleteImageId) return;
    try {
      setDeletingImage(true);
      await api.delete(`/gallery/images/${deleteImageId}`);
      addToast('Image deleted from gallery', 'success');
      setDeleteImageId(null);
      fetchImages();
      fetchAlbums();
    } catch (err) {
      addToast(err.message || 'Failed to delete image', 'error');
    } finally {
      setDeletingImage(false);
    }
  };

  // Add from media library
  const handleMediaPickerSelect = async (url) => {
    try {
      await api.post('/gallery/images', {
        imageUrl: url,
        albumId: uploadTargetAlbum || undefined,
        category: uploadCategory || 'General',
      });
      addToast('Image added to gallery from Media Library', 'success');
      setIsMediaPickerForImageOpen(false);
      fetchImages();
      fetchAlbums();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const albumColumns = [
    {
      header: 'Cover',
      accessor: 'coverImage',
      render: (row) =>
        row.coverImage ? (
          <img
            src={row.coverImage}
            alt={row.title}
            style={{
              width: '48px',
              height: '36px',
              objectFit: 'cover',
              borderRadius: 'var(--radius-sm)',
            }}
          />
        ) : (
          <div
            style={{
              width: '48px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--surface-hover)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-subtle)',
            }}
          >
            <Images size={16} />
          </div>
        ),
    },
    {
      header: 'Album Title & Category',
      accessor: 'title',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '14px' }}>
            {row.title}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: 'var(--text-muted)',
              marginTop: '2px',
            }}
          >
            <span>{row.category}</span>
            <span>•</span>
            <span>/{row.slug}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Event Date',
      accessor: 'eventDate',
      render: (row) => (
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          {row.eventDate
            ? new Date(row.eventDate).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : 'Not Specified'}
        </div>
      ),
    },
    {
      header: 'Images',
      accessor: 'imageCount',
      render: (row) => (
        <button
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '12px', padding: '3px 8px' }}
          onClick={() => {
            setImageAlbumFilter(row._id);
            setActiveTab('images');
          }}
          title="Filter and manage images in this album"
        >
          <Images size={13} /> {row.imageCount || 0} Images
        </button>
      ),
    },
    {
      header: 'Order',
      accessor: 'displayOrder',
      render: (row) => <span style={{ fontSize: '13px' }}>{row.displayOrder || 0}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      accessor: '_id',
      render: (row) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className="btn-icon"
            onClick={() => handleOpenEditAlbum(row)}
            title="Edit Album"
          >
            <Edit size={15} />
          </button>
          <button
            className="btn-icon"
            style={{ color: 'var(--danger)' }}
            onClick={() => setDeleteAlbumId(row._id)}
            title="Delete Album"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Tab Switcher */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div
          className="tabs-header"
          style={{
            padding: '12px 20px',
            marginBottom: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`tab-btn ${activeTab === 'albums' ? 'active' : ''}`}
              onClick={() => setActiveTab('albums')}
            >
              <Layers size={15} /> Gallery Albums ({albumTotalItems})
            </button>
            <button
              className={`tab-btn ${activeTab === 'images' ? 'active' : ''}`}
              onClick={() => setActiveTab('images')}
            >
              <Images size={15} /> Gallery Photos & Media ({imageTotalItems})
            </button>
          </div>

          {activeTab === 'images' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  display: 'flex',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                }}
              >
                <button
                  className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
                  style={{
                    background: viewMode === 'grid' ? 'var(--primary-light)' : 'transparent',
                    color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-muted)',
                    borderRadius: 0,
                  }}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <Grid size={16} />
                </button>
                <button
                  className={`btn-icon ${viewMode === 'table' ? 'active' : ''}`}
                  style={{
                    background: viewMode === 'table' ? 'var(--primary-light)' : 'transparent',
                    color: viewMode === 'table' ? 'var(--primary)' : 'var(--text-muted)',
                    borderRadius: 0,
                  }}
                  onClick={() => setViewMode('table')}
                  title="Table View"
                >
                  <List size={16} />
                </button>
              </div>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setIsMediaPickerForImageOpen(true)}
              >
                Add from Media Library
              </button>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setUploadTargetAlbum(imageAlbumFilter !== 'all' ? imageAlbumFilter : '');
                  setIsUploadModalOpen(true);
                }}
              >
                <UploadCloud size={15} /> Upload Images
              </button>
            </div>
          )}

          {activeTab === 'albums' && (
            <button className="btn btn-primary" onClick={handleOpenCreateAlbum}>
              <FolderPlus size={16} /> Create New Album
            </button>
          )}
        </div>
      </div>

      {/* ---------------- TAB 1: ALBUMS ---------------- */}
      {activeTab === 'albums' && (
        <DataTable
          title="Organization Gallery Albums"
          subtitle="Group and publish photo stories, campus events, conferences, and team milestones."
          columns={albumColumns}
          data={albums}
          loading={loadingAlbums}
          search={albumSearch}
          onSearchChange={setAlbumSearch}
          page={albumPage}
          totalPages={albumTotalPages}
          totalItems={albumTotalItems}
          onPageChange={setAlbumPage}
          filterValue={albumStatusFilter}
          onFilterChange={setAlbumStatusFilter}
          filterOptions={[
            { label: 'All Statuses', value: 'all' },
            { label: 'Published Only', value: 'published' },
            { label: 'Drafts Only', value: 'draft' },
          ]}
        />
      )}

      {/* ---------------- TAB 2: IMAGES ---------------- */}
      {activeTab === 'images' && (
        <div>
          {/* Filter Bar */}
          <div
            className="card"
            style={{
              padding: '16px',
              marginBottom: '16px',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Search by photo title, caption, alt text..."
              style={{ maxWidth: '300px' }}
              value={imageSearch}
              onChange={(e) => setImageSearch(e.target.value)}
            />

            <select
              className="form-control"
              style={{ width: 'auto' }}
              value={imageAlbumFilter}
              onChange={(e) => setImageAlbumFilter(e.target.value)}
            >
              <option value="all">All Albums & Standalone</option>
              <option value="standalone">Standalone Photos Only</option>
              {albums.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.title}
                </option>
              ))}
            </select>

            <select
              className="form-control"
              style={{ width: 'auto' }}
              value={imageStatusFilter}
              onChange={(e) => setImageStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div>
              {loadingImages ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading gallery photos...
                </div>
              ) : images.length === 0 ? (
                <div
                  className="card"
                  style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}
                >
                  <Images size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                  <h3 style={{ fontSize: '16px', color: 'var(--text-main)', marginBottom: '4px' }}>
                    No gallery images found
                  </h3>
                  <p style={{ fontSize: '13px', marginBottom: '16px' }}>
                    Upload photos directly or pick existing media assets from the library.
                  </p>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setIsUploadModalOpen(true)}
                  >
                    <UploadCloud size={14} /> Upload First Image
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {images.map((img) => (
                    <div
                      key={img._id}
                      className="card"
                      style={{
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div
                        style={{
                          height: '150px',
                          background: '#0F172A',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={img.imageUrl}
                          alt={img.altText || img.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                          }}
                        >
                          <StatusBadge status={img.status} />
                        </div>
                      </div>

                      <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: '13.5px',
                            color: 'var(--text-main)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                          title={img.title}
                        >
                          {img.title || 'Untitled Image'}
                        </div>

                        {img.caption && (
                          <div
                            style={{
                              fontSize: '12px',
                              color: 'var(--text-muted)',
                              marginTop: '2px',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {img.caption}
                          </div>
                        )}

                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--text-subtle)',
                            marginTop: 'auto',
                            paddingTop: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span>{img.albumTitle || 'Standalone'}</span>
                          <span>Order: {img.displayOrder || 0}</span>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '4px',
                            marginTop: '8px',
                            borderTop: '1px solid var(--border)',
                            paddingTop: '8px',
                          }}
                        >
                          <button
                            className="btn-icon"
                            onClick={() => handleOpenEditImage(img)}
                            title="Edit Image Details"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            className="btn-icon"
                            style={{ color: 'var(--danger)' }}
                            onClick={() => setDeleteImageId(img._id)}
                            title="Delete Image"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="card" style={{ overflow: 'hidden' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Thumbnail</th>
                    <th>Title & Alt Text</th>
                    <th>Album</th>
                    <th>Category</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {images.map((img) => (
                    <tr key={img._id}>
                      <td>
                        <img
                          src={img.imageUrl}
                          alt={img.altText}
                          style={{
                            width: '44px',
                            height: '32px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                          }}
                        />
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '13px' }}>{img.title}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          Alt: {img.altText || 'None'}
                        </div>
                      </td>
                      <td style={{ fontSize: '13px' }}>{img.albumTitle || 'Standalone'}</td>
                      <td style={{ fontSize: '13px' }}>{img.category}</td>
                      <td style={{ fontSize: '13px' }}>{img.displayOrder || 0}</td>
                      <td>
                        <StatusBadge status={img.status} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            className="btn-icon"
                            onClick={() => handleOpenEditImage(img)}
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            className="btn-icon"
                            style={{ color: 'var(--danger)' }}
                            onClick={() => setDeleteImageId(img._id)}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Album Create/Edit Modal */}
      <Modal
        isOpen={isAlbumModalOpen}
        onClose={() => setIsAlbumModalOpen(false)}
        title={editingAlbum ? 'Edit Gallery Album' : 'Create Gallery Album'}
        size="md"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAlbumModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveAlbum} disabled={savingAlbum}>
              {savingAlbum ? 'Saving...' : editingAlbum ? 'Update Album' : 'Create Album'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveAlbum} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Album Title *</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Annual Technology Summit 2026"
              value={albumFormData.title}
              onChange={(e) => {
                const title = e.target.value;
                setAlbumFormData((prev) => ({
                  ...prev,
                  title,
                  slug: prev.slug || title.toLowerCase().replace(/[\s\W-]+/g, '-'),
                }));
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Slug *</label>
            <input
              type="text"
              className="form-control"
              required
              value={albumFormData.slug}
              onChange={(e) => setAlbumFormData({ ...albumFormData, slug: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-control"
                placeholder="Events, Infrastructure, Projects..."
                value={albumFormData.category}
                onChange={(e) => setAlbumFormData({ ...albumFormData, category: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Event Date</label>
              <input
                type="date"
                className="form-control"
                value={albumFormData.eventDate}
                onChange={(e) => setAlbumFormData({ ...albumFormData, eventDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Cover Image URL</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="https://... or select from Media Library"
                value={albumFormData.coverImage}
                onChange={(e) => setAlbumFormData({ ...albumFormData, coverImage: e.target.value })}
              />
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsCoverPickerOpen(true)}
              >
                Browse
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Album Description</label>
            <textarea
              rows={3}
              className="form-control"
              placeholder="Brief overview of the album's context and highlights..."
              value={albumFormData.description}
              onChange={(e) => setAlbumFormData({ ...albumFormData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Display Order</label>
              <input
                type="number"
                className="form-control"
                value={albumFormData.displayOrder}
                onChange={(e) =>
                  setAlbumFormData({
                    ...albumFormData,
                    displayOrder: parseInt(e.target.value, 10) || 0,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={albumFormData.status}
                onChange={(e) => setAlbumFormData({ ...albumFormData, status: e.target.value })}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <SEOPanel
            seo={albumFormData.seo}
            onChange={(seo) => setAlbumFormData({ ...albumFormData, seo })}
            defaultTitle={albumFormData.title}
          />
        </form>
      </Modal>

      {/* Batch Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Images to Gallery"
        size="md"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleBatchUpload}
              disabled={uploading || selectedUploadFiles.length === 0}
            >
              {uploading
                ? 'Uploading...'
                : `Upload ${selectedUploadFiles.length} Image${selectedUploadFiles.length === 1 ? '' : 's'}`}
            </button>
          </>
        }
      >
        <form onSubmit={handleBatchUpload} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Assign to Album (Optional)</label>
            <select
              className="form-control"
              value={uploadTargetAlbum}
              onChange={(e) => setUploadTargetAlbum(e.target.value)}
            >
              <option value="">Standalone Photos (No Album)</option>
              {albums.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.title} ({a.category})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <input
              type="text"
              className="form-control"
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Select Image Files (JPG, PNG, WEBP, GIF up to 35 MB) *</label>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="form-control"
              required
              onChange={(e) => {
                if (e.target.files) {
                  setSelectedUploadFiles(Array.from(e.target.files));
                }
              }}
            />
            {selectedUploadFiles.length > 0 && (
              <span className="form-hint" style={{ color: 'var(--success)' }}>
                {selectedUploadFiles.length} file(s) selected ready for upload.
              </span>
            )}
          </div>
        </form>
      </Modal>

      {/* Edit Image Modal */}
      <Modal
        isOpen={!!editingImage}
        onClose={() => setEditingImage(null)}
        title="Edit Gallery Image"
        size="md"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setEditingImage(null)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveImage} disabled={savingImage}>
              {savingImage ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveImage} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {editingImage && (
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <img
                src={editingImage.imageUrl}
                alt={editingImage.title}
                style={{
                  maxHeight: '160px',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                }}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Image Title</label>
            <input
              type="text"
              className="form-control"
              value={imageFormData.title}
              onChange={(e) => setImageFormData({ ...imageFormData, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Alt Text (Accessibility & SEO)</label>
            <input
              type="text"
              className="form-control"
              value={imageFormData.altText}
              onChange={(e) => setImageFormData({ ...imageFormData, altText: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Caption</label>
            <textarea
              rows={2}
              className="form-control"
              value={imageFormData.caption}
              onChange={(e) => setImageFormData({ ...imageFormData, caption: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Album Assignment</label>
              <select
                className="form-control"
                value={imageFormData.albumId}
                onChange={(e) => setImageFormData({ ...imageFormData, albumId: e.target.value })}
              >
                <option value="">Standalone (No Album)</option>
                {albums.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Display Order</label>
              <input
                type="number"
                className="form-control"
                value={imageFormData.displayOrder}
                onChange={(e) =>
                  setImageFormData({
                    ...imageFormData,
                    displayOrder: parseInt(e.target.value, 10) || 0,
                  })
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-control"
              value={imageFormData.status}
              onChange={(e) => setImageFormData({ ...imageFormData, status: e.target.value })}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Media Picker for Cover Image */}
      <MediaPickerModal
        isOpen={isCoverPickerOpen}
        onClose={() => setIsCoverPickerOpen(false)}
        onSelect={(url) => {
          setAlbumFormData((prev) => ({ ...prev, coverImage: url }));
          setIsCoverPickerOpen(false);
        }}
        currentUrl={albumFormData.coverImage}
      />

      {/* Media Picker to insert existing Media Asset into Gallery */}
      <MediaPickerModal
        isOpen={isMediaPickerForImageOpen}
        onClose={() => setIsMediaPickerForImageOpen(false)}
        onSelect={handleMediaPickerSelect}
      />

      {/* Confirm Delete Album */}
      <ConfirmDialog
        isOpen={!!deleteAlbumId}
        onClose={() => setDeleteAlbumId(null)}
        onConfirm={handleDeleteAlbumConfirm}
        title="Delete Gallery Album"
        message="Are you sure you want to delete this album? Photos within this album will be safely preserved as standalone gallery images."
        confirmText={deletingAlbum ? 'Deleting...' : 'Delete Album'}
        danger
      />

      {/* Confirm Delete Image */}
      <ConfirmDialog
        isOpen={!!deleteImageId}
        onClose={() => setDeleteImageId(null)}
        onConfirm={handleDeleteImageConfirm}
        title="Delete Gallery Image"
        message="Are you sure you want to delete this photo from the gallery?"
        confirmText={deletingImage ? 'Deleting...' : 'Delete Image'}
        danger
      />
    </div>
  );
}

