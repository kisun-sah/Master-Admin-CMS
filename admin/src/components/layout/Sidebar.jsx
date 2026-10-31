import React, { useState, useEffect } from 'react';
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
  ChevronDown,
  LogOut,
  GraduationCap,
  FileCheck,
  Camera,
  Layers,
  SlidersHorizontal,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import { ThemeToggle } from '../common/ThemeToggle.jsx';

// Central Navigation Structure Definition
const NAVIGATION_GROUPS = [
  {
    groupTitle: 'Overview',
    items: [
      {
        id: 'dashboard',
        key: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        hasSubmenu: false,
      },
    ],
  },
  {
    groupTitle: 'Site Management',
    items: [
      {
        id: 'site-management',
        label: 'Site Management',
        icon: SlidersHorizontal,
        hasSubmenu: true,
        submenus: [
          { key: 'settings', label: 'Site Settings', icon: Settings, perm: 'settings:read' },
          { key: 'navigation', label: 'Navigation Menus', icon: Compass, perm: 'menus:read' },
          { key: 'sliders', label: 'Sliders & Banners', icon: Sliders, perm: 'sliders:read' },
          { key: 'popups', label: 'Popups & Alerts', icon: BellRing, perm: 'popups:read' },
        ],
      },
    ],
  },
  {
    groupTitle: 'Content Engine',
    items: [
      {
        id: 'content-engine',
        label: 'Content Engine',
        icon: Layers,
        hasSubmenu: true,
        submenus: [
          { key: 'pages', label: 'Pages & Blocks', icon: FileText, perm: 'pages:read' },
          { key: 'services', label: 'Services', icon: Briefcase, perm: 'services:read' },
          { key: 'blogs', label: 'Blog & Articles', icon: BookOpen, perm: 'blogs:read' },
          { key: 'gallery', label: 'Organization Gallery', icon: Camera, perm: 'gallery:read' },
          { key: 'media', label: 'Media Library', icon: ImageIcon, perm: 'media:read' },
          { key: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote, perm: 'testimonials:read' },
          { key: 'team', label: 'Team Members', icon: Users, perm: 'team:read' },
          { key: 'partners', label: 'Partners / Clients', icon: Building, perm: 'partners:read' },
          { key: 'faqs', label: 'FAQs', icon: HelpCircle, perm: 'faqs:read' },
        ],
      },
    ],
  },
  {
    groupTitle: 'Careers & Talent',
    items: [
      {
        id: 'careers-talent',
        label: 'Careers & Talent',
        icon: GraduationCap,
        hasSubmenu: true,
        submenus: [
          { key: 'careers', label: 'Job Vacancies', icon: GraduationCap, perm: 'careers:read' },
          { key: 'jobapplications', label: 'Job Applications', icon: FileCheck, perm: 'jobapplications:read' },
        ],
      },
    ],
  },
  {
    groupTitle: 'Inquiries & SEO',
    items: [
      {
        id: 'inquiries-seo',
        label: 'Inquiries & SEO',
        icon: Search,
        hasSubmenu: true,
        submenus: [
          { key: 'contacts', label: 'Contact Submissions', icon: Inbox, perm: 'contacts:read' },
          { key: 'seo', label: 'SEO Health & Redirects', icon: Search, perm: 'seo:read' },
        ],
      },
    ],
  },
  {
    groupTitle: 'Governance & System',
    items: [
      {
        id: 'governance-system',
        label: 'Governance & System',
        icon: ShieldCheck,
        hasSubmenu: true,
        submenus: [
          { key: 'users', label: 'Users & Roles', icon: ShieldCheck, perm: 'users:read' },
          { key: 'audit', label: 'Audit Logs', icon: History, perm: 'audit:read' },
          { key: 'system', label: 'System Health', icon: Activity, perm: 'system:read' },
        ],
      },
    ],
  },
];

// Map each route to its parent menu id
const ROUTE_TO_PARENT_MAP = {};
NAVIGATION_GROUPS.forEach((group) => {
  group.items.forEach((item) => {
    if (item.hasSubmenu && item.submenus) {
      item.submenus.forEach((sub) => {
        ROUTE_TO_PARENT_MAP[sub.key] = item.id;
      });
    }
  });
});

