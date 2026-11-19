import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import { MediaPickerModal } from '../../components/common/MediaPickerModal.jsx';
import { Globe, Palette, Mail, Share2, Shield, Save, Check, Layers, Sparkles, ArrowUp, ArrowDown } from 'lucide-react';

const DEFAULT_HOMEPAGE_SECTIONS = [
  { id: 'hero', name: 'Hero Video & Banner Slider', enabled: true, order: 1, animation: 'fade-in' },
  { id: 'skillsMarquee', name: 'Professional Skills & Technologies Marquee', enabled: true, order: 2, animation: 'fade-up' },
  { id: 'shortPortfolio', name: 'Short Portfolio & Skill Hub', enabled: true, order: 3, animation: 'fade-up' },
  { id: 'services', name: 'Core Services & Capabilities Grid', enabled: true, order: 4, animation: 'fade-up' },
  { id: 'gallery', name: 'Delivered Projects & Templates Showcase', enabled: true, order: 5, animation: 'fade-up' },
  { id: 'stats', name: 'Key Metrics & Impact Numbers', enabled: true, order: 6, animation: 'fade-up' },
  { id: 'testimonials', name: 'Client Testimonials & Feedback', enabled: true, order: 7, animation: 'fade-up' },
  { id: 'blogs', name: 'Latest Blogs & Tech Insights', enabled: true, order: 8, animation: 'fade-up' },
  { id: 'faqs', name: 'Frequently Asked Questions (FAQ)', enabled: true, order: 9, animation: 'fade-up' },
  { id: 'cta', name: 'Bottom Consultation CTA Banner', enabled: true, order: 10, animation: 'fade-up' },
];

