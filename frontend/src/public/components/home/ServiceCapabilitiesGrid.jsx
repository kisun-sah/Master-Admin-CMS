import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { resolveMediaUrl } from '../../lib/api';
import { DEFAULT_CMS_FALLBACKS } from '../../config/defaultCmsFallbacks';
import {
  Sparkles,
  Star,
  ArrowRight,
  Clock,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

export default function ServiceCapabilitiesGrid({
  services = [],
  activeFilter = null,
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fallback to default services if none provided
  const rawServices =
    services && services.length > 0 ? services : DEFAULT_CMS_FALLBACKS.services;

  // Extract unique categories
  const categories = [
    'All',
    ...Array.from(new Set(rawServices.map((s) => s.category).filter(Boolean))),
  ];

  // Apply category filtering
  const filteredServices = rawServices.filter((s) => {
    if (activeFilter?.category && activeFilter.category !== '') {
      return s.category?.toLowerCase() === activeFilter.category.toLowerCase();
    }
    if (selectedCategory === 'All') return true;
    return s.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <section id="services-section" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-[var(--brand-primary,#3B66D4)] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Comprehensive Digital Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Our Core IT, Web Development, AI & Marketing Solutions
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Delivering production-grade bespoke software, headless CMS websites,
            autonomous AI workflows, and data-driven marketing campaigns tailored
            to scale your business.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${selectedCategory === cat
                    ? 'bg-[var(--brand-primary,#3B66D4)] text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3/4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => {
            const formattedNumber = String(index + 1).padStart(2, '0');
            const img = service.featuredImage
              ? resolveMediaUrl(service.featuredImage)
              : DEFAULT_CMS_FALLBACKS.services[index % DEFAULT_CMS_FALLBACKS.services.length].featuredImage;

            return (
              <div
                key={service._id || service.slug || index}
                className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col card-hover-lift"
              >
                {/* 4:3 Aspect Ratio Featured Image Header */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={img}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Gradient Overlay for Top Badges */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                  {/* Top-Left Step/Number Badge + Category */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-[var(--brand-primary,#3B66D4)] text-white font-extrabold text-xs flex items-center justify-center shadow-md">
                      {service.number || formattedNumber}
                    </span>
                    {service.category && (
                      <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                        {service.category}
                      </span>
                    )}
                  </div>

                  {/* Top-Right Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-slate-900 text-xs font-bold flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>5.0</span>
                  </div>

                  {/* Bottom Delivery Badge on Image */}
                  <div className="absolute bottom-3 left-3 text-white text-xs font-medium flex items-center gap-1.5 drop-shadow">
                    <Clock className="w-3.5 h-3.5 text-cyan-300" />
                    <span>{service.deliveryTime || 'Fast Delivery'}</span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Service Title */}
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[var(--brand-primary,#3B66D4)] transition-colors leading-snug">
                      {service.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                      {service.shortDescription ||
                        'Custom enterprise solutions equipped with Master Admin CMS, tailored integrations, and ongoing support.'}
                    </p>

                    {/* Feature Outcome Tags */}
                    {service.tags && service.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {service.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-2 py-0.5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer Row */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>CMS Included</span>
                    </div>

                    <Link
                      to={`/services/${service.slug}`}
                      className="btn-secondary-brand text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105 active:scale-95"
                    >
                      <span>Explore Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Consultation Link */}
        <div className="mt-14 text-center">
          <div className="inline-flex items-center gap-3 p-4 rounded-2xl bg-blue-50/70 border border-blue-100 max-w-xl mx-auto">
            <span className="text-xs sm:text-sm font-semibold text-slate-700">
              Need a tailored architecture or enterprise package for your team?
            </span>
            <Link
              to="/contact"
              className="text-xs sm:text-sm font-bold text-[var(--brand-primary,#3B66D4)] hover:underline whitespace-nowrap"
            >
              Get Free Quote &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

