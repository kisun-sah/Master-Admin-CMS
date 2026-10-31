import React from 'react';
import { Search, ExternalLink, Shield, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import { ThemeToggle } from '../common/ThemeToggle.jsx';

export function Header({ currentRoute, onOpenProfile, onToggleMobileSidebar }) {
  const { user } = useAuth();
  const { settings } = useSettings();

  const routeNames = {
    dashboard: 'Dashboard Overview',
    pages: 'Pages & Content Blocks',
    services: 'Services Management',
    blogs: 'Blog & Articles',
    gallery: 'Organization Photo Gallery',
    media: 'Digital Media Library',
    sliders: 'Sliders & Banners',
    testimonials: 'Client Testimonials',
    team: 'Team Directory',
    partners: 'Partners & Clients',
    faqs: 'Frequently Asked Questions',
    popups: 'Marketing Popups',
    careers: 'Careers & Job Vacancies',
    jobapplications: 'Candidate Job Applications',
    contacts: 'Contact Inquiries',
    settings: 'Site Identity & Brand Settings',
    navigation: 'Navigation Menus',
    seo: 'SEO Health & 301 Redirects',
    users: 'Users, Roles & Access Control',
    audit: 'Security Audit Trail',
    system: 'System Health & Database Pool',
  };

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onToggleMobileSidebar}
          title="Toggle Navigation Menu"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          {settings?.siteName || 'Workspace'}
        </span>
        <span style={{ color: 'var(--text-subtle)' }}>/</span>
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
          {routeNames[currentRoute] || 'Overview'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          <Shield size={14} />
          <span style={{ textTransform: 'capitalize' }}>{user?.role || 'Admin'}</span>
        </div>

        {/* Theme Mode Switcher (Light / Dark / System) */}
        <ThemeToggle variant="segmented" />

        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenProfile}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'var(--primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 700,
            }}
          >
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
          </div>
          <span>{user?.displayName || 'My Profile'}</span>
        </button>
      </div>
    </header>
  );
}
