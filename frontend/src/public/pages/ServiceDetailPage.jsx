import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getServiceBySlug, resolveMediaUrl } from '../lib/api';
import { useCms } from '../context/CmsContext';
import SEOHead from '../components/layout/SEOHead';
import LightboxModal from '../components/common/LightboxModal';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Phone,
  MessageCircle,
  ShieldCheck,
  Zap,
  Clock,
  Eye,
} from 'lucide-react';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { settings } = useCms();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getServiceBySlug(slug);
        setService(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center text-slate-400 min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="pt-32 pb-20 text-center max-w-lg mx-auto px-4 min-h-[60vh]">
        <h2 className="text-2xl font-bold text-white mb-4">Service Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">
          The requested service could not be located or has been unpublished.
        </p>
        <Link to="/services" className="px-6 py-2.5 btn-primary-glow font-bold text-sm inline-block">
          &larr; Back to Services Catalog
        </Link>
      </div>
    );
  }

  const galleryImages = service.gallery || [];
  const whatsappNumber = settings?.contactPhone
    ? settings.contactPhone.replace(/[^0-9]/g, '')
    : '15550192834';

  return (
    <div className="pt-28 pb-20 bg-[#090D16] min-h-screen">
      <SEOHead
        title={`${service.title} — Services`}
        description={service.shortDescription}
        image={service.featuredImage}
        seoData={service.seo}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.title,
          description: service.shortDescription,
          provider: {
            '@type': 'ProfessionalService',
            name: settings?.siteName || 'NEXUS DEVS',
          },
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-8">
          <Link to="/" className="hover:text-cyan-400">Home</Link>
          <span>/</span>
          <Link to="/services" className="hover:text-cyan-400">Services</Link>
          <span>/</span>
          <span className="text-white font-medium">{service.title}</span>
        </div>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{service.category || 'Professional IT Solution'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            {service.title}
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
            {service.shortDescription}
          </p>
        </div>

        {/* Featured Image Banner */}
        {service.featuredImage && (
          <div className="aspect-[21/9] rounded-3xl overflow-hidden mb-12 bg-slate-900 border border-white/10 shadow-2xl">
            <img
              src={resolveMediaUrl(service.featuredImage)}
              alt={service.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Main Grid: Content (8 cols) + Sticky Quote Sidebar (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Rich Content */}
            <div className="glass-card rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Overview & Architectural Scope</h2>
              <div
                className="text-slate-300 leading-relaxed space-y-4 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: service.content || '<p>Full service documentation and specs available upon request.</p>' }}
              />
            </div>

            {/* Screenshot Gallery if available */}
            {galleryImages.length > 0 && (
              <div className="glass-card rounded-3xl p-8 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6">
                  Screenshots & Architecture Deliverables
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setLightboxIndex(idx)}
                      className="aspect-video rounded-xl overflow-hidden bg-slate-900 border border-white/10 cursor-pointer relative group"
                    >
                      <img
                        src={resolveMediaUrl(img)}
                        alt={`Screenshot ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye className="w-6 h-6 text-cyan-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar: Order & Quote Request */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-neon-cyan">
                <h3 className="text-xl font-bold text-white mb-2">
                  Order This Service
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Get a complete production deployment engineered to your business specifications with full Master Admin CMS control.
                </p>

                <div className="space-y-3 mb-6 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Turnkey MERN Deployment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>35MB Video Hero Showreel Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>100/100 Technical SEO Guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>24/7 Dedicated IT Officer SLA</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    to={service.ctaLink || `/contact?service=${encodeURIComponent(service.title)}`}
                    className="w-full py-3.5 btn-primary-glow font-bold text-sm flex items-center justify-center gap-2 shadow-neon-cyan"
                  >
                    <span>{service.ctaLabel || 'Request Quote & Order'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {settings?.contactPhone && (
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=Hi!%20I'm%20interested%20in%20ordering%20the%20${encodeURIComponent(service.title)}%20service.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat on WhatsApp Directly</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Direct Help Card */}
              <div className="glass-panel rounded-2xl p-6 border border-white/10 text-xs space-y-2">
                <div className="font-bold text-white flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <span>Immediate Phone Inquiry</span>
                </div>
                <div className="text-slate-400">
                  Speak directly with the lead developer / IT Officer:
                </div>
                <a
                  href={`tel:${settings?.contactPhone}`}
                  className="block text-cyan-400 font-bold text-sm pt-1"
                >
                  {settings?.contactPhone || '+1 (555) 019-2834'}
                </a>
              </div>
            </div>
          </div>
        </div>
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
