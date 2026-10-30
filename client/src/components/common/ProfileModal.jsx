import React, { useState } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../lib/api.js';
import { Shield, Key, User as UserIcon } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle.jsx';

export function ProfileModal({ isOpen, onClose }) {
  const { user, setUser, addToast } = useAuth();
  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'password'

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [updating, setUpdating] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const res = await api.put('/auth/profile', { displayName, avatar });
      if (res.success && res.data?.user) {
        setUser((prev) => ({ ...prev, ...res.data.user }));
        addToast('Profile updated successfully.', 'success');
        onClose();
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 8) {
      addToast('Password must be at least 8 characters.', 'error');
      return;
    }

    try {
      setChangingPass(true);
      const res = await api.put('/auth/password', { currentPassword, newPassword });
      if (res.success) {
        addToast('Password changed successfully.', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Administrator Identity & Account Settings">
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          <UserIcon size={14} style={{ display: 'inline', marginRight: '6px' }} />
          Profile Details
        </button>
        <button
          className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          <Key size={14} style={{ display: 'inline', marginRight: '6px' }} />
          Change Password
        </button>
      </div>

      {activeTab === 'info' && (
        <form onSubmit={handleUpdateProfile}>
          <div className="form-group">
            <label className="form-label">Email Address (Read-only)</label>
            <input
              type="email"
              className="form-control"
              value={user?.email || ''}
              disabled
              style={{ background: 'var(--surface-hover)' }}
            />
            <span className="form-hint">Email can only be modified by Super Administrators.</span>
          </div>

          <div className="form-group">
            <label className="form-label">System Appearance / Theme Mode</label>
            <div style={{ marginTop: '4px' }}>
              <ThemeToggle variant="segmented" showLabels={true} />
            </div>
            <span className="form-hint">Choose between Light Mode, Dark Mode, or System Default.</span>
          </div>

          <div className="form-group">
            <label className="form-label">Assigned Role</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
                <Shield size={12} /> {user?.role || 'editor'}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input
              type="text"
              className="form-control"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Avatar Image URL</label>
            <input
              type="text"
              className="form-control"
              placeholder="https://..."
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={updating}>
              {updating ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      )}

      {activeTab === 'password' && (
        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="form-control"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Password (minimum 8 characters)</label>
            <input
              type="password"
              className="form-control"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              className="form-control"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={changingPass}>
              {changingPass ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
