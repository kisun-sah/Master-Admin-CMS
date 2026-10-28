import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { MediaPickerModal } from '../../components/common/MediaPickerModal.jsx';
import { Globe, Palette, Mail, Share2, Shield, Save, Check } from 'lucide-react';

export function SettingsView() {
  const { addToast } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('identity'); // 'identity' | 'brand' | 'contact' | 'social' | 'seo'

  const [settings, setSettings] = useState({
    siteName: '',
    siteTagline: '',
    logo: '',
    darkLogo: '',
    favicon: '',
    primaryColor: '#4F46E5',
    secondaryColor: '#06B6D4',
    fontFamily: 'Inter',
    contactEmail: '',
    contactPhone: '',
    address: '',
    mapEmbedUrl: '',
    socialLinks: {
      twitter: '',
      linkedin: '',
      github: '',
      facebook: '',
      instagram: '',
    },
    footerDescription: '',
    copyrightText: '',
    seoDefaults: {
      metaTitle: '',
      metaDescription: '',
      robots: 'index, follow',
      canonicalBase: '',
    },
  });

  const [mediaPickerTarget, setMediaPickerTarget] = useState(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/settings');
      if (res.success && res.data) {
        setSettings((prev) => ({
          ...prev,
          ...res.data,
          socialLinks: { ...prev.socialLinks, ...(res.data.socialLinks || {}) },
          seoDefaults: { ...prev.seoDefaults, ...(res.data.seoDefaults || {}) },
        }));
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put('/settings', settings);
      if (res.success) {
        addToast('Site settings and branding saved successfully!', 'success');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading site configuration...</div>;
  }

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
            Website Identity & Global Settings
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Configure branding, color palette tokens, typography, contact points, and SEO defaults.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          <Save size={16} /> {saving ? 'Saving Changes...' : 'Save All Settings'}
        </button>
      </div>

      <div className="card">
        <div className="tabs-header" style={{ padding: '0 20px', marginBottom: 0 }}>
          <button
            className={`tab-btn ${activeTab === 'identity' ? 'active' : ''}`}
            onClick={() => setActiveTab('identity')}
          >
            Site Identity & Logos
          </button>
          <button
            className={`tab-btn ${activeTab === 'brand' ? 'active' : ''}`}
            onClick={() => setActiveTab('brand')}
          >
            Theme & Color Tokens
          </button>
          <button
            className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            Contact Information
          </button>
          <button
            className={`tab-btn ${activeTab === 'social' ? 'active' : ''}`}
            onClick={() => setActiveTab('social')}
          >
            Social Channels & Links
          </button>
          <button
            className={`tab-btn ${activeTab === 'seo' ? 'active' : ''}`}
            onClick={() => setActiveTab('seo')}
          >
            Default SEO & Metadata
          </button>
        </div>

        <div className="card-body">
          <form onSubmit={handleSave}>
            {/* Identity Tab */}
            {activeTab === 'identity' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Website Name</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Site Tagline</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.siteTagline}
                      onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Primary Brand Logo URL</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="https://..."
                        value={settings.logo}
                        onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setMediaPickerTarget('logo')}
                      >
                        Browse
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Dark-mode Logo URL</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="https://..."
                        value={settings.darkLogo}
                        onChange={(e) => setSettings({ ...settings, darkLogo: e.target.value })}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setMediaPickerTarget('darkLogo')}
                      >
                        Browse
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Favicon Icon URL</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="https://..."
                        value={settings.favicon}
                        onChange={(e) => setSettings({ ...settings, favicon: e.target.value })}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setMediaPickerTarget('favicon')}
                      >
                        Browse
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Footer Brand Description</label>
                  <textarea
                    rows={2}
                    className="form-control"
                    value={settings.footerDescription}
                    onChange={(e) =>
                      setSettings({ ...settings, footerDescription: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Copyright Notice Text</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.copyrightText}
                    onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Brand & Palette Tab */}
            {activeTab === 'brand' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="form-group">
                    <label className="form-label">Primary Brand Color Token</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="color"
                        style={{
                          width: '44px',
                          height: '40px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border)',
                          cursor: 'pointer',
                        }}
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      />
                      <input
                        type="text"
                        className="form-control"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      />
                    </div>
                    <span className="form-hint">
                      Applied to primary action buttons, active navigation states, and key highlights.
                    </span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Secondary / Accent Color Token</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="color"
                        style={{
                          width: '44px',
                          height: '40px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border)',
                          cursor: 'pointer',
                        }}
                        value={settings.secondaryColor}
                        onChange={(e) =>
                          setSettings({ ...settings, secondaryColor: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        className="form-control"
                        value={settings.secondaryColor}
                        onChange={(e) =>
                          setSettings({ ...settings, secondaryColor: e.target.value })
                        }
                      />
                    </div>
                    <span className="form-hint">
                      Applied to complementary badges, feature highlights, and interactive accents.
                    </span>
                  </div>
                </div>

                <div className="form-group" style={{ maxWidth: '400px' }}>
                  <label className="form-label">Approved Brand Typography Font</label>
                  <select
                    className="form-control"
                    value={settings.fontFamily}
                    onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                  >
                    <option value="Inter">Inter (Clean, Modern SaaS Standard)</option>
                    <option value="Roboto">Roboto (Versatile Enterprise)</option>
                    <option value="Outfit">Outfit (Tech Forward & Friendly)</option>
                    <option value="Montserrat">Montserrat (Geometric Elegance)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Public Contact Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Public Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Physical Office Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Google Maps Embed URL</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://www.google.com/maps/embed?..."
                    value={settings.mapEmbedUrl}
                    onChange={(e) => setSettings({ ...settings, mapEmbedUrl: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Social Links Tab */}
            {activeTab === 'social' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">LinkedIn Company URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://linkedin.com/company/..."
                    value={settings.socialLinks?.linkedin || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, linkedin: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Twitter / X URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://x.com/..."
                    value={settings.socialLinks?.twitter || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, twitter: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">GitHub Organization URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://github.com/..."
                    value={settings.socialLinks?.github || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, github: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Facebook Page URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://facebook.com/..."
                    value={settings.socialLinks?.facebook || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, facebook: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            )}

            {/* SEO Defaults Tab */}
            {activeTab === 'seo' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Global Fallback Meta Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.seoDefaults?.metaTitle || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        seoDefaults: { ...settings.seoDefaults, metaTitle: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Global Fallback Meta Description</label>
                  <textarea
                    rows={3}
                    className="form-control"
                    value={settings.seoDefaults?.metaDescription || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        seoDefaults: { ...settings.seoDefaults, metaDescription: e.target.value },
                      })
                    }
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Canonical Base Domain</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://yourdomain.com"
                      value={settings.seoDefaults?.canonicalBase || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          seoDefaults: { ...settings.seoDefaults, canonicalBase: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Default Robots Directive</label>
                    <select
                      className="form-control"
                      value={settings.seoDefaults?.robots || 'index, follow'}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          seoDefaults: { ...settings.seoDefaults, robots: e.target.value },
                        })
                      }
                    >
                      <option value="index, follow">index, follow (Allow Indexing)</option>
                      <option value="noindex, nofollow">noindex, nofollow (Disallow Indexing)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <MediaPickerModal
        isOpen={!!mediaPickerTarget}
        onClose={() => setMediaPickerTarget(null)}
        onSelect={(url) => {
          if (mediaPickerTarget) {
            setSettings((prev) => ({ ...prev, [mediaPickerTarget]: url }));
          }
        }}
        currentUrl={mediaPickerTarget ? settings[mediaPickerTarget] : ''}
      />
    </div>
  );
}
