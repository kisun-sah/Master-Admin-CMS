import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Shared Context
import { ThemeProvider } from './shared/ThemeContext.jsx';

// Admin Context & Components
import { AuthProvider } from './admin/context/AuthContext.jsx';
import { SettingsProvider } from './admin/context/SettingsContext.jsx';
import AdminRoot from './admin/AdminRoot.jsx';
import AdminLoginPage from './admin/AdminLoginPage.jsx';

// Public Context & Components
import { CmsProvider } from './public/context/CmsContext.jsx';
import Navbar from './public/components/layout/Navbar.jsx';
import Footer from './public/components/layout/Footer.jsx';
import PopupModal from './public/components/common/PopupModal.jsx';

// Public Pages
import HomePage from './public/pages/HomePage.jsx';
import ServicesPage from './public/pages/ServicesPage.jsx';
import ServiceDetailPage from './public/pages/ServiceDetailPage.jsx';
import GalleryPage from './public/pages/GalleryPage.jsx';
import GalleryDetailPage from './public/pages/GalleryDetailPage.jsx';
import BlogPage from './public/pages/BlogPage.jsx';
import BlogDetailPage from './public/pages/BlogDetailPage.jsx';
import CareersPage from './public/pages/CareersPage.jsx';
import CareerDetailPage from './public/pages/CareerDetailPage.jsx';
import ContactPage from './public/pages/ContactPage.jsx';
import AboutPage from './public/pages/AboutPage.jsx';
import WebsitePackagesPage from './public/pages/WebsitePackagesPage.jsx';
import DynamicPageView from './public/pages/DynamicPageView.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Wrapper for Public Website Pages with Navbar, Footer, and Popup
function PublicSiteLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900 dark:bg-[#090D16] dark:text-slate-100 transition-colors duration-200">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <PopupModal />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          <CmsProvider>
            <Routes>
              {/* ================= ADMIN CMS ROUTES ================= */}
              {/* Unauthenticated Login Route */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Default /admin redirect to /admin/dashboard */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

              {/* Protected Admin CMS Area (All /admin/* routes) */}
              <Route path="/admin/*" element={<AdminRoot />} />

              {/* ================= PUBLIC WEBSITE ROUTES ================= */}
              <Route
                path="/"
                element={
                  <PublicSiteLayout>
                    <HomePage />
                  </PublicSiteLayout>
                }
              />
              <Route
                path="/services"
                element={
                  <PublicSiteLayout>
                    <ServicesPage />
                  </PublicSiteLayout>
                }
              />
              <Route
                path="/services/:slug"
                element={
                  <PublicSiteLayout>
                    <ServiceDetailPage />
                  </PublicSiteLayout>
                }
              />
              <Route
                path="/gallery"
                element={
                  <PublicSiteLayout>
                    <GalleryPage />
                  </PublicSiteLayout>
                }
              />
              <Route
                path="/gallery/:slug"
                element={
                  <PublicSiteLayout>
                    <GalleryDetailPage />
                  </PublicSiteLayout>
                }
              />
              <Route
                path="/blog"
                element={
                  <PublicSiteLayout>
                    <BlogPage />
                  </PublicSiteLayout>
                }
              />
              <Route
                path="/blog/:slug"
                element={
                  <PublicSiteLayout>
                    <BlogDetailPage />
                  </PublicSiteLayout>
                }
              />
              <Route
                path="/careers"
                element={
                  <PublicSiteLayout>
                    <CareersPage />
                  </PublicSiteLayout>
                }
              />
              <Route
                path="/careers/:slug"
                element={
                  <PublicSiteLayout>
                    <CareerDetailPage />
                  </PublicSiteLayout>
                }
              />
              <Route
                path="/contact"
                element={
                  <PublicSiteLayout>
                    <ContactPage />
                  </PublicSiteLayout>
                }
              />
              <Route
                path="/about"
                element={
                  <PublicSiteLayout>
                    <AboutPage />
                  </PublicSiteLayout>
                }
              />
              <Route
                path="/about-us"
                element={
                  <PublicSiteLayout>
                    <AboutPage />
                  </PublicSiteLayout>
                }
              />
              <Route
                path="/website-packages"
                element={
                  <PublicSiteLayout>
                    <WebsitePackagesPage />
                  </PublicSiteLayout>
                }
              />
              <Route
                path="/pages/:slug"
                element={
                  <PublicSiteLayout>
                    <DynamicPageView />
                  </PublicSiteLayout>
                }
              />

              {/* Dynamic CMS Page Catch-All (e.g. /custom-page-slug) */}
              <Route
                path="/:slug"
                element={
                  <PublicSiteLayout>
                    <DynamicPageView />
                  </PublicSiteLayout>
                }
              />
            </Routes>
          </CmsProvider>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

