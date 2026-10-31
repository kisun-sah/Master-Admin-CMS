import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { Compass, Plus, Trash2, ArrowUp, ArrowDown, ExternalLink, Save } from 'lucide-react';

export function NavigationView() {
  const { addToast } = useAuth();
  const [activeLocation, setActiveLocation] = useState('header');
  const [menu, setMenu] = useState({ title: '', items: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New item modal
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [itemForm, setItemForm] = useState({
    label: '',
    url: '',
    target: '_self',
  });

  const locations = [
    { key: 'header', label: 'Primary Header Navbar' },
    { key: 'footer_col_1', label: 'Footer Column 1 (Company)' },
    { key: 'footer_col_2', label: 'Footer Column 2 (Services)' },
    { key: 'footer_col_3', label: 'Footer Column 3 (Resources)' },
    { key: 'legal_links', label: 'Footer Legal & Privacy' },
  ];

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/navigation/${activeLocation}`);
      if (res.success && res.data) {
        setMenu(res.data);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [activeLocation]);

  const handleOpenAdd = () => {
    setEditingItemIndex(null);
    setItemForm({ label: '', url: '/', target: '_self' });
    setIsItemModalOpen(true);
  };

  const handleOpenEdit = (idx) => {
    setEditingItemIndex(idx);
    setItemForm(menu.items[idx]);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!itemForm.label || !itemForm.url) return;

    if (editingItemIndex !== null) {
      const updated = [...menu.items];
      updated[editingItemIndex] = { ...itemForm, order: editingItemIndex };
      setMenu({ ...menu, items: updated });
    } else {
      setMenu({
        ...menu,
        items: [...menu.items, { ...itemForm, order: menu.items.length }],
      });
    }

    setIsItemModalOpen(false);
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= menu.items.length) return;

    const items = [...menu.items];
    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;

    // re-index order
    items.forEach((item, idx) => {
      item.order = idx;
    });

    setMenu({ ...menu, items });
  };

  const handleRemoveItem = (index) => {
    const items = menu.items.filter((_, idx) => idx !== index);
    items.forEach((item, idx) => {
      item.order = idx;
    });
    setMenu({ ...menu, items });
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      const res = await api.put(`/navigation/${activeLocation}`, menu);
      if (res.success) {
        addToast('Navigation menu updated successfully.', 'success');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
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
            Navigation Menus & Placement
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Configure primary navbar links, footer columns, reordering, and external destinations.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleSaveAll} disabled={saving}>
          <Save size={16} /> {saving ? 'Saving...' : 'Save Navigation Menu'}
        </button>
      </div>

      <div className="card">
        <div className="tabs-header" style={{ padding: '0 20px', marginBottom: 0 }}>
          {locations.map((loc) => (
            <button
              key={loc.key}
              className={`tab-btn ${activeLocation === loc.key ? 'active' : ''}`}
              onClick={() => setActiveLocation(loc.key)}
            >
              {loc.label}
            </button>
          ))}
        </div>

        <div className="card-body">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '15px' }}>
              {menu.title || 'Navigation Items'}
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handleOpenAdd}>
              <Plus size={14} /> Add Menu Link
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '36px' }}>Loading menu items...</div>
          ) : menu.items.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px',
                border: '1px dashed var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-muted)',
              }}
            >
              No links defined in this menu yet. Click 'Add Menu Link' to create one.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {menu.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: '#F8FAFC',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#E2E8F0',
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                      }}
                    >
                      {idx + 1}
                    </div>

                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.label}</div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <code>{item.url}</code>
                        {item.target === '_blank' && (
                          <span className="badge badge-info" style={{ fontSize: '10px' }}>
                            New Window <ExternalLink size={10} />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      className="btn-icon"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, -1)}
                      title="Move Up"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      type="button"
                      className="btn-icon"
                      disabled={idx === menu.items.length - 1}
                      onClick={() => handleMove(idx, 1)}
                      title="Move Down"
                    >
                      <ArrowDown size={16} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleOpenEdit(idx)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleRemoveItem(idx)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Item Modal */}
      <Modal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        title={editingItemIndex !== null ? 'Edit Menu Link' : 'Add Menu Link'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsItemModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveItem}>
              {editingItemIndex !== null ? 'Update Link' : 'Insert Link'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveItem}>
          <div className="form-group">
            <label className="form-label">Menu Item Label</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Services, About Us"
              value={itemForm.label}
              onChange={(e) => setItemForm({ ...itemForm, label: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Destination URL / Route</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="/services or https://..."
              value={itemForm.url}
              onChange={(e) => setItemForm({ ...itemForm, url: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Window</label>
            <select
              className="form-control"
              value={itemForm.target}
              onChange={(e) => setItemForm({ ...itemForm, target: e.target.value })}
            >
              <option value="_self">Same Tab (_self)</option>
              <option value="_blank">New Browser Tab (_blank)</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}
