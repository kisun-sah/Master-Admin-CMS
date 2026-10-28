import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import {
  UploadCloud,
  Search,
  Grid,
  List,
  Film,
  FileText,
  Trash2,
  ExternalLink,
  Copy,
  Info,
} from 'lucide-react';

export function MediaView() {
  const { addToast } = useAuth();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Uploading state
  const [uploading, setUploading] = useState(false);

  // Detail / edit modal
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [updating, setUpdating] = useState(false);

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await api.get('/media', {
        page,
        limit: 20,
        search,
        type: typeFilter,
      });
      if (res.success) {
        setAssets(res.data);
        setTotalPages(res.meta?.totalPages || 1);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [page, search, typeFilter]);

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check size client-side (Max 35 MB)
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 35 * 1024 * 1024) {
        addToast(`File '${files[i].name}' exceeds the 35 MB limit.`, 'error');
        return;
      }
    }

    try {
      setUploading(true);
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const res = await api.post('/media/upload', formData);
      if (res.success) {
        addToast(`Uploaded ${res.data?.length || 1} asset(s) successfully.`, 'success');
        fetchMedia();
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleOpenDetail = (asset) => {
    setSelectedAsset(asset);
    setAltText(asset.altText || '');
    setCaption(asset.caption || '');
  };

  const handleSaveMetadata = async () => {
    if (!selectedAsset) return;
    try {
      setUpdating(true);
      await api.put(`/media/${selectedAsset._id}`, { altText, caption });
      addToast('Media metadata updated.', 'success');
      setSelectedAsset(null);
      fetchMedia();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await api.delete(`/media/${deleteTarget._id}`);
      addToast('Asset removed from library.', 'success');
      setDeleteTarget(null);
      if (selectedAsset?._id === deleteTarget._id) {
        setSelectedAsset(null);
      }
      fetchMedia();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(window.location.origin + url);
    addToast('URL copied to clipboard!', 'info');
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      {/* Header Bar */}
      <div
        className="card"
        style={{
          padding: '20px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)' }}>
            Digital Media Library
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Securely store, organize, and inspect images and videos (up to 35 MB).
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
            <UploadCloud size={16} />
            <span>{uploading ? 'Uploading...' : 'Upload Media'}</span>
            <input
              type="file"
              multiple
              disabled={uploading}
              style={{ display: 'none' }}
              onChange={handleFileUpload}
              accept="image/*,video/mp4,video/webm,application/pdf"
            />
          </label>
        </div>
      </div>

      {/* Filter and View Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '240px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-subtle)',
              }}
            />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '32px', fontSize: '13px' }}
              placeholder="Search files or alt text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="form-control"
            style={{ width: '140px', fontSize: '13px' }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All File Types</option>
            <option value="image">Images Only</option>
            <option value="video">Videos Only (≤35MB)</option>
            <option value="document">PDF Documents</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '4px', background: '#FFFFFF', padding: '4px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
          <button
            className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
            style={{ background: viewMode === 'grid' ? 'var(--surface-hover)' : 'transparent' }}
          >
            <Grid size={16} />
          </button>
          <button
            className={`btn-icon ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List View"
            style={{ background: viewMode === 'list' ? 'var(--surface-hover)' : 'transparent' }}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Media Content Grid / List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Loading digital media assets...
        </div>
      ) : assets.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <UploadCloud size={40} color="var(--text-subtle)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>No Media Assets Found</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Click 'Upload Media' above to upload images or videos up to 35 MB.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '16px',
          }}
        >
          {assets.map((asset) => (
            <div
              key={asset._id}
              className="card"
              style={{
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onClick={() => handleOpenDetail(asset)}
            >
              <div
                style={{
                  height: '140px',
                  background: '#F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {asset.mediaType === 'image' ? (
                  <img
                    src={asset.url}
                    alt={asset.altText || asset.originalName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : asset.mediaType === 'video' ? (
                  <div style={{ textAlign: 'center' }}>
                    <Film size={36} color="var(--primary)" />
                    <span className="badge badge-info" style={{ marginTop: '6px' }}>
                      Video
                    </span>
                  </div>
                ) : (
                  <FileText size={36} color="var(--text-muted)" />
                )}
              </div>

              <div style={{ padding: '10px 12px' }}>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={asset.originalName}
                >
                  {asset.originalName}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '4px',
                  }}
                >
                  <span>{formatBytes(asset.size)}</span>
                  <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>File Name</th>
                  <th>MIME Type</th>
                  <th>File Size</th>
                  <th>Alt Text</th>
                  <th>Uploaded Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset._id}>
                    <td style={{ width: '60px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: 'var(--radius-sm)',
                          overflow: 'hidden',
                          background: '#F1F5F9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {asset.mediaType === 'image' ? (
                          <img
                            src={asset.url}
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : asset.mediaType === 'video' ? (
                          <Film size={18} color="var(--primary)" />
                        ) : (
                          <FileText size={18} />
                        )}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{asset.originalName}</td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{asset.mimeType}</td>
                    <td style={{ fontSize: '12px' }}>{formatBytes(asset.size)}</td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {asset.altText || '—'}
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {new Date(asset.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenDetail(asset)}
                        >
                          Details
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => setDeleteTarget(asset)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Asset Detail & Metadata Modal */}
      {selectedAsset && (
        <Modal
          isOpen={!!selectedAsset}
          onClose={() => setSelectedAsset(null)}
          title="Media Asset Details & SEO Alt Text"
          size="lg"
          footer={
            <>
              <button
                className="btn btn-outline-danger"
                onClick={() => setDeleteTarget(selectedAsset)}
              >
                Delete File
              </button>
              <button className="btn btn-secondary" onClick={() => setSelectedAsset(null)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={handleSaveMetadata} disabled={updating}>
                {updating ? 'Saving...' : 'Save Metadata'}
              </button>
            </>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
            <div
              style={{
                background: '#F8FAFC',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '260px',
                border: '1px solid var(--border)',
              }}
            >
              {selectedAsset.mediaType === 'image' ? (
                <img
                  src={selectedAsset.url}
                  alt={selectedAsset.altText || ''}
                  style={{ maxWidth: '100%', maxHeight: '360px', objectFit: 'contain' }}
                />
              ) : selectedAsset.mediaType === 'video' ? (
                <video
                  src={selectedAsset.url}
                  controls
                  style={{ width: '100%', maxHeight: '360px' }}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '24px' }}>
                  <FileText size={48} color="var(--text-muted)" />
                  <p style={{ marginTop: '8px', fontSize: '13px' }}>PDF Document</p>
                </div>
              )}
            </div>

            <div>
              <div style={{ marginBottom: '14px' }}>
                <label className="form-label">Asset URL</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    className="form-control"
                    style={{ fontSize: '12px' }}
                    readOnly
                    value={selectedAsset.url}
                  />
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => copyUrl(selectedAsset.url)}
                    title="Copy URL"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Accessible Alt Text (for SEO & Screen Readers)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Descriptive explanation of the visual asset"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Caption / Internal Notes</label>
                <textarea
                  rows={2}
                  className="form-control"
                  placeholder="Optional caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>

              <div
                style={{
                  background: '#F8FAFC',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div>Original Name: <strong>{selectedAsset.originalName}</strong></div>
                <div>MIME Type: <strong>{selectedAsset.mimeType}</strong></div>
                <div>File Size: <strong>{formatBytes(selectedAsset.size)}</strong></div>
                <div>Uploaded: <strong>{new Date(selectedAsset.createdAt).toLocaleString()}</strong></div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Are you sure you want to delete '${deleteTarget?.originalName}'? If this asset is referenced by active pages or sliders, you can force delete it.`}
      />
    </div>
  );
}
