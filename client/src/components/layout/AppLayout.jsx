import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Header } from './Header.jsx';
import { ProfileModal } from '../common/ProfileModal.jsx';
import { DashboardView } from '../../features/dashboard/DashboardView.jsx';
import { PagesView } from '../../features/pages/PagesView.jsx';
import { ServicesView } from '../../features/services/ServicesView.jsx';
import { BlogsView } from '../../features/blogs/BlogsView.jsx';
import { MediaView } from '../../features/media/MediaView.jsx';
import { SlidersView } from '../../features/sliders/SlidersView.jsx';
import { TestimonialsView } from '../../features/testimonials/TestimonialsView.jsx';
import { TeamView } from '../../features/team/TeamView.jsx';
import { PartnersView } from '../../features/partners/PartnersView.jsx';
import { FAQsView } from '../../features/faqs/FAQsView.jsx';
import { PopupsView } from '../../features/popups/PopupsView.jsx';
import { ContactsView } from '../../features/contacts/ContactsView.jsx';
import { SettingsView } from '../../features/settings/SettingsView.jsx';
import { NavigationView } from '../../features/navigation/NavigationView.jsx';
import { SEOView } from '../../features/seo/SEOView.jsx';
import { UsersView } from '../../features/users/UsersView.jsx';
import { AuditView } from '../../features/audit/AuditView.jsx';
import { SystemView } from '../../features/system/SystemView.jsx';
import { CareersView } from '../../features/careers/CareersView.jsx';
import { JobApplicationsView } from '../../features/jobapplications/JobApplicationsView.jsx';
import { GalleryView } from '../../features/gallery/GalleryView.jsx';

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
  // Support both hash routing and HTML5 path routing
  if (location.hash && location.hash.length > 1) {
    const rawHash = location.hash.replace(/^#\/?/, '').split('/')[0].split('?')[0].toLowerCase();
    if (VALID_ROUTES.has(rawHash)) return rawHash;
  }
  const rawPath = location.pathname.replace(/^\/+/, '').split('/')[0].split('?')[0].toLowerCase();
  if (VALID_ROUTES.has(rawPath)) return rawPath;
  return 'dashboard';
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
    if (routeKey === 'dashboard') {
      navigate('/');
    } else {
      navigate(`/${routeKey}`);
    }
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

        <main className="page-content">{renderActiveView()}</main>
      </div>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}
