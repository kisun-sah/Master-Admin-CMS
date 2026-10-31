import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { resolveMediaUrl } from '../../lib/api';
import {
  Code2,
  Cpu,
  TrendingUp,
  Server,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
  Globe,
  Share2,
  Database,
  ShieldCheck,
} from 'lucide-react';

export default function ServicesBento({ services = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Core 4 categories matching Screenshot 2
  const categories = [
    'All',
    'Custom Websites & CMS',
    'AI & Automation',
    'Digital Marketing & SEO',
    'IT Officer & Cloud Support',
  ];

  // Default structured services matching Screenshot 2
  const defaultServices = [
    {
      title: 'Full-Stack Website Development (MERN & CMS)',
      slug: 'full-stack-website-development',
      category: 'Custom Websites & CMS',
      shortDescription:
        'High-performance custom web applications, e-commerce storefronts, and business websites built with React, Next.js, Node.js, and powered 100% dynamically by the Master Admin CMS.',
      deliverables: ['Custom MERN Stack', 'Master Admin CMS Included', '35MB Video Hero Reels', 'Mobile Responsive UI'],
      bentoType: 'featured',
      ctaLabel: 'Order Website',
      ctaLink: '/contact?service=web-development',
    },
    {
      title: 'AI Integration & Smart Chatbots',
      slug: 'ai-integration-smart-chatbots',
      category: 'AI & Automation',
      shortDescription:
        'Embed intelligent LLM chatbots, automated OpenAI workflows, and AI customer support agents directly into your business website.',
      deliverables: ['OpenAI & Claude APIs', 'Trained on Your Docs', '24/7 Automated Support'],
      bentoType: 'ai',
      ctaLabel: 'Explore AI Solutions',
      ctaLink: '/contact?service=ai-integration',
    },
    {
      title: 'Digital Marketing, SEO & Social Ads',
      slug: 'digital-marketing-seo-social-ads',
      category: 'Digital Marketing & SEO',
      shortDescription:
        'Data-driven search engine optimization, Google Ads (PPC), Meta ads campaigns, and conversion rate optimization to scale your business leads.',
      deliverables: ['100/100 Technical SEO', 'Google & Meta Ads', 'High-Converting Landing Pages'],
      bentoType: 'marketing',
      ctaLabel: 'Get SEO Audit',
      ctaLink: '/contact?service=digital-marketing',
    },
    {
      title: 'IT Officer Consulting, Networking & Cloud Setup',
      slug: 'it-officer-networking-cloud-setup',
      category: 'IT Officer & Cloud Support',
      shortDescription:
        'Dedicated IT officer services, secure cloud architecture (AWS / DigitalOcean), domain DNS configuration, corporate email setup, and 24/7 disaster backup.',
      deliverables: ['Server & Cloud Hosting', 'Network Security & Firewalls', '24/7 Technical SLA'],
      bentoType: 'infra',
      ctaLabel: 'Consult IT Officer',
      ctaLink: '/contact?service=it-consulting',
    },
  ];

  // Merge CMS services if available
  const displayServices =
    services.length > 0
      ? services.map((s, idx) => ({
          ...s,
          bentoType: idx === 0 ? 'featured' : idx === 1 ? 'ai' : idx === 2 ? 'marketing' : 'infra',
          deliverables: [
            s.category || 'Professional IT',
            '100% Dynamic Control',
            'Full Documentation',
            'Production Ready',
          ],
        }))
      : defaultServices;

  // Filter based on selected tab
  const filtered =
    selectedCategory === 'All'
      ? displayServices
      : displayServices.filter(
          (s) =>
            s.category?.toLowerCase() === selectedCategory.toLowerCase() ||
            s.title?.toLowerCase().includes(selectedCategory.toLowerCase())
        );

  return (
    <section className="py-24 bg-[#090D16] relative overflow-hidden" id="services">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Core Capabilities & Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            IT, Web Development, AI & Digital Marketing Services
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            From complete business websites with dynamic CMS control to intelligent AI automation and high-ROI digital marketing campaigns.
          </p>
        </div>

        {/* Interactive Category Filter Pills (Matching Screenshot 2) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-14">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? 'btn-primary-glow shadow-neon-cyan text-white'
                    : 'glass-panel text-slate-300 hover:text-white hover:border-white/20'
                }`}
              >
                {cat === 'All' ? 'All Services' : cat}
              </button>
            );
          })}
        </div>

        {/* Bento Grid (Matching Screenshot 2 Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 1. Large Left Featured Card: Full-Stack Web Dev & CMS (Spans 6 cols, full height) */}
          {filtered[0] && (
            <div className="lg:col-span-6 glass-card rounded-3xl p-8 border border-white/10 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

              <div>
                {/* CMS Dashboard Preview Graphic */}
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0B0F19] mb-8 shadow-2xl p-4">
                  {/* Mock browser header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/20">
                      Master Admin CMS v2.0
                    </span>
                  </div>

                  {/* Mock Dashboard widgets inside card */}
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="glass-panel p-2.5 rounded-xl border border-white/5">
                      <div className="text-[10px] text-slate-400">Total Visits</div>
                      <div className="text-sm font-bold text-white">128.4K</div>
                    </div>
                    <div className="glass-panel p-2.5 rounded-xl border border-white/5">
                      <div className="text-[10px] text-slate-400">Conversion</div>
                      <div className="text-sm font-bold text-emerald-400">+18.2%</div>
                    </div>
                    <div className="glass-panel p-2.5 rounded-xl border border-white/5">
                      <div className="text-[10px] text-slate-400">Page Speed</div>
                      <div className="text-sm font-bold text-cyan-400">99/100</div>
                    </div>
                  </div>

                  {/* Code snippet overlay */}
                  <div className="rounded-lg bg-black/60 p-3 font-mono text-[11px] text-cyan-300/90 border border-cyan-500/10 overflow-hidden">
                    <code>
                      <span className="text-purple-400">const</span> website = <span className="text-purple-400">await</span> CMS.deploy({'{'}
                      <br />
                      &nbsp;&nbsp;stack: <span className="text-emerald-300">'MERN'</span>,
                      <br />
                      &nbsp;&nbsp;dynamicBlocks: <span className="text-amber-300">true</span>,
                      <br />
                      &nbsp;&nbsp;seoEngine: <span className="text-emerald-300">'100%'</span>
                      <br />
                      {'}'});
                    </code>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold mb-3">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{filtered[0].category || 'Web Engineering'}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                  {filtered[0].title}
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  {filtered[0].shortDescription}
                </p>

                {/* Key Deliverables Checkmarks */}
                <div className="grid grid-cols-2 gap-2 mb-8">
                  {filtered[0].deliverables?.map((item, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <Link
                  to={filtered[0].ctaLink || `/services/${filtered[0].slug}`}
                  className="px-6 py-3 btn-primary-glow font-bold text-sm inline-flex items-center gap-2 shadow-neon-cyan"
                >
                  <span>{filtered[0].ctaLabel || 'Order Website'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to={`/services/${filtered[0].slug}`}
                  className="text-sm font-semibold text-slate-300 hover:text-white inline-flex items-center gap-1"
                >
                  <span>View Details</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          )}

          {/* 2. Right Column (Spans 6 cols, stacked cards) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* Top Right Card: AI Integration & Smart Chatbots */}
            {filtered[1] && (
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 group">
                <div className="space-y-3 flex-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>{filtered[1].category || 'AI & Automation'}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {filtered[1].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {filtered[1].shortDescription}
                  </p>
                  <Link
                    to={`/services/${filtered[1].slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 pt-2"
                  >
                    <span>Learn More & Integration &rarr;</span>
                  </Link>
                </div>

                {/* 3D Glowing AI Brain Graphic */}
                <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl animate-pulse-glow" />
                  <div className="w-28 h-28 rounded-2xl glass-panel border border-indigo-500/30 flex flex-col items-center justify-center text-indigo-400 shadow-neon-indigo relative z-10">
                    <Cpu className="w-12 h-12 text-indigo-400 mb-1" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300">
                      GPT-4o Engine
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Row of 2 Small Bento Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Card 3: Digital Marketing & SEO */}
              {filtered[2] && (
                <div className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col justify-between group">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {filtered[2].title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {filtered[2].shortDescription}
                    </p>

                    {/* Social platform badges */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-slate-300">
                        Google Ads
                      </span>
                      <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-slate-300">
                        Technical SEO
                      </span>
                      <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-slate-300">
                        Meta Ads
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/services/${filtered[2].slug}`}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 pt-2 border-t border-white/5"
                  >
                    <span>View Deliverables &rarr;</span>
                  </Link>
                </div>
              )}

              {/* Card 4: IT Officer Consulting & Cloud */}
              {filtered[3] && (
                <div className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col justify-between group">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                      <Server className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {filtered[3].title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {filtered[3].shortDescription}
                    </p>

                    {/* Infrastructure badges */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-slate-300">
                        AWS Cloud
                      </span>
                      <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-slate-300">
                        Firewall & VPN
                      </span>
                      <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-slate-300">
                        24/7 SLA
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/services/${filtered[3].slug}`}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 pt-2 border-t border-white/5"
                  >
                    <span>View Support Plans &rarr;</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
