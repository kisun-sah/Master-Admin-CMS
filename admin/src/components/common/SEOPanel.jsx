import React from 'react';
import { Globe, Share2, HelpCircle } from 'lucide-react';

export function SEOPanel({ seo = {}, onChange }) {
  const handleChange = (field, value) => {
    onChange({
      ...seo,
      [field]: value,
    });
  };

  const titleLength = (seo.title || '').length;
  const descLength = (seo.metaDescription || '').length;

  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        background: '#FAFBFD',
        marginTop: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <Globe size={18} color="var(--primary)" />
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
          SEO & Social Metadata Engine
        </h3>
      </div>

      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="form-label">SEO Meta Title</label>
          <span
            style={{
              fontSize: '11px',
              color: titleLength > 60 ? 'var(--danger)' : 'var(--text-muted)',
            }}
          >
            {titleLength} / 60 chars recommended
          </span>
        </div>
        <input
          type="text"
          className="form-control"
          placeholder="Title displayed in search engine search results"
          value={seo.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>

      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="form-label">Meta Description</label>
          <span
            style={{
              fontSize: '11px',
              color: descLength > 160 ? 'var(--danger)' : 'var(--text-muted)',
            }}
          >
            {descLength} / 160 chars recommended
          </span>
        </div>
        <textarea
          rows={3}
          className="form-control"
          placeholder="Concise, captivating summary for search bots and social previews"
          value={seo.metaDescription || ''}
          onChange={(e) => handleChange('metaDescription', e.target.value)}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="form-group">
          <label className="form-label">Canonical URL</label>
          <input
            type="text"
            className="form-control"
            placeholder="https://example.com/custom-path"
            value={seo.canonicalUrl || ''}
            onChange={(e) => handleChange('canonicalUrl', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Robots Indexing</label>
          <select
            className="form-control"
            value={seo.robots || 'index, follow'}
            onChange={(e) => handleChange('robots', e.target.value)}
          >
            <option value="index, follow">index, follow (Standard)</option>
            <option value="noindex, follow">noindex, follow (Exclude from search)</option>
            <option value="noindex, nofollow">noindex, nofollow (Strictly private)</option>
          </select>
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Share2 size={14} /> Open Graph Social Image URL
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="https://... (1200x630px recommended)"
          value={seo.ogImage || ''}
          onChange={(e) => handleChange('ogImage', e.target.value)}
        />
      </div>
    </div>
  );
}
