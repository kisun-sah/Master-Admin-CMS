import React from 'react';
import { Modal } from './Modal.jsx';
import { AlertTriangle } from 'lucide-react';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Destructive Action',
  message = 'Are you sure you want to proceed? This operation may be irreversible.',
  confirmText = 'Delete Permanently',
  loading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Processing...' : confirmText}
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div
          style={{
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            padding: '10px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
          }}
        >
          <AlertTriangle size={24} />
        </div>
        <div>
          <p style={{ fontSize: '14px', color: 'var(--text-main)', marginTop: '4px' }}>
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
}
