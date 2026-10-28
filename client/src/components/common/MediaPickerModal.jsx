import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { api } from '../../lib/api.js';
import { UploadCloud, Check, Film, Image as ImageIcon, FileText } from 'lucide-react';

export function MediaPickerModal({ isOpen, onClose, onSelect, currentUrl = '' }) {
  const [activeTab, setActiveTab] = useState('library'); // 'library' | 'upload' | 'url'
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(currentUrl);
  const [directUrl, setDirectUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const res = await api.get('/media', { type: filterType, limit: 24 });
      if (res.success) {
        setAssets(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load media assets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAssets();
      setSelectedUrl(currentUrl);
    }
  }, [isOpen, filterType]);

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const res = await api.post('/media/upload', formData);
      if (res.success && res.data?.length > 0) {
        const uploaded = res.data[0];
        setSelectedUrl(uploaded.url);
        await fetchAssets();
        setActiveTab('library');
      }
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleConfirm = () => {
    if (activeTab === 'url') {
      onSelect(directUrl);
    } else {
      onSelect(selectedUrl);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select or Upload Media Asset"
      size="lg"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={activeTab === 'url' ? !directUrl : !selectedUrl}
          >
            Insert Media
          </button>
        </>
      }
    >
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === 'library' ? 'active' : ''}`}
          onClick={() => setActiveTab('library')}
        >
          Media Library
        </button>
        <button
          className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          Upload New (Max 35 MB)
        </button>
        <button
          className={`tab-btn ${activeTab === 'url' ? 'active' : ''}`}
          onClick={() => setActiveTab('url')}
        >
          Direct Web Link
        </button>
      </div>

      {activeTab === 'library' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Choose an existing image or video asset:
            </span>
            <select
              className="form-control"
              style={{ width: '130px', padding: '4px 8px', fontSize: '12px' }}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
            </select>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '36px' }}>Loading assets...</div>
          ) : assets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
              No media assets found in library. Switch to "Upload New" to add one.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '12px',
                maxHeight: '340px',
                overflowY: 'auto',
                padding: '4px',
              }}
            >
              {assets.map((asset) => {
                const isSelected = selectedUrl === asset.url;
                return (
                  <div
                    key={asset._id}
                    onClick={() => setSelectedUrl(asset.url)}
                    style={{
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: '#F8FAFC',
                      position: 'relative',
                      aspectRatio: '1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {asset.mediaType === 'image' ? (
                      <img
                        src={asset.url}
                        alt={asset.altText || asset.originalName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : asset.mediaType === 'video' ? (
                      <div style={{ textAlign: 'center', padding: '8px' }}>
                        <Film size={32} color="var(--primary)" />
                        <span style={{ fontSize: '11px', display: 'block', marginTop: '4px' }}>
                          Video
                        </span>
                      </div>
                    ) : (
                      <FileText size={32} color="var(--text-muted)" />
                    )}

                    {isSelected && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          background: 'var(--primary)',
                          color: '#fff',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'upload' && (
        <div style={{ textAlign: 'center', padding: '36px 20px' }}>
          <label
            style={{
              border: '2px dashed var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '40px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              background: '#FAFBFD',
            }}
          >
            <UploadCloud size={44} color="var(--primary)" />
            <span style={{ fontWeight: 600, fontSize: '14px' }}>
              {uploading ? 'Uploading asset to server...' : 'Click or Drag files here to upload'}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Supports Images (JPG, PNG, WebP, SVG) and Videos (MP4, WebM) up to 35 MB
            </span>
            <input
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
              disabled={uploading}
              accept="image/*,video/mp4,video/webm,application/pdf"
            />
          </label>
        </div>
      )}

      {activeTab === 'url' && (
        <div style={{ padding: '16px 0' }}>
          <div className="form-group">
            <label className="form-label">External Image or Video URL</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://images.unsplash.com/... or https://..."
              value={directUrl}
              onChange={(e) => setDirectUrl(e.target.value)}
            />
          </div>
          {directUrl && (
            <div style={{ marginTop: '12px', textAlign: 'center' }}>
              <img
                src={directUrl}
                alt="Preview"
                style={{ maxHeight: '160px', borderRadius: 'var(--radius-sm)', maxWidth: '100%' }}
                onError={(e) => (e.target.style.display = 'none')}
              />
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
