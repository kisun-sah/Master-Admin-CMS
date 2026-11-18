import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicSiteLayout from './layouts/PublicSiteLayout';
import { RouteErrorBoundary } from './components/common/RouteErrorBoundary';
import HomePage from './pages/HomePage';

// Route-level code splitting for production bundle optimization
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const GalleryDetailPage = lazy(() => import('./pages/GalleryDetailPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const CareerDetailPage = lazy(() => import('./pages/CareerDetailPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const WebsitePackagesPage = lazy(() => import('./pages/WebsitePackagesPage'));
const DynamicPageView = lazy(() => import('./pages/DynamicPageView'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
      <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-3" />
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
        Loading...
      </span>
    </div>
  );
}

export default function App() {
  return (
    <PublicSiteLayout>
      <RouteErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Services & Aliases */}
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/our-services" element={<ServicesPage />} />
            <Route path="/our-sevices" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/our-services/:slug" element={<ServiceDetailPage />} />
            <Route path="/our-sevices/:slug" element={<ServiceDetailPage />} />

            {/* Gallery & Portfolio Aliases */}
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/portfolio" element={<GalleryPage />} />
            <Route path="/our-work" element={<GalleryPage />} />
            <Route path="/gallery/:slug" element={<GalleryDetailPage />} />
            <Route path="/portfolio/:slug" element={<GalleryDetailPage />} />
            <Route path="/our-work/:slug" element={<GalleryDetailPage />} />

            {/* Blog & Aliases */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blogs" element={<BlogPage />} />
            <Route path="/blog-insights" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/blogs/:slug" element={<BlogDetailPage />} />
            <Route path="/blog-insights/:slug" element={<BlogDetailPage />} />

            {/* Careers & Job Applications */}
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/careers/:slug" element={<CareerDetailPage />} />

            {/* Contact, About, Packages */}
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/website-packages" element={<WebsitePackagesPage />} />

            {/* Dynamic CMS Page Routes */}
            <Route path="/pages/:slug" element={<DynamicPageView />} />
            <Route path="/:slug" element={<DynamicPageView />} />

            {/* Catch-all 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </RouteErrorBoundary>
    </PublicSiteLayout>
  );
}
