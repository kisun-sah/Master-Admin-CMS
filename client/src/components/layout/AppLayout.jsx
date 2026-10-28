import React, { useState } from 'react';
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

export function AppLayout() {
  const [currentRoute, setCurrentRoute] = useState('dashboard');
  const [selectedVacancyForApplications, setSelectedVacancyForApplications] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const renderActiveView = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <DashboardView onNavigate={setCurrentRoute} />;
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
              setCurrentRoute('jobapplications');
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
        return <SEOView />;
      case 'users':
        return <UsersView />;
      case 'audit':
        return <AuditView />;
      case 'system':
        return <SystemView />;
      default:
        return <DashboardView onNavigate={setCurrentRoute} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={setCurrentRoute}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="main-wrapper">
        <Header
          currentRoute={currentRoute}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        <main className="page-content">{renderActiveView()}</main>
      </div>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}
