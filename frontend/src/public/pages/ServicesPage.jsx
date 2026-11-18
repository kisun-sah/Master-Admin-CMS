import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SEOHead from '../components/layout/SEOHead';
import ScrollReveal, { StaggerContainer, StaggerItem } from '../components/common/ScrollReveal';
import { getServices, resolveMediaUrl, getFaqs } from '../lib/api';
import { DEFAULT_CMS_FALLBACKS } from '../config/defaultCmsFallbacks';
import { useCms } from '../context/CmsContext';
import {
  Sparkles,
  ArrowRight,
  Layers,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Clock,
  PhoneCall,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  Code2,
  Workflow,
  Server,
  Headphones,
} from 'lucide-react';

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { settings } = useCms();
  const [services, setServices] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const currentCategory = searchParams.get('category') || 'All';

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [servicesRes, faqsRes] = await Promise.allSettled([
          getServices(),
          getFaqs(),
        ]);

        if (servicesRes.status === 'fulfilled' && Array.isArray(servicesRes.value) && servicesRes.value.length > 0) {
          setServices(servicesRes.value.filter((s) => !s.status || s.status === 'published'));
        } else {
          setServices(DEFAULT_CMS_FALLBACKS.services);
        }

        if (faqsRes.status === 'fulfilled' && Array.isArray(faqsRes.value) && faqsRes.value.length > 0) {
          setFaqs(faqsRes.value.filter((f) => !f.status || f.status === 'published'));
        } else {
          setFaqs(DEFAULT_CMS_FALLBACKS.faqs || []);
        }
      } catch (e) {
        setServices(DEFAULT_CMS_FALLBACKS.services);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Dynamic categories from services
  const categories = [
    'All',
    ...Array.from(
      new Set(
        services
          .map((s) => s.category)
          .filter(Boolean)
          .map((c) => c.trim())
      )
    ),
  ];

  const filtered =
    currentCategory === 'All'
      ? services
      : services.filter(
          (s) =>
            s.category?.toLowerCase() === currentCategory.toLowerCase() ||
            s.title?.toLowerCase().includes(currentCategory.toLowerCase())
        );

  const rawPhone = settings?.contactPhone || '01-4546038';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');

  return (
    <div className="pt-28 pb-24 bg-white min-h-screen">
      <SEOHead
        title="Our Services & Enterprise Solutions — Full-Stack Web, AI & Cloud"
        description="Explore our high-impact services: custom business websites with Master Admin CMS, intelligent AI chatbots, data-driven SEO & Ads, and IT Officer support."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <ScrollReveal preset="fade-in" duration={0.4}>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link to="/" className="hover:text-[var(--brand-primary,#3B66D4)] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Our Services</span>
          </div>
        </ScrollReveal>

        {/* Hero Section */}
        <ScrollReveal preset="fade-up" className="text-center max-w-3xl mx-auto mb-12">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 badge-secondary"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enterprise Solutions & Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Comprehensive Digital, AI & Cloud Services
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            From bespoke web engineering and custom Master Admin CMS platforms to cutting-edge AI automation
            and resilient cloud infrastructure. Built for scalability, speed, and real business results.
          </p>
        </ScrollReveal>

        {/* Category Filter Pills */}
        {categories.length > 1 && (
          <ScrollReveal preset="fade-up" delay={0.1} className="flex flex-wrap items-center justify-center gap-2 mb-14">
            {categories.map((cat) => {
              const isSelected = currentCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSearchParams(cat === 'All' ? {} : { category: cat })}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
                    isSelected
                      ? 'bg-[var(--brand-primary,#3B66D4)] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </ScrollReveal>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="py-24 text-center">
            <div className="animate-spin w-10 h-10 border-4 border-[var(--brand-primary,#3B66D4)] border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-400">Loading catalog...</p>
          </div>
        )}

        {/* ================= SERVICES CARDS GRID ================= */}
        {!loading && (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {filtered.map((service, idx) => {
              const imageSrc = resolveMediaUrl(
                service.featuredImage ||
                  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'
              );

              return (
                <StaggerItem key={service._id || idx}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="group block bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs card-hover-lift h-full flex flex-col"
                  >
                    {/* 1. Rounded Thumbnail with Hover Zoom */}
                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 mb-4 relative shadow-xs">
                      <img
                        src={imageSrc}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                      {service.category && (
                        <span
                          className="absolute top-3 left-3 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm"
                          style={{ backgroundColor: 'var(--brand-primary, #3B66D4)' }}
                        >
                          {service.category}
                        </span>
                      )}
                      {service.featured && (
                        <span
                          className="absolute top-3 right-3 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm"
                          style={{ backgroundColor: 'var(--brand-secondary, #06B6D4)' }}
                        >
                          Featured
                        </span>
                      )}
                    </div>

                    {/* 2. Service Title */}
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[var(--brand-primary,#3B66D4)] transition-colors leading-snug line-clamp-1 mb-2">
                      {service.title}
                    </h3>

                    {/* 3. Description: 2 lines */}
                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-grow">
                      {service.shortDescription ||
                        'Full deliverables, automated architecture, high-security cloud, and custom CMS integration.'}
                    </p>

                    {/* 4. Action Row */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-600">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        <span>Deliverables & SLA</span>
                      </span>

                      <span
                        className="flex items-center gap-1 font-bold group-hover:translate-x-1 transition-transform"
                        style={{ color: 'var(--brand-secondary, #06B6D4)' }}
                      >
                        <span>Learn More</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}

        {/* ================= WHY CHOOSE OUR SERVICES SECTION ================= */}
        <ScrollReveal preset="fade-up" className="mb-24 bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200/70">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 badge-secondary"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Enterprise Standards</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Global Businesses Trust Our Engineering
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              We engineer mission-critical digital systems with precision architecture, clean code, and guaranteed SLAs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Code2 className="w-6 h-6 text-white" />,
                title: 'Clean Architecture',
                desc: 'Modular, maintainable codebase written in modern full-stack MERN with zero technical debt.',
              },
              {
                icon: <Zap className="w-6 h-6 text-white" />,
                title: 'High Performance & Speed',
                desc: 'Sub-second load times, optimized bundle sizes, and Core Web Vitals 95+ score compliance.',
              },
              {
                icon: <Workflow className="w-6 h-6 text-white" />,
                title: 'Master Admin CMS Control',
                desc: 'Full dynamic control over all content, sliders, pages, and metadata without developer dependency.',
              },
              {
                icon: <Headphones className="w-6 h-6 text-white" />,
                title: 'Dedicated SLA & Support',
                desc: '24/7 uptime monitoring, automated backups, and direct engineer access for enterprise retainers.',
              },
            ].map((pillar, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-sm"
                  style={{ backgroundColor: 'var(--brand-primary, #3B66D4)' }}
                >
                  {pillar.icon}
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-2">{pillar.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* ================= SERVICE DELIVERY PROCESS SECTION ================= */}
        <ScrollReveal preset="fade-up" className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 badge-secondary"
            >
              <Workflow className="w-3.5 h-3.5" />
              <span>Methodology & Roadmap</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Our 4-Phase Delivery Framework
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              A transparent, agile workflow designed to deliver enterprise software on schedule and within budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Discovery & Scoping',
                desc: 'We analyze your business workflows, define technical requirements, and map deliverables.',
              },
              {
                step: '02',
                title: 'UI/UX & Architecture',
                desc: 'Interactive Figma prototypes, design systems, and database schema architectural planning.',
              },
              {
                step: '03',
                title: 'Agile Development',
                desc: 'Sprint-based engineering with continuous deployment, code reviews, and bi-weekly demos.',
              },
              {
                step: '04',
                title: 'QA, Launch & Scale',
                desc: 'Automated testing, security hardening, CMS training, and 24/7 post-launch SLA monitoring.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs card-hover-lift"
              >
                <div
                  className="text-3xl font-black mb-3"
                  style={{ color: 'var(--brand-secondary, #06B6D4)' }}
                >
                  {item.step}
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-2">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* ================= FAQ SECTION ================= */}
        {faqs.length > 0 && (
          <ScrollReveal preset="fade-up" className="mb-24 max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 badge-secondary"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Everything You Need to Know
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.slice(0, 6).map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={faq._id || index}
                    className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between text-sm sm:text-base font-bold text-slate-900 hover:text-[var(--brand-primary,#3B66D4)] transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ml-3 ${
                          isOpen ? 'rotate-180 text-[var(--brand-primary,#3B66D4)]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        )}

        {/* ================= BOTTOM CONSULTATION CTA BANNER ================= */}
        <ScrollReveal preset="fade-up" className="rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, var(--brand-primary, #3B66D4) 0%, #0F172A 100%)',
          }}
        >
          {/* Decorative glowing sphere */}
          <div
            className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full blur-3xl opacity-40 pointer-events-none"
            style={{ backgroundColor: 'var(--brand-secondary, #06B6D4)' }}
          />

          <div className="relative z-10 max-w-3xl">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Custom Engineering Inquiries</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Ready to Accelerate Your Enterprise Architecture?
            </h2>

            <p className="text-sm sm:text-base text-blue-100 leading-relaxed mb-8 max-w-2xl">
              Schedule a direct consultation with our technical specialists to scope your requirements, review architecture,
              and receive a comprehensive milestone roadmap.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/contact"
                className="btn-secondary-brand px-7 py-3 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg text-white"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Get a Free Consultation</span>
              </Link>

              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center gap-2 border border-white/20 backdrop-blur-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: {rawPhone}</span>
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