export function SettingsView({ initialTab = 'identity' }) {
  const { addToast } = useAuth();
  const { settings: globalSettings, saveSettings, previewTheme, resetTheme } = useSettings();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab); // 'identity' | 'brand' | 'contact' | 'social' | 'seo' | 'layout'

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

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
    homepageSections: DEFAULT_HOMEPAGE_SECTIONS,
    animationSettings: {
      enabled: true,
      defaultPreset: 'fade-up',
      duration: 0.55,
      delay: 0,
      staggerDelay: 0.08,
    },
  });

  const [mediaPickerTarget, setMediaPickerTarget] = useState(null);

  // Sync state with globalSettings when loaded
  useEffect(() => {
    if (globalSettings) {
      setSettings((prev) => ({
        ...prev,
        ...globalSettings,
        homepageSections: (() => {
          const loaded = (globalSettings.homepageSections?.length ? [...globalSettings.homepageSections] : [...DEFAULT_HOMEPAGE_SECTIONS])
            .filter((s) => s.id !== 'team' && s.id !== 'partners');
          DEFAULT_HOMEPAGE_SECTIONS.forEach((def) => {
            if (!loaded.some((s) => s.id === def.id)) {
              loaded.push(def);
            }
          });
          return loaded.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
        })(),
        animationSettings: { ...(prev.animationSettings || {}), ...(globalSettings.animationSettings || {}) },
        socialLinks: { ...(prev.socialLinks || {}), ...(globalSettings.socialLinks || {}) },
        seoDefaults: { ...(prev.seoDefaults || {}), ...(globalSettings.seoDefaults || {}) },
      }));
    }
  }, [globalSettings]);

  // Reset theme on unmount if user leaves without saving
  useEffect(() => {
    return () => {
      resetTheme();
    };
  }, [resetTheme]);

  const updateField = (field, value) => {
    setSettings((prev) => {
      const updated = { ...prev, [field]: value };
      if (['primaryColor', 'secondaryColor', 'fontFamily', 'favicon', 'logo', 'siteName'].includes(field)) {
        previewTheme(updated);
      }
      return updated;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await saveSettings(settings);
      addToast('Site settings, brand colors, logo, and fonts updated across Admin Panel!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleMediaSelect = (url) => {
    if (mediaPickerTarget) {
      updateField(mediaPickerTarget, url);
    }
    setMediaPickerTarget(null);
  };

  const toggleSection = (id) => {
    setSettings((prev) => {
      const sections = (prev.homepageSections || DEFAULT_HOMEPAGE_SECTIONS).map((sec) =>
        sec.id === id ? { ...sec, enabled: !sec.enabled } : sec
      );
      return { ...prev, homepageSections: sections };
    });
  };

  const updateSectionOrder = (id, newOrder) => {
    setSettings((prev) => {
      const sections = (prev.homepageSections || DEFAULT_HOMEPAGE_SECTIONS).map((sec) =>
        sec.id === id ? { ...sec, order: Number(newOrder) || 0 } : sec
      );
      return { ...prev, homepageSections: sections };
    });
  };

  const updateSectionAnimation = (id, newAnim) => {
    setSettings((prev) => {
      const sections = (prev.homepageSections || DEFAULT_HOMEPAGE_SECTIONS).map((sec) =>
        sec.id === id ? { ...sec, animation: newAnim } : sec
      );
      return { ...prev, homepageSections: sections };
    });
  };

  const moveSection = (index, direction) => {
    setSettings((prev) => {
      const sections = [...(prev.homepageSections || DEFAULT_HOMEPAGE_SECTIONS)];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= sections.length) return prev;
      const temp = sections[index];
      sections[index] = sections[targetIndex];
      sections[targetIndex] = temp;
      const reordered = sections.map((s, idx) => ({ ...s, order: idx + 1 }));
      return { ...prev, homepageSections: reordered };
    });
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
            Website Identity & Global Settings
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Configure branding, color palette tokens, typography, contact points, and SEO defaults. Changes apply dynamically across the Admin Panel.
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
          <button
            className={`tab-btn ${activeTab === 'layout' ? 'active' : ''}`}
            onClick={() => setActiveTab('layout')}
          >
            Content Pillars & Homepage Layout
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
                      onChange={(e) => updateField('siteName', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Site Tagline</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.siteTagline}
                      onChange={(e) => updateField('siteTagline', e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  {/* Primary Brand Logo */}
                  <div className="form-group">
                    <label className="form-label">Primary Brand Logo URL</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="https://... or /uploads/..."
                        value={settings.logo}
                        onChange={(e) => updateField('logo', e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setMediaPickerTarget('logo')}
                      >
                        Browse
                      </button>
                    </div>
                    {settings.logo && (
                      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={settings.logo}
                          alt="Logo Preview"
                          style={{
                            maxHeight: '34px',
                            maxWidth: '120px',
                            objectFit: 'contain',
                            background: '#F1F5F9',
                            padding: '3px 6px',
                            borderRadius: '4px',
                            border: '1px solid var(--border)',
                          }}
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '11px', padding: '2px 8px' }}
                          onClick={() => updateField('logo', '')}
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Dark-mode Logo */}
                  <div className="form-group">
                    <label className="form-label">Dark-mode Logo URL</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="https://... or /uploads/..."
                        value={settings.darkLogo}
                        onChange={(e) => updateField('darkLogo', e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setMediaPickerTarget('darkLogo')}
                      >
                        Browse
                      </button>
                    </div>
                    {settings.darkLogo && (
                      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={settings.darkLogo}
                          alt="Dark Logo Preview"
                          style={{
                            maxHeight: '34px',
                            maxWidth: '120px',
                            objectFit: 'contain',
                            background: '#1E293B',
                            padding: '3px 6px',
                            borderRadius: '4px',
                            border: '1px solid var(--border)',
                          }}
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '11px', padding: '2px 8px' }}
                          onClick={() => updateField('darkLogo', '')}
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Favicon */}
                  <div className="form-group">
                    <label className="form-label">Favicon Icon URL</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="https://... or /uploads/..."
                        value={settings.favicon}
                        onChange={(e) => updateField('favicon', e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setMediaPickerTarget('favicon')}
                      >
                        Browse
                      </button>
                    </div>
                    {settings.favicon && (
                      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={settings.favicon}
                          alt="Favicon Preview"
                          style={{
                            width: '28px',
                            height: '28px',
                            objectFit: 'contain',
                            background: '#F1F5F9',
                            padding: '2px',
                            borderRadius: '4px',
                            border: '1px solid var(--border)',
                          }}
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '11px', padding: '2px 8px' }}
                          onClick={() => updateField('favicon', '')}
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Footer Brand Description</label>
                  <textarea
                    rows={2}
                    className="form-control"
                    value={settings.footerDescription}
                    onChange={(e) => updateField('footerDescription', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Copyright Notice Text</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.copyrightText}
                    onChange={(e) => updateField('copyrightText', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Brand & Palette Tab */}
            {activeTab === 'brand' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--primary-light)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
                      Live Admin Theme Preview
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Color and typography adjustments instantly reflect across the admin sidebar, buttons, and navigation.
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ pointerEvents: 'none' }}
                    >
                      Primary Button
                    </button>
                    <span
                      style={{
                        background: 'var(--accent)',
                        color: '#FFFFFF',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      Accent Badge
                    </span>
                  </div>
                </div>

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
                        onChange={(e) => updateField('primaryColor', e.target.value)}
                      />
                      <input
                        type="text"
                        className="form-control"
                        value={settings.primaryColor}
                        onChange={(e) => updateField('primaryColor', e.target.value)}
                      />
                    </div>
                    <span className="form-hint">
                      Applied to admin buttons, active sidebar navigation links, focus borders, and highlights.
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
                        onChange={(e) => updateField('secondaryColor', e.target.value)}
                      />
                      <input
                        type="text"
                        className="form-control"
                        value={settings.secondaryColor}
                        onChange={(e) => updateField('secondaryColor', e.target.value)}
                      />
                    </div>
                    <span className="form-hint">
                      Applied to complementary badges, feature accents, and highlighted tags.
                    </span>
                  </div>
                </div>

                <div className="form-group" style={{ maxWidth: '400px' }}>
                  <label className="form-label">Approved Brand Typography Font</label>
                  <select
                    className="form-control"
                    value={settings.fontFamily}
                    onChange={(e) => updateField('fontFamily', e.target.value)}
                  >
                    <option value="Inter">Inter (Clean, Modern SaaS Standard)</option>
                    <option value="Roboto">Roboto (Versatile Enterprise)</option>
                    <option value="Outfit">Outfit (Tech Forward & Friendly)</option>
                    <option value="Montserrat">Montserrat (Geometric Elegance)</option>
                    <option value="Poppins">Poppins (Modern & Rounded)</option>
                    <option value="Open Sans">Open Sans (Neutral & Readable)</option>
                  </select>
                  <span className="form-hint">
                    Dynamically loaded from Google Fonts and applied globally to the Admin Panel.
                  </span>
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
                      onChange={(e) => updateField('contactEmail', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Public Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.contactPhone}
                      onChange={(e) => updateField('contactPhone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Physical Office Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.address}
                    onChange={(e) => updateField('address', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Google Maps Embed URL</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://www.google.com/maps/embed?..."
                    value={settings.mapEmbedUrl}
                    onChange={(e) => updateField('mapEmbedUrl', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Social Channels Tab */}
            {activeTab === 'social' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">LinkedIn Organization URL</label>
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

            {/* Homepage Layout & Animations Tab */}
            {activeTab === 'layout' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Global Animations Settings Card */}
                <div
                  style={{
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--primary-light)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Sparkles size={16} color="var(--primary)" />
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                      Global Animation & Motion System
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Configure the global entrance animations and viewport scroll-reveal presets powered by Framer Motion. Automatically respects user reduced-motion accessibility settings.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Global Animations Active</label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '6px' }}>
                        <input
                          type="checkbox"
                          checked={settings.animationSettings?.enabled !== false}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              animationSettings: {
                                ...(settings.animationSettings || {}),
                                enabled: e.target.checked,
                              },
                            })
                          }
                        />
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>Enable Viewport Animations</span>
                      </label>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Default Preset Style</label>
                      <select
                        className="form-control"
                        value={settings.animationSettings?.defaultPreset || 'fade-up'}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            animationSettings: {
                              ...(settings.animationSettings || {}),
                              defaultPreset: e.target.value,
                            },
                          })
                        }
                      >
                        <option value="fade-up">Fade Up (Standard Enterprise)</option>
                        <option value="fade-in">Fade In (Subtle)</option>
                        <option value="slide-left">Slide In From Left</option>
                        <option value="slide-right">Slide In From Right</option>
                        <option value="scale-in">Scale In & Zoom</option>
                        <option value="none">No Animation (Instant)</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Animation Duration (seconds)</label>
                      <input
                        type="number"
                        step="0.05"
                        min="0.1"
                        max="2.0"
                        className="form-control"
                        value={settings.animationSettings?.duration || 0.55}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            animationSettings: {
                              ...(settings.animationSettings || {}),
                              duration: parseFloat(e.target.value) || 0.55,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Homepage Section Management Table */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                        Homepage Section Ordering & Visibility
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                        Toggle sections on or off, rearrange sequence, and set individual section animations. Changes apply immediately upon saving.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSettings((prev) => ({ ...prev, homepageSections: DEFAULT_HOMEPAGE_SECTIONS }))}
                    >
                      Reset to Default Order
                    </button>
                  </div>

                  <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ background: 'var(--surface-sunken)', borderBottom: '1px solid var(--border)' }}>
                          <th style={{ padding: '10px 14px', width: '70px' }}>Active</th>
                          <th style={{ padding: '10px 14px', width: '70px' }}>Order</th>
                          <th style={{ padding: '10px 14px' }}>Section Name</th>
                          <th style={{ padding: '10px 14px', width: '200px' }}>Section Animation</th>
                          <th style={{ padding: '10px 14px', width: '100px', textAlign: 'center' }}>Move</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...(settings.homepageSections || DEFAULT_HOMEPAGE_SECTIONS)]
                          .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
                          .map((sec, idx, arr) => (
                            <tr
                              key={sec.id}
                              style={{
                                borderBottom: idx < arr.length - 1 ? '1px solid var(--border)' : 'none',
                                background: sec.enabled !== false ? 'transparent' : 'rgba(0,0,0,0.02)',
                                opacity: sec.enabled !== false ? 1 : 0.6,
                              }}
                            >
                              <td style={{ padding: '10px 14px' }}>
                                <input
                                  type="checkbox"
                                  checked={sec.enabled !== false}
                                  onChange={() => toggleSection(sec.id)}
                                />
                              </td>
                              <td style={{ padding: '10px 14px' }}>
                                <input
                                  type="number"
                                  min="1"
                                  max="20"
                                  className="form-control"
                                  style={{ width: '56px', padding: '4px 6px', fontSize: '12px' }}
                                  value={sec.order || idx + 1}
                                  onChange={(e) => updateSectionOrder(sec.id, e.target.value)}
                                />
                              </td>
                              <td style={{ padding: '10px 14px' }}>
                                <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{sec.name}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: #{sec.id}</div>
                              </td>
                              <td style={{ padding: '10px 14px' }}>
                                <select
                                  className="form-control"
                                  style={{ padding: '4px 8px', fontSize: '12px' }}
                                  value={sec.animation || 'fade-up'}
                                  onChange={(e) => updateSectionAnimation(sec.id, e.target.value)}
                                >
                                  <option value="fade-up">Fade Up</option>
                                  <option value="fade-in">Fade In</option>
                                  <option value="slide-left">Slide Left</option>
                                  <option value="slide-right">Slide Right</option>
                                  <option value="scale-in">Scale In</option>
                                  <option value="none">No Animation</option>
                                </select>
                              </td>
                              <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                                <div style={{ display: 'inline-flex', gap: '4px' }}>
                                  <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    style={{ padding: '2px 6px' }}
                                    disabled={idx === 0}
                                    onClick={() => moveSection(idx, -1)}
                                    title="Move Up"
                                  >
                                    <ArrowUp size={12} />
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    style={{ padding: '2px 6px' }}
                                    disabled={idx === arr.length - 1}
                                    onClick={() => moveSection(idx, 1)}
                                    title="Move Down"
                                  >
                                    <ArrowDown size={12} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
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
        onSelect={handleMediaSelect}
        currentUrl={mediaPickerTarget ? settings[mediaPickerTarget] : ''}
      />
    </div>
  );
}
