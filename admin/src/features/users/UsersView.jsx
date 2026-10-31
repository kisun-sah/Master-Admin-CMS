import React, { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Plus, Edit, Trash2, Shield, Key, Check } from 'lucide-react';

export function UsersView() {
  const { user: currentUser, addToast } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // User modal
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    password: '',
    role: 'editor',
    status: 'active',
  });
  const [saving, setSaving] = useState(false);

  // Deletion confirm
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Active tab: Users Directory vs Roles & Permissions Matrix
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'roles'

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [uRes, rRes] = await Promise.all([api.get('/users'), api.get('/users/roles/list')]);
      if (uRes.success) setUsers(uRes.data);
      if (rRes.success) setRoles(rRes.data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({
      email: '',
      displayName: '',
      password: '',
      role: 'editor',
      status: 'active',
    });
    setIsUserModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      displayName: user.displayName,
      password: '',
      role: user.role,
      status: user.status,
    });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingUser) {
        await api.put(`/users/${editingUser._id}`, formData);
        addToast('User account updated.', 'success');
      } else {
        await api.post('/users', formData);
        addToast('New administrator created.', 'success');
      }
      setIsUserModalOpen(false);
      fetchUsers();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await api.delete(`/users/${deleteTarget._id}`);
      addToast('User deleted successfully.', 'success');
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Administrator Name',
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
              fontWeight: 700,
              fontSize: '12.5px',
            }}
          >
            {row.displayName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>
              {row.displayName}
              {row._id === currentUser?._id && (
                <span className="badge badge-info" style={{ marginLeft: '6px', fontSize: '10px' }}>
                  You
                </span>
              )}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Role',
      render: (row) => (
        <span
          className="badge badge-info"
          style={{ textTransform: 'capitalize', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          <Shield size={12} /> {row.role}
        </span>
      ),
    },
    {
      header: 'Account Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Last Active Session',
      render: (row) => (
        <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
          {row.lastLoginAt ? new Date(row.lastLoginAt).toLocaleString() : 'Never logged in'}
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
            title="Edit User"
          >
            <Edit size={14} /> Edit
          </button>
          {row._id !== currentUser?._id && (
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => setDeleteTarget(row)}
              title="Delete User"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ),
    },
  ];

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
            User Governance & Role Permissions
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Manage staff accounts, assign granular security roles, and enforce least-privilege boundaries.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={16} /> Create User Account
        </button>
      </div>

      <div className="card">
        <div className="tabs-header" style={{ padding: '0 20px', marginBottom: 0 }}>
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Directory ({users.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'roles' ? 'active' : ''}`}
            onClick={() => setActiveTab('roles')}
          >
            RBAC Roles & Permission Keys
          </button>
        </div>

        <div className="card-body">
          {activeTab === 'users' ? (
            <DataTable columns={columns} data={users} loading={loading} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {roles.map((role) => (
                <div
                  key={role._id}
                  style={{
                    padding: '16px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    background: '#F8FAFC',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '15px' }}>{role.name}</span>
                      <code style={{ marginLeft: '8px', fontSize: '12px' }}>key: {role.key}</code>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {role.description}
                      </p>
                    </div>

                    {role.isSystem && (
                      <span className="badge badge-neutral">System Protected Role</span>
                    )}
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-subtle)', marginBottom: '6px' }}>
                      ASSIGNED PERMISSIONS:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {role.permissions.map((p, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '2px 8px',
                            background: '#FFFFFF',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '11.5px',
                            fontFamily: 'monospace',
                          }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Create/Edit Modal */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title={editingUser ? `Edit Account: ${editingUser.displayName}` : 'Create New User Account'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsUserModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveUser} disabled={saving}>
              {saving ? 'Saving...' : 'Save User Account'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveUser}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              required
              disabled={!!editingUser}
              style={{ background: editingUser ? '#F1F5F9' : '#FFFFFF' }}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Sarah Connor"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">RBAC Security Role</label>
              <select
                className="form-control"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="superadmin">Super Administrator (Unrestricted)</option>
                <option value="admin">Administrator</option>
                <option value="editor">Content Editor</option>
                <option value="viewer">Viewer (Read-only)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Account Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active (Access Allowed)</option>
                <option value="inactive">Suspended (Access Blocked)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              {editingUser ? 'Reset Password (leave empty to keep current)' : 'Account Password'}
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••••••"
              required={!editingUser}
              minLength={8}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteUser}
        loading={deleting}
        message={`Are you sure you want to permanently delete the administrator account '${deleteTarget?.email}'?`}
      />
    </div>
  );
}
