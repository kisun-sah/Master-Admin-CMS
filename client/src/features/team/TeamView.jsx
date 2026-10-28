import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { MediaPickerModal } from '../../components/common/MediaPickerModal.jsx';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Plus, Edit, Trash2, UserCheck } from 'lucide-react';

export function TeamView() {
  const { addToast } = useAuth();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    bio: '',
    portrait: '',
    socialLinks: { linkedin: '', twitter: '', github: '', email: '' },
    order: 0,
    status: 'active',
  });
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await api.get('/team');
      if (res.success) {
        setTeam(res.data);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleOpenCreate = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      designation: '',
      bio: '',
      portrait: '',
      socialLinks: { linkedin: '', twitter: '', github: '', email: '' },
      order: 0,
      status: 'active',
    });
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      designation: member.designation || '',
      bio: member.bio || '',
      portrait: member.portrait || '',
      socialLinks: member.socialLinks || { linkedin: '', twitter: '', github: '', email: '' },
      order: member.order || 0,
      status: member.status || 'active',
    });
    setIsEditorOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingMember) {
        await api.put(`/team/${editingMember._id}`, formData);
        addToast('Team member updated.', 'success');
      } else {
        await api.post('/team', formData);
        addToast('Team member added.', 'success');
      }
      setIsEditorOpen(false);
      fetchTeam();
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
      await api.delete(`/team/${deleteId}`);
      addToast('Team member removed.', 'success');
      setDeleteId(null);
      fetchTeam();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Member',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#F1F5F9',
              overflow: 'hidden',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
            }}
          >
            {row.portrait ? (
              <img
                src={row.portrait}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              row.name.charAt(0)
            )}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{row.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{row.designation}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Bio',
      render: (row) => (
        <span
          style={{
            fontSize: '12.5px',
            color: 'var(--text-muted)',
            maxWidth: '260px',
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {row.bio || '—'}
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
            title="Edit Member"
          >
            <Edit size={14} /> Edit
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => setDeleteId(row._id)}
            title="Delete Member"
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
        title="Leadership & Team Directory"
        subtitle="Manage executive profiles, company staff bios, portraits, and social links."
        columns={columns}
        data={team}
        loading={loading}
        createAction={
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={16} /> Add Member
          </button>
        }
      />

      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title={editingMember ? `Edit Member: ${editingMember.name}` : 'Add Team Member'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsEditorOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Member'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. Sophia Chen"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role / Job Title</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. Head of Product Engineering"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Portrait Photo URL</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="https://..."
                value={formData.portrait}
                onChange={(e) => setFormData({ ...formData, portrait: e.target.value })}
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
            <label className="form-label">Professional Biography</label>
            <textarea
              rows={3}
              className="form-control"
              placeholder="Career highlights, credentials, and achievements..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">LinkedIn URL</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://linkedin.com/in/..."
                value={formData.socialLinks?.linkedin || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                  })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://github.com/..."
                value={formData.socialLinks?.github || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, github: e.target.value },
                  })
                }
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
        message="Are you sure you want to remove this team member?"
      />

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(url) => setFormData((prev) => ({ ...prev, portrait: url }))}
        currentUrl={formData.portrait}
      />
    </div>
  );
}
