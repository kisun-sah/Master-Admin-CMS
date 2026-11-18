import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  Code2,
  CheckCircle2,
  PhoneCall,
  Zap,
} from 'lucide-react';
import { resolveMediaUrl, getServices } from '../../lib/api';
import { DEFAULT_CMS_FALLBACKS } from '../../config/defaultCmsFallbacks';

export default function ServiceMegaMenu({ isOpen, onClose, onMouseEnter, onMouseLeave }) {
  const [services, setServices] = useState(DEFAULT_CMS_FALLBACKS.services);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    let isMounted = true;
    async function loadServices() {
      try {
        const res = await getServices();
        if (isMounted && Array.isArray(res) && res.length > 0) {
          setServices(res.filter((s) => !s.status || s.status === 'published'));
        }
      } catch (e) {
        // Fallback pre-set
      }
    }
    loadServices();
    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamically extract categories
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

  const filteredServices =
    activeCategory === 'All'
      ? services
      : services.filter(
          (s) => (s.category || '').toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-full left-0 right-0 w-full bg-white text-slate-900 shadow-2xl border-t border-slate-100 z-50 rounded-b-2xl overflow-hidden"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            {/* Mega Menu Top Header Bar */}
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{ backgroundColor: 'var(--brand-secondary, #06B6D4)' }}
                />
                <h3 className="font-extrabold text-slate-900 text-sm tracking-wider uppercase">
                  Enterprise Solutions & Core Services
                </h3>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                  {services.length} Published Services
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  to="/services"
                  onClick={onClose}
                  className="text-xs font-bold text-[var(--brand-primary,#3B66D4)] hover:text-blue-700 flex items-center gap-1.5 transition-colors group"
                >
                  <span>View All Services</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Main Mega Menu Layout: Category Filter Tabs on Left + Service Grid in Center + CTA on Right */}
            <div className="grid grid-cols-12 gap-8">
              {/* Left Column: Category Pills */}
              {categories.length > 2 && (
                <div className="col-span-12 md:col-span-3 lg:col-span-2 space-y-1 pr-2 border-r border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Categories
                  </div>
                  {categories.map((cat) => {
                    const isSelected = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-blue-50 text-[var(--brand-primary,#3B66D4)] font-bold shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{cat}</span>
                        {isSelected && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Middle Grid: Dynamic Service Cards */}
              <div
                className={`col-span-12 ${
                  categories.length > 2 ? 'md:col-span-6 lg:col-span-7' : 'md:col-span-8 lg:col-span-9'
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[380px] overflow-y-auto pr-1">
                  {filteredServices.slice(0, 9).map((service, index) => {
                    const img = service.featuredImage
                      ? resolveMediaUrl(service.featuredImage)
                      : DEFAULT_CMS_FALLBACKS.services[index % DEFAULT_CMS_FALLBACKS.services.length]
                          ?.featuredImage;

                    return (
                      <Link
                        key={service._id || service.slug || index}
                        to={`/services/${service.slug}`}
                        onClick={onClose}
                        className="group p-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200 hover:shadow-md transition-all duration-200 flex flex-col"
                      >
                        {/* Thumbnail / Icon */}
                        <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-2.5 bg-slate-100">
                          {img ? (
                            <img
                              src={img}
                              alt={service.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Code2 className="w-6 h-6" />
                            </div>
                          )}
                          {service.category && (
                            <span
                              className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs"
                              style={{ backgroundColor: 'var(--brand-primary, #3B66D4)' }}
                            >
                              {service.category}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-[var(--brand-primary,#3B66D4)] transition-colors">
                          {service.title}
                        </h4>

                        {/* Description */}
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                          {service.shortDescription || 'Enterprise scalable deliverable with 24/7 SLA.'}
                        </p>

                        <div className="mt-auto pt-2 flex items-center text-[10px] font-bold text-[var(--brand-secondary,#06B6D4)]">
                          <span>Explore Solution</span>
                          <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Tailored Consultation Spotlight Banner */}
              <div
                className={`col-span-12 ${
                  categories.length > 2 ? 'md:col-span-3 lg:col-span-3' : 'md:col-span-4 lg:col-span-3'
                }`}
              >
                <div
                  className="h-full rounded-2xl p-5 text-white flex flex-col justify-between shadow-lg relative overflow-hidden"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--brand-primary, #3B66D4) 0%, #1E3A8A 100%)',
                  }}
                >
                  {/* Subtle background glow circle */}
                  <div
                    className="absolute -right-12 -top-12 w-36 h-36 rounded-full blur-2xl opacity-40 pointer-events-none"
                    style={{ backgroundColor: 'var(--brand-secondary, #06B6D4)' }}
                  />

                  <div className="relative z-10">
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 text-white"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.18)' }}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Enterprise Advisory</span>
                    </div>

                    <h4 className="font-extrabold text-base leading-snug text-white mb-2">
                      Need a Custom Architecture or Migration?
                    </h4>

                    <p className="text-xs text-blue-100 leading-relaxed mb-4">
                      Speak directly with our senior software engineers and IT consultants for tailored roadmaps.
                    </p>

                    <div className="space-y-1.5 text-[11px] text-blue-100 mb-5">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-300" />
                        <span>Fixed-Price & Sprint Retainers</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-300" />
                        <span>Dedicated IT & AI SLA Support</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 pt-2 border-t border-white/15">
                    <Link
                      to="/contact"
                      onClick={onClose}
                      className="w-full btn-secondary-brand py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 shadow-md text-white text-center"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Get a Free Consultation</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
