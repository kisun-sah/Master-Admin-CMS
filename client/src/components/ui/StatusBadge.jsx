import React from 'react';

export function StatusBadge({ status }) {
  const normalized = (status || '').toLowerCase();

  let badgeClass = 'badge-neutral';
  let label = status || 'Unknown';

  if (['published', 'active', 'success'].includes(normalized)) {
    badgeClass = 'badge-success';
  } else if (['draft', 'pending', 'in_progress'].includes(normalized)) {
    badgeClass = 'badge-warning';
  } else if (['inactive', 'archived', 'spam', 'danger', 'suspended'].includes(normalized)) {
    badgeClass = 'badge-danger';
  } else if (['new', 'info'].includes(normalized)) {
    badgeClass = 'badge-info';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'currentColor',
        }}
      />
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </span>
  );
}
