import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  BookOpen,
  Image as ImageIcon,
  Sliders,
  MessageSquareQuote,
  Users,
  Building,
  HelpCircle,
  BellRing,
  Inbox,
  Settings,
  Compass,
  Search,
  ShieldCheck,
  Activity,
  History,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export function Sidebar({ currentRoute, onNavigate, collapsed, onToggleCollapse }) {
  const { user, logout, hasPermission } = useAuth();

  const navigationGroups = [
    {
      title: 'Overview',
      items: [{ key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }],
    },
    {
      title: 'Site Management',
      items: [
        { key: 'settings', label: 'Site Settings', icon: Settings, perm: 'settings:read' },
        { key: 'navigation', label: 'Navigation Menus', icon: Compass, perm: 'menus:read' },
        { key: 'sliders', label: 'Sliders & Banners', icon: Sliders, perm: 'sliders:read' },
        { key: 'popups', label: 'Popups & Alerts', icon: BellRing, perm: 'popups:read' },
      ],
    },
    {
      title: 'Content Engine',
      items: [
        { key: 'pages', label: 'Pages & Blocks', icon: FileText, perm: 'pages:read' },
        { key: 'services', label: 'Services', icon: Briefcase, perm: 'services:read' },
        { key: 'blogs', label: 'Blog & Articles', icon: BookOpen, perm: 'blogs:read' },
        { key: 'media', label: 'Media Library', icon: ImageIcon, perm: 'media:read' },
        { key: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote, perm: 'testimonials:read' },
        { key: 'team', label: 'Team Members', icon: Users, perm: 'team:read' },
        { key: 'partners', label: 'Partners / Clients', icon: Building, perm: 'partners:read' },
        { key: 'faqs', label: 'FAQs', icon: HelpCircle, perm: 'faqs:read' },
      ],
    },
    {
      title: 'Inquiries & SEO',
      items: [
        { key: 'contacts', label: 'Contact Submissions', icon: Inbox, perm: 'contacts:read' },
        { key: 'seo', label: 'SEO & Redirects', icon: Search, perm: 'seo:read' },
      ],
    },
    {
      title: 'Governance & System',
      items: [
        { key: 'users', label: 'Users & Roles', icon: ShieldCheck, perm: 'users:read' },
        { key: 'audit', label: 'Audit Logs', icon: History, perm: 'audit:read' },
        { key: 'system', label: 'System Health', icon: Activity, perm: 'system:read' },
      ],
    },
  ];

  return (
    <aside
      className="sidebar"
      style={{
        width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
      }}
    >
      <div className="sidebar-header">
        {!collapsed && (
          <div className="brand-title">
            <div className="brand-badge">M</div>
            <span>Master CMS</span>
          </div>
        )}
        {collapsed && (
          <div className="brand-badge" style={{ margin: '0 auto' }}>
            M
          </div>
        )}
        <button
          className="btn-icon"
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navigationGroups.map((group, gIdx) => {
          const visibleItems = group.items.filter((item) => !item.perm || hasPermission(item.perm));
          if (visibleItems.length === 0) return null;

          return (
            <div key={gIdx}>
              {!collapsed && <div className="nav-group-title">{group.title}</div>}
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.key;
                return (
                  <div
                    key={item.key}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => onNavigate(item.key)}
                    title={collapsed ? item.label : undefined}
                    style={{
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      padding: collapsed ? '10px 0' : '9px 12px',
                    }}
                  >
                    <Icon size={18} />
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer Profile Strip */}
      <div
        style={{
          borderTop: '1px solid var(--border)',
          padding: collapsed ? '12px 6px' : '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
        }}
      >
        {!collapsed && user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '13px',
                flexShrink: 0,
              }}
            >
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {user.displayName}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  textTransform: 'capitalize',
                }}
              >
                {user.role}
              </div>
            </div>
          </div>
        )}

        <button
          className="btn-icon"
          onClick={logout}
          title="Sign Out"
          style={{ color: 'var(--danger)' }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
