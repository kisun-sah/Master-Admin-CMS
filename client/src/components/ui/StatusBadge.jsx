import React from 'react';

export function StatusBadge({ status }) {
  const normalized = (status || '').toLowerCase().replace(/-/g, '_');

  let badgeClass = 'badge-neutral';
  let label = (status || 'Unknown').replace(/_/g, ' ');

  if (['published', 'active', 'success', 'selected'].includes(normalized)) {
    badgeClass = 'badge-success';
  } else if (['draft', 'pending', 'in_progress', 'shortlisted', 'interview'].includes(normalized)) {
    badgeClass = 'badge-warning';
  } else if (['inactive', 'archived', 'spam', 'danger', 'suspended', 'rejected'].includes(normalized)) {
    badgeClass = 'badge-danger';
  } else if (['new', 'under_review', 'info'].includes(normalized)) {
    badgeClass = 'badge-info';
  } else if (['closed', 'withdrawn'].includes(normalized)) {
    badgeClass = 'badge-neutral';
  }

  // Format capitalized words
  const formattedLabel = label
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

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
      {formattedLabel}
    </span>
  );
}
