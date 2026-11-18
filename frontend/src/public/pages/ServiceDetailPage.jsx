import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEOHead from '../components/layout/SEOHead';
import LightboxModal from '../components/common/LightboxModal';
import ScrollReveal, { StaggerContainer, StaggerItem } from '../components/common/ScrollReveal';
import { getServiceBySlug, getServices, resolveMediaUrl } from '../lib/api';
import { useCms } from '../context/CmsContext';
import { DEFAULT_CMS_FALLBACKS } from '../config/defaultCmsFallbacks';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  PhoneCall,
  MessageCircle,
  Eye,
  Shield,
  Layers,
  ChevronDown,
  Workflow,
  Cpu,
  HelpCircle,
} from 'lucide-react';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { settings } = useCms();
  const [service, setService] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getServiceBySlug(slug);
        setService(data);

        // Fetch other services for the related section
        try {
          const all = await getServices();
          if (Array.isArray(all)) {
            const others = all.filter(
              (s) => s.slug !== slug && (!s.status || s.status === 'published')
            );
            setRelatedServices(others.slice(0, 3));
          }
        } catch (e) {
          // Ignored
        }
      } catch (err) {
        // Check in fallbacks
        const fb = DEFAULT_CMS_FALLBACKS.services.find((s) => s.slug === slug);
        if (fb) {
          setService(fb);
          setRelatedServices(
            DEFAULT_CMS_FALLBACKS.services.filter((s) => s.slug !== slug).slice(0, 3)
          );
        } else {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center min-h-[60vh] flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--brand-primary,#3B66D4)] border-t-transparent" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="pt-36 pb-24 text-center max-w-lg mx-auto px-4 min-h-[60vh] bg-[#F8FAFC]">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 mx-auto flex items-center justify-center mb-4">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Service Not Found</h2>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          The requested service could not be located or has been archived. Explore our active offerings below.
        </p>
        <Link
          to="/services"
          className="btn-primary-brand px-6 py-3 rounded-full text-sm font-bold inline-flex items-center gap-2 shadow-md text-white"
        >
          <span>&larr; Return to All Services</span>
        </Link>
      </div>
    );
  }

  const galleryImages = service.gallery || [];
  const rawPhone = settings?.contactPhone || '01-4546038';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');

  const defaultDeliverables = [
    'Custom Technical Architecture & Zero-Lockin Codebase',
    'Full Master Admin CMS Control over Layout & Content',
    'Core Web Vitals 95+ Performance Hardening & SEO Metadata',
    'Mobile Responsive Testing across Desktop, Tablet & Smartphones',
    'Production Cloud CI/CD Deployment with SSL & Security Headers',
    'Comprehensive Post-Launch Training & Direct Developer SLA',
  ];

  return (
    <div className="pt-28 pb-20 bg-[#F8FAFC] min-h-screen">
      <SEOHead
        title={`${service.title} — Enterprise IT & Web Solutions`}
        description={service.shortDescription}
        image={service.featuredImage}
        seoData={service.seo}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <ScrollReveal preset="fade-in" duration={0.35}>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link to="/" className="hover:text-[var(--brand-primary,#3B66D4)]">
              Home
            </Link>
            <span>/</span>
            <Link to="/services" className="hover:text-[var(--brand-primary,#3B66D4)]">
              Services
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold truncate max-w-xs">{service.title}</span>
          </div>
        </ScrollReveal>

        {/* Hero Section */}
        <ScrollReveal preset="fade-up" className="mb-10 max-w-4xl">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 badge-secondary"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{service.category || 'Enterprise Solution'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
            {service.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {service.shortDescription ||
              'High-converting architectural deliverable engineered with full Master Admin CMS management.'}
          </p>
        </ScrollReveal>

        {/* Featured Image Banner */}
        {service.featuredImage && (
          <ScrollReveal preset="fade-up" delay={0.1} className="aspect-[21/9] rounded-3xl overflow-hidden mb-12 bg-white border border-slate-200 shadow-xl">
            <img
              src={resolveMediaUrl(service.featuredImage)}
              alt={service.title}
              className="w-full h-full object-cover"
            />
          </ScrollReveal>
        )}

        {/* Main Grid: Content (8 cols) + Sticky Quote & CTA Sidebar (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Rich Content Overview */}
            <ScrollReveal preset="fade-up" className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Overview & Engineering Scope
              </h2>
              <div
                className="text-slate-700 leading-relaxed space-y-4 prose max-w-none text-sm sm:text-base"
                dangerouslySetInnerHTML={{
                  __html:
                    service.content ||
                    `<p>Our ${service.title} service provides complete end-to-end technical execution tailored to your specific organizational goals. From initial scoping and interactive wireframing through to full-stack code delivery, every component is engineered with enterprise reliability, fast page loads, and intuitive CMS control.</p>`,
                }}
              />
            </ScrollReveal>

            {/* Key Features & Deliverables Checklist */}
            <ScrollReveal preset="fade-up" className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CheckCircle2
                  className="w-5 h-5"
                  style={{ color: 'var(--brand-secondary, #06B6D4)' }}
                />
                <span>Key Deliverables & Capabilities</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {defaultDeliverables.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium"
                  >
                    <CheckCircle2
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: 'var(--brand-secondary, #06B6D4)' }}
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Delivery Process (4-Step Timeline) */}
            <ScrollReveal preset="fade-up" className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Workflow className="w-5 h-5 text-[var(--brand-primary,#3B66D4)]" />
                <span>Our Implementation Process</span>
              </h3>

              <div className="space-y-4">
                {[
                  {
                    step: '1. Scoping & Architecture',
                    detail: 'Detailed requirements gathering, data structure mapping, and wireframe approvals.',
                  },
                  {
                    step: '2. Agile Development Sprints',
                    detail: 'Iterative full-stack coding with live staging previews and automated test coverage.',
                  },
                  {
                    step: '3. QA, Security & CMS Setup',
                    detail: 'Cross-browser testing, SEO audit, security headers hardening, and admin onboarding.',
                  },
                  {
                    step: '4. Production Launch & Handover',
                    detail: 'Zero-downtime deployment, domain mapping, automated backups, and 24/7 SLA monitoring.',
                  },
                ].map((st, i) => (
                  <div key={i} className="flex gap-4 items-start pb-4 border-b border-slate-100 last:border-0">
                    <span
                      className="w-7 h-7 rounded-full text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: 'var(--brand-primary, #3B66D4)' }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{st.step}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{st.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Screenshots Gallery if available */}
            {galleryImages.length > 0 && (
              <ScrollReveal preset="fade-up" className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs">
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  Screenshots & Architecture Deliverables
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setLightboxIndex(idx)}
                      className="aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer relative group"
                    >
                      <img
                        src={resolveMediaUrl(img)}
                        alt={`Deliverable ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* Sticky Sidebar: Order & Consultation Request */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              {/* Consultation Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl relative overflow-hidden">
                <div
                  className="w-2.5 h-full absolute top-0 left-0"
                  style={{ backgroundColor: 'var(--brand-secondary, #06B6D4)' }}
                />

                <h3 className="text-xl font-bold text-slate-900 mb-2">Order This Solution</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Get a complete production deployment engineered to your business specifications with full Master Admin CMS control.
                </p>

                <div className="space-y-3 mb-6 text-xs text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Turnkey Production Deployment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Master Admin CMS Dynamic Control</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Core Web Vitals 95+ Score Target</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Direct Senior Technical Support</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    to={service.ctaLink || `/contact?service=${encodeURIComponent(service.title)}`}
                    className="w-full btn-secondary-brand py-3.5 px-4 text-sm font-bold flex items-center justify-center gap-2 shadow-md text-white text-center"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>{service.ctaLabel || 'Get a Consultation'}</span>
                  </Link>

                  <a
                    href={`https://wa.me/${cleanPhone}?text=Hi!%20I'm%20interested%20in%20the%20${encodeURIComponent(
                      service.title
                    )}%20service.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp: {rawPhone}</span>
                  </a>
                </div>
              </div>

              {/* Direct Help / Contact Info */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs text-xs space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-[var(--brand-primary,#3B66D4)]" />
                  <span>Immediate Phone Inquiry</span>
                </div>
                <div className="text-slate-600">Speak directly with our technical team:</div>
                <a
                  href={`tel:${cleanPhone}`}
                  className="block font-extrabold text-sm pt-1"
                  style={{ color: 'var(--brand-primary, #3B66D4)' }}
                >
                  {rawPhone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RELATED SERVICES SECTION ================= */}
        {relatedServices.length > 0 && (
          <ScrollReveal preset="fade-up" className="pt-10 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Related Services & Capabilities
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Complementary enterprise solutions to power your infrastructure.
                </p>
              </div>

              <Link
                to="/services"
                className="text-xs font-bold text-[var(--brand-primary,#3B66D4)] hover:underline flex items-center gap-1"
              >
                <span>View All Services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map((rel, idx) => (
                <Link
                  key={rel._id || idx}
                  to={`/services/${rel.slug}`}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs card-hover-lift group flex flex-col"
                >
                  <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 mb-3 relative">
                    <img
                      src={resolveMediaUrl(rel.featuredImage)}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {rel.category && (
                      <span
                        className="absolute top-2.5 left-2.5 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'var(--brand-primary, #3B66D4)' }}
                      >
                        {rel.category}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-[var(--brand-primary,#3B66D4)] transition-colors line-clamp-1 mb-1">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    {rel.shortDescription}
                  </p>
                  <div className="mt-auto pt-2 flex items-center text-xs font-bold text-[var(--brand-secondary,#06B6D4)]">
                    <span>Explore Solution</span>
                    <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>

      {/* Lightbox for Gallery */}
      {lightboxIndex !== null && (
        <LightboxModal
          images={galleryImages.map((img) => ({ imageUrl: img }))}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((p) => (p === 0 ? galleryImages.length - 1 : p - 1))}
          onNext={() => setLightboxIndex((p) => (p === galleryImages.length - 1 ? 0 : p + 1))}
        />
      )}
    </div>
  );
}
