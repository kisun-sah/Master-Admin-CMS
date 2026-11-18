import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Header } from './Header.jsx';
import { ProfileModal } from '../common/ProfileModal.jsx';
import { AdminErrorBoundary } from '../common/AdminErrorBoundary.jsx';

// Route-level code splitting for Admin CMS feature modules
const DashboardView = lazy(() =>
  import('../../features/dashboard/DashboardView.jsx').then((m) => ({ default: m.DashboardView }))
);
const PagesView = lazy(() =>
  import('../../features/pages/PagesView.jsx').then((m) => ({ default: m.PagesView }))
);
const ServicesView = lazy(() =>
  import('../../features/services/ServicesView.jsx').then((m) => ({ default: m.ServicesView }))
);
const BlogsView = lazy(() =>
  import('../../features/blogs/BlogsView.jsx').then((m) => ({ default: m.BlogsView }))
);
const MediaView = lazy(() =>
  import('../../features/media/MediaView.jsx').then((m) => ({ default: m.MediaView }))
);
const SlidersView = lazy(() =>
  import('../../features/sliders/SlidersView.jsx').then((m) => ({ default: m.SlidersView }))
);
const TestimonialsView = lazy(() =>
  import('../../features/testimonials/TestimonialsView.jsx').then((m) => ({ default: m.TestimonialsView }))
);
const TeamView = lazy(() =>
  import('../../features/team/TeamView.jsx').then((m) => ({ default: m.TeamView }))
);
const PartnersView = lazy(() =>
  import('../../features/partners/PartnersView.jsx').then((m) => ({ default: m.PartnersView }))
);
const FAQsView = lazy(() =>
  import('../../features/faqs/FAQsView.jsx').then((m) => ({ default: m.FAQsView }))
);
const PopupsView = lazy(() =>
  import('../../features/popups/PopupsView.jsx').then((m) => ({ default: m.PopupsView }))
);
const ContactsView = lazy(() =>
  import('../../features/contacts/ContactsView.jsx').then((m) => ({ default: m.ContactsView }))
);
const SettingsView = lazy(() =>
  import('../../features/settings/SettingsView.jsx').then((m) => ({ default: m.SettingsView }))
);
const NavigationView = lazy(() =>
  import('../../features/navigation/NavigationView.jsx').then((m) => ({ default: m.NavigationView }))
);
const SEOView = lazy(() =>
  import('../../features/seo/SEOView.jsx').then((m) => ({ default: m.SEOView }))
);
const UsersView = lazy(() =>
  import('../../features/users/UsersView.jsx').then((m) => ({ default: m.UsersView }))
);
const AuditView = lazy(() =>
  import('../../features/audit/AuditView.jsx').then((m) => ({ default: m.AuditView }))
);
const SystemView = lazy(() =>
  import('../../features/system/SystemView.jsx').then((m) => ({ default: m.SystemView }))
);
const CareersView = lazy(() =>
  import('../../features/careers/CareersView.jsx').then((m) => ({ default: m.CareersView }))
);
const JobApplicationsView = lazy(() =>
  import('../../features/jobapplications/JobApplicationsView.jsx').then((m) => ({ default: m.JobApplicationsView }))
);
const GalleryView = lazy(() =>
  import('../../features/gallery/GalleryView.jsx').then((m) => ({ default: m.GalleryView }))
);

const VALID_ROUTES = new Set([
  'dashboard',
  'settings',
  'navigation',
  'sliders',
  'popups',
  'pages',
  'services',
  'blogs',
  'gallery',
  'media',
  'testimonials',
  'team',
  'partners',
  'faqs',
  'careers',
  'jobapplications',
  'contacts',
  'seo',
  'users',
  'audit',
  'system',
]);

function getRouteFromLocation(location) {
  // Support /admin/:routeKey
  const segments = location.pathname.split('/').filter(Boolean);
  if (segments[0] === 'admin') {
    const route = (segments[1] || 'dashboard').toLowerCase();
    if (VALID_ROUTES.has(route)) return route;
  }
  // Support direct hash routing
  if (location.hash && location.hash.length > 1) {
    const rawHash = location.hash.replace(/^#\/?/, '').split('/')[0].split('?')[0].toLowerCase();
    if (VALID_ROUTES.has(rawHash)) return rawHash;
  }
  const rawPath = location.pathname.replace(/^\/+/, '').split('/')[0].split('?')[0].toLowerCase();
  if (VALID_ROUTES.has(rawPath)) return rawPath;
  return 'dashboard';
}

function AdminViewFallback() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
      <div
        style={{
          width: '32px',
          height: '32px',
          border: '3px solid var(--border)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
    </div>
  );
}

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentRoute = getRouteFromLocation(location);
  const [selectedVacancyForApplications, setSelectedVacancyForApplications] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Close mobile drawer on route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname, location.hash]);

  const handleNavigate = (routeKey) => {
    setIsMobileOpen(false);
    const cleanKey = (routeKey || '').replace(/^\/?(admin\/)?/, '');
    navigate(`/${cleanKey}`);
  };

  const renderActiveView = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <DashboardView onNavigate={handleNavigate} />;
      case 'pages':
        return <PagesView />;
      case 'services':
        return <ServicesView />;
      case 'blogs':
        return <BlogsView />;
      case 'gallery':
        return <GalleryView />;
      case 'careers':
        return (
          <CareersView
            onNavigateToApplications={(vacId) => {
              setSelectedVacancyForApplications(vacId);
              handleNavigate('jobapplications');
            }}
          />
        );
      case 'jobapplications':
        return (
          <JobApplicationsView
            initialVacancyId={selectedVacancyForApplications}
          />
        );
      case 'media':
        return <MediaView />;
      case 'sliders':
        return <SlidersView />;
      case 'testimonials':
        return <TestimonialsView />;
      case 'team':
        return <TeamView />;
      case 'partners':
        return <PartnersView />;
      case 'faqs':
        return <FAQsView />;
      case 'popups':
        return <PopupsView />;
      case 'contacts':
        return <ContactsView />;
      case 'settings':
        return <SettingsView />;
      case 'navigation':
        return <NavigationView />;
      case 'seo':
        return <SEOView onNavigate={handleNavigate} />;
      case 'users':
        return <UsersView />;
      case 'audit':
        return <AuditView />;
      case 'system':
        return <SystemView />;
      default:
        return <DashboardView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app-layout">
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="sidebar-mobile-backdrop"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div className="main-wrapper">
        <Header
          currentRoute={currentRoute}
          onOpenProfile={() => setIsProfileOpen(true)}
          onToggleMobileSidebar={() => setIsMobileOpen((prev) => !prev)}
        />

        <main className="page-content">
          <AdminErrorBoundary onReset={() => handleNavigate('dashboard')}>
            <Suspense fallback={<AdminViewFallback />}>
              {renderActiveView()}
            </Suspense>
          </AdminErrorBoundary>
        </main>
      </div>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}
