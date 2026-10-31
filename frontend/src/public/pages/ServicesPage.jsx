import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getServices, resolveMediaUrl } from '../lib/api';
import SEOHead from '../components/layout/SEOHead';
import {
  Sparkles,
  Code2,
  Cpu,
  TrendingUp,
  Server,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'All';

  useEffect(() => {
    async function load() {
      try {
        const data = await getServices();
        setServices(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Error loading services:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = [
    'All',
    'Custom Websites & CMS',
    'AI & Automation',
    'Digital Marketing & SEO',
    'IT Officer & Cloud Support',
  ];

  const filtered =
    currentCategory === 'All'
      ? services
      : services.filter(
          (s) =>
            s.category?.toLowerCase() === currentCategory.toLowerCase() ||
            s.title?.toLowerCase().includes(currentCategory.toLowerCase())
        );

  return (
    <div className="pt-28 pb-20 bg-[#090D16] min-h-screen">
      <SEOHead
        title="Services & Solutions — Full-Stack Web, AI & Digital Marketing"
        description="Explore our high-impact services: custom business websites with Master Admin CMS, intelligent AI chatbots, data-driven SEO & Ads, and IT Officer support."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enterprise Quality & Freelance Agility</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            IT, Web Dev, AI & Digital Marketing Services
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Choose a solution below to view full deliverables, architectural specs, or order your custom system.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-14">
          {categories.map((cat) => {
            const isSelected = currentCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSearchParams(cat === 'All' ? {} : { category: cat })}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? 'btn-primary-glow shadow-neon-cyan text-white'
                    : 'glass-panel text-slate-300 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((service, idx) => {
            const imageSrc = resolveMediaUrl(
              service.featuredImage ||
                'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'
            );

            return (
              <div
                key={idx}
                className="glass-card rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between group hover:border-cyan-500/40 transition-all duration-300 shadow-xl"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-slate-900 relative">
                    <img
                      src={imageSrc}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md glass-panel border border-white/10 text-[10px] font-bold text-cyan-400 bg-black/60">
                      {service.category || 'Professional IT'}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-3">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed mb-6">
                      {service.shortDescription}
                    </p>

                    {/* Deliverables */}
                    <div className="space-y-1.5 mb-6 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>Master Admin CMS Included</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>Ultra-Fast Responsive UI</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>Full Source Code & Deployment</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-white/5 flex items-center justify-between gap-3">
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-xs font-bold text-slate-300 hover:text-white inline-flex items-center gap-1"
                  >
                    <span>Full Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to={service.ctaLink || `/contact?service=${encodeURIComponent(service.title)}`}
                    className="px-4 py-2 rounded-xl btn-primary-glow text-xs font-bold shadow-neon-cyan"
                  >
                    {service.ctaLabel || 'Order Service'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
