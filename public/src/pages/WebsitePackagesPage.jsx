import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/layout/SEOHead';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  HelpCircle,
} from 'lucide-react';

export default function WebsitePackagesPage() {
  const packages = [
    {
      name: 'Starter Business Website',
      price: '$499',
      period: 'one-time investment',
      description: 'Ideal for local businesses, clinics, cafes, or consultants needing a fast, modern digital storefront.',
      badge: 'Fast Turnaround (3-5 Days)',
      popular: false,
      features: [
        '5 Custom Responsive Pages',
        'Master Admin CMS Control',
        'Mobile & Tablet Optimized',
        'Contact & Lead Capture Form',
        'Basic SEO & Meta Directives',
        '1 Month Dedicated SLA Support',
      ],
      ctaText: 'Order Starter Website',
    },
    {
      name: 'Professional CMS & Dynamic Platform',
      price: '$1,299',
      period: 'one-time investment',
      description: 'Our flagship solution for schools, hospitals, agencies, and growing companies requiring complete content control.',
      badge: 'Most Popular Choice',
      popular: true,
      features: [
        'Unlimited CMS Pages & Blocks',
        '35MB Video Hero Showreel Support',
        'Services & Portfolio Gallery Engine',
        'Tech Blog & News Architecture',
        '100/100 Core Web Vitals SEO',
        'Interactive AI Chatbot Integration',
        'Full Multi-Device Live Demo',
        '3 Months 24/7 IT Support',
      ],
      ctaText: 'Order Professional CMS',
    },
    {
      name: 'Enterprise Portal & Custom Web App',
      price: '$2,999',
      period: 'one-time investment',
      description: 'For e-commerce stores, healthcare portals, travel booking, and high-throughput web applications.',
      badge: 'Bespoke Architecture',
      popular: false,
      features: [
        'Custom MERN / Next.js Architecture',
        'Payment Gateways (Stripe / PayPal)',
        'Full Role-Based Access Control (RBAC)',
        'Private Uploads (35MB CV Dropzone)',
        'AWS Cloud Infrastructure & VPN Setup',
        'Automated Daily Encrypted Backups',
        'Comprehensive Admin Training & Docs',
        '6 Months Priority IT Officer SLA',
      ],
      ctaText: 'Order Enterprise Portal',
    },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#090D16] min-h-screen">
      <SEOHead
        title="Website Packages & Pricing — Turnkey Master Admin CMS Portals"
        description="Transparent pricing for custom business websites powered by the Master Admin CMS. Compare Starter, Professional, and Enterprise packages."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Investment</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready-to-Launch Website Packages
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Every package is built on our high-performance MERN stack and includes your own Master Admin CMS. No monthly platform lock-ins.
          </p>
        </div>

        {/* 3-Tier Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-20">
          {packages.map((pkg, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 border flex flex-col justify-between transition-all relative ${
                pkg.popular
                  ? 'glass-card border-cyan-500 shadow-neon-cyan lg:-translate-y-2'
                  : 'glass-panel border-white/10'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full btn-primary-glow text-xs font-bold shadow-lg">
                  {pkg.badge}
                </div>
              )}

              <div>
                <div className="text-lg font-bold text-white mb-2">{pkg.name}</div>
                <p className="text-xs text-slate-400 leading-relaxed min-h-[3rem] mb-6">
                  {pkg.description}
                </p>

                <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-white/10">
                  <span className="text-4xl font-extrabold text-white">{pkg.price}</span>
                  <span className="text-xs text-slate-400">{pkg.period}</span>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Included Deliverables:
                  </div>
                  {pkg.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Link
                  to={`/contact?package=${encodeURIComponent(pkg.name)}`}
                  className={`w-full py-3.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    pkg.popular
                      ? 'btn-primary-glow text-white shadow-neon-cyan'
                      : 'glass-panel border border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  <span>{pkg.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantees Box */}
        <div className="glass-panel rounded-3xl p-8 border border-white/10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-xs">
          <div>
            <ShieldCheck className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="font-bold text-white">Full Source Code Ownership</div>
            <div className="text-slate-400 mt-1">
              You own the repository, database, and all media rights forever.
            </div>
          </div>

          <div>
            <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="font-bold text-white">35MB Video & Media Engine</div>
            <div className="text-slate-400 mt-1">
              Embed stunning background video showreels and high-res imagery.
            </div>
          </div>

          <div>
            <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="font-bold text-white">Zero Monthly CMS Royalties</div>
            <div className="text-slate-400 mt-1">
              No proprietary monthly subscription fees like Shopify or Webflow.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