export function Sidebar({
  currentRoute,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) {
  const { user, logout, hasPermission } = useAuth();
  const { settings } = useSettings();
  const [logoFailed, setLogoFailed] = useState(false);

  // Track currently expanded parent menu (accordion mode: only one parent expanded at a time)
  const [expandedParent, setExpandedParent] = useState(() => ROUTE_TO_PARENT_MAP[currentRoute] || null);

  // When currentRoute changes (e.g. direct URL, refresh, or back/forward navigation),
  // automatically synchronize and expand the corresponding parent menu
  useEffect(() => {
    const parentId = ROUTE_TO_PARENT_MAP[currentRoute];
    if (parentId) {
      setExpandedParent(parentId);
    }
  }, [currentRoute]);

  // Reset logo error state when settings change
  useEffect(() => {
    setLogoFailed(false);
  }, [settings?.logo, settings?.favicon]);

  // Handle clicking a parent menu item
  const handleParentClick = (parentItem) => {
    if (collapsed) {
      // If sidebar is collapsed, expand it and open this menu
      if (onToggleCollapse) onToggleCollapse();
      setExpandedParent(parentItem.id);
      return;
    }

    // Toggle: if already open, close it; otherwise open it and close previous
    setExpandedParent((prev) => (prev === parentItem.id ? null : parentItem.id));
  };

  // Handle direct item click (Dashboard)
  const handleDirectItemClick = (key) => {
    if (onCloseMobile) onCloseMobile();
    onNavigate(key);
  };

  // Handle submenu item click
  const handleSubItemClick = (subKey) => {
    if (onCloseMobile) onCloseMobile();
    onNavigate(subKey);
  };

  return (
    <aside
      className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
      style={{
        width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
      }}
    >
      {/* Brand Header */}
      <div className="sidebar-header">
        {!collapsed && (
          <div
            className="brand-title"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}
          >
            {settings?.logo && !logoFailed ? (
              <img
                src={settings.logo}
                alt={settings?.siteName || 'Logo'}
                style={{
                  maxHeight: '34px',
                  maxWidth: '120px',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  display: 'block',
                }}
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <div className="brand-badge">
                {settings?.siteName ? settings.siteName.trim().charAt(0).toUpperCase() : 'M'}
              </div>
            )}
            <span
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '120px',
              }}
              title={settings?.siteName || 'Master CMS'}
            >
              {settings?.siteName || 'Master CMS'}
            </span>
          </div>
        )}

        {collapsed && (
          <div
            style={{
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {(settings?.favicon || settings?.logo) && !logoFailed ? (
              <img
                src={settings?.favicon || settings?.logo}
                alt={settings?.siteName || 'Icon'}
                style={{
                  width: '32px',
                  height: '32px',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-sm)',
                  display: 'block',
                }}
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <div className="brand-badge">
                {settings?.siteName ? settings.siteName.trim().charAt(0).toUpperCase() : 'M'}
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          className="btn-icon"
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Above Menu Options: User & Role Banner */}
      {!collapsed && user && (
        <div className="sidebar-user-section">
          <div className="sidebar-user-avatar">
            {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            <span className="user-online-dot" title="Active session" />
          </div>
          <div className="sidebar-user-details">
            <div className="sidebar-user-name" title={user.displayName}>
              {user.displayName || 'Administrator'}
            </div>
            <div className="sidebar-user-role-wrap">
              <span className="sidebar-role-badge">
                {user.role || 'Admin'}
              </span>
            </div>
          </div>
        </div>
      )}

      {collapsed && user && (
        <div
          className="sidebar-user-section collapsed"
          title={`${user.displayName || 'User'} (${user.role || 'Admin'})`}
        >
          <div className="sidebar-user-avatar">
            {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            <span className="user-online-dot" />
          </div>
        </div>
      )}

      {/* Navigation Groups */}
      <nav className="sidebar-nav">
        {NAVIGATION_GROUPS.map((group, gIdx) => {
          // Filter items by permission
          const visibleItems = group.items
            .map((item) => {
              if (item.hasSubmenu) {
                const allowedSubmenus = item.submenus.filter(
                  (sub) => !sub.perm || hasPermission(sub.perm)
                );
                return { ...item, submenus: allowedSubmenus };
              }
              return item;
            })
            .filter((item) => {
              if (item.hasSubmenu) return item.submenus.length > 0;
              return !item.perm || hasPermission(item.perm);
            });

          if (visibleItems.length === 0) return null;

          return (
            <div key={gIdx} className="nav-group-section">
              {!collapsed && <div className="nav-group-title">{group.groupTitle}</div>}

              {visibleItems.map((item) => {
                const Icon = item.icon;

                // 1. Direct Item (e.g. Dashboard)
                if (!item.hasSubmenu) {
                  const isActive = currentRoute === item.key;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      className={`nav-item ${isActive ? 'active' : ''}`}
                      onClick={() => handleDirectItemClick(item.key)}
                      title={collapsed ? item.label : undefined}
                      aria-current={isActive ? 'page' : undefined}
                      style={{
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        padding: collapsed ? '10px 0' : '9px 12px',
                      }}
                    >
                      <Icon size={18} />
                      {!collapsed && <span>{item.label}</span>}
                    </button>
                  );
                }

                // 2. Parent Menu with Collapsible Submenu
                const isExpanded = expandedParent === item.id;
                const hasActiveChild = item.submenus.some((sub) => sub.key === currentRoute);

                return (
                  <div key={item.id} className="nav-parent-wrapper">
                    <button
                      type="button"
                      className={`nav-parent-btn ${isExpanded ? 'expanded' : ''} ${
                        hasActiveChild ? 'active-parent' : ''
                      }`}
                      onClick={() => handleParentClick(item)}
                      title={collapsed ? item.label : undefined}
                      aria-expanded={isExpanded}
                      aria-controls={`submenu-${item.id}`}
                      style={{
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        padding: collapsed ? '10px 0' : '9px 12px',
                      }}
                    >
                      <Icon size={18} className="parent-icon" />
                      {!collapsed && (
                        <>
                          <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                          <ChevronDown
                            size={16}
                            className={`parent-chevron ${isExpanded ? 'rotated' : ''}`}
                          />
                        </>
                      )}
                    </button>

                    {/* Smooth Collapsible Submenu */}
                    {!collapsed && (
                      <div
                        id={`submenu-${item.id}`}
                        className={`nav-submenu-wrapper ${isExpanded ? 'expanded' : ''}`}
                        aria-hidden={!isExpanded}
                      >
                        <div className="nav-submenu-inner">
                          <ul className="nav-submenu-list">
                            {item.submenus.map((sub) => {
                              const SubIcon = sub.icon;
                              const isSubActive = currentRoute === sub.key;

                              return (
                                <li key={sub.key}>
                                  <button
                                    type="button"
                                    className={`nav-subitem-btn ${isSubActive ? 'active' : ''}`}
                                    onClick={() => handleSubItemClick(sub.key)}
                                    aria-current={isSubActive ? 'page' : undefined}
                                  >
                                    <SubIcon size={15} />
                                    <span>{sub.label}</span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer Profile & Theme Strip */}
      <div
        className="sidebar-footer"
        style={{
          borderTop: '1px solid var(--border)',
          padding: collapsed ? '12px 6px' : '12px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: '8px',
          flexWrap: collapsed ? 'nowrap' : 'nowrap',
        }}
      >
        {!collapsed ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ThemeToggle variant="segmented" />
            </div>
            <button
              type="button"
              className="btn-icon"
              onClick={logout}
              title="Sign Out"
              style={{ color: 'var(--danger)' }}
              aria-label="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <ThemeToggle variant="dropdown" />
            <button
              type="button"
              className="btn-icon"
              onClick={logout}
              title="Sign Out"
              style={{ color: 'var(--danger)' }}
              aria-label="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
