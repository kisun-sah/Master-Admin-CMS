import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Bot,
  TrendingUp,
  Palette,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Layers,
  Workflow,
  Zap,
} from 'lucide-react';

export default function AiInteractiveServices({ services = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // 5 Core Primary Disciplines matching requirements
  const defaultFiveServices = [
    {
      _id: 'srv-web',
      number: '01',
      title: 'Full-Stack Web Development',
      slug: 'full-stack-web-cms',
      icon: Code2,
      category: 'Web Engineering',
      tagline: 'High-throughput SPAs, SSR & Headless CMS architectures.',
      description:
        'Architecting custom web applications using React, Next.js, Node.js, and MongoDB with integrated Master Admin CMS for instant content control.',
      features: [
        'Component-Driven Modern React & Next.js',
        'Scalable REST & GraphQL Microservices',
        'Headless Master CMS Integration',
        'Sub-Second Lighthouse Performance',
      ],
      metrics: { label: 'Avg. PageSpeed', value: '99/100' },
      accentColor: '#3B82F6',
    },
    {
      _id: 'srv-ai',
      number: '02',
      title: 'AI Integration & Automation',
      slug: 'ai-automation',
      icon: Bot,
      category: 'Artificial Intelligence',
      tagline: 'Autonomous AI chatbots, LLM workflows & n8n pipelines.',
      description:
        'Deploying bespoke AI assistants, retrieval-augmented generation (RAG), and zero-maintenance automation that answers leads and scales operations 24/7.',
      features: [
        'Custom GPT & Gemini Neural Assistants',
        'Autonomous Workflow Triggers via n8n & Python',
        'Contextual Customer Support Automation',
        'Private Knowledge Base Embeddings',
      ],
      metrics: { label: 'Operational Speed', value: '10x Faster' },
      accentColor: '#06B6D4',
    },
    {
      _id: 'srv-mkt',
      number: '03',
      title: 'Digital Marketing & SEO',
      slug: 'digital-marketing',
      icon: TrendingUp,
      category: 'Growth Marketing',
      tagline: 'Targeted Google Ads, Meta funnels & technical SEO ranking.',
      description:
        'Data-backed advertising campaigns and technical SEO optimizations engineered to maximize organic reach and convert qualified paying clients.',
      features: [
        'Data-Driven Google & Meta PPC Campaigns',
        'Full Technical On-Page & Schema SEO',
        'High-Converting Sales Funnel Architecture',
        'Real-Time Analytics & ROI Attribution',
      ],
      metrics: { label: 'Target ROAS', value: '4.5x+' },
      accentColor: '#10B981',
    },
    {
      _id: 'srv-design',
      number: '04',
      title: 'UI/UX & Graphic Design',
      slug: 'ui-ux-design',
      icon: Palette,
      category: 'Creative Design',
      tagline: 'Futuristic Figma prototypes, design systems & brand assets.',
      description:
        'Crafting human-centered user interfaces, high-fidelity Figma design systems, interactive prototypes, and high-impact social branding.',
      features: [
        'Complete Design Systems & Component Libraries',
        'High-Fidelity Interactive Figma Wireframes',
        'Mobile-First Touch & Gestural Ergonomics',
        'Brand Identity, Vector Graphics & Pitch Decks',
      ],
      metrics: { label: 'User Retention', value: '+68%' },
      accentColor: '#EC4899',
    },
    {
      _id: 'srv-cloud',
      number: '05',
      title: 'Custom Software & Cloud Solutions',
      slug: 'it-officer-cloud',
      icon: Cpu,
      category: 'Cloud & Infrastructure',
      tagline: 'Personal IT Officer, Linux DevOps, AWS cloud & networking.',
      description:
        'Dedicated technical operations management, AWS cloud hosting, zero-downtime CI/CD pipelines, database clustering, and security hardening.',
      features: [
        'Dedicated IT Officer & SysAdmin Consulting',
        'AWS, Docker & Linux Server Orchestration',
        'Zero-Downtime Database Backups & SLAs',
        'End-to-End Enterprise Cybersecurity Audits',
      ],
      metrics: { label: 'Target Uptime', value: '99.9%' },
      accentColor: '#8B5CF6',
    },
  ];

  // Map CMS services if available to keep slug dynamic
  const fiveServices = defaultFiveServices.map((def, idx) => {
    const match = services.find(
      (s) =>
        s.slug === def.slug ||
        s.title?.toLowerCase().includes(def.title.toLowerCase().split(' ')[0])
    );
    if (match) {
      return {
        ...def,
        title: match.title || def.title,
        slug: match.slug || def.slug,
        description: match.shortDescription || def.description,
      };
    }
    return def;
  });

  const activeService = fiveServices[activeIndex] || fiveServices[0];
  const ActiveIcon = activeService.icon;

  return (
    <section className="py-20 lg:py-28 bg-[#F8FAFC] border-b border-slate-200/80 relative overflow-hidden">
      {/* Subtle Background Cyber Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* ================= LEFT SIDE: 4-5 PRIMARY SERVICES LIST ================= */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-[var(--brand-primary,#3B66D4)] text-xs font-extrabold tracking-widest uppercase mb-3 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                <span>PRIMARY EXPERTISE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Intelligent Services Engineered to Scale
              </h2>

              <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                Focused on delivering high-impact web technologies, autonomous AI
                solutions, and conversion-driven digital marketing.
              </p>
            </div>

            {/* Interactive 5 Services Stack */}
            <div className="space-y-3 pt-2">
              {fiveServices.map((service, index) => {
                const Icon = service.icon;
                const isSelected = activeIndex === index;

                return (
                  <div
                    key={service._id}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => setActiveIndex(index)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative group ${
                      isSelected
                        ? 'bg-white border-blue-500/50 shadow-xl shadow-blue-500/10 translate-x-1'
                        : 'bg-white/80 hover:bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    {/* Left Active Accent Pill Indicator */}
                    {isSelected && (
                      <motion.div
                        layoutId="activeServiceBar"
                        className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full"
                        style={{ backgroundColor: service.accentColor }}
                      />
                    )}

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                          style={{
                            backgroundColor: `${service.accentColor}15`,
                            color: service.accentColor,
                          }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-slate-400">
                              {service.number}
                            </span>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {service.title}
                            </h3>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {service.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Explore Arrow Link */}
                      <Link
                        to={`/services/${service.slug}`}
                        aria-label={`Explore ${service.title}`}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm scale-105'
                            : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-700'
                        }`}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View All Services Link */}
            <div className="pt-2">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-primary,#3B66D4)] hover:text-blue-700 transition-colors group"
              >
                <span>View All 20+ Enterprise Services</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* ================= RIGHT SIDE: INTERACTIVE AI VISUAL CAPABILITY MONITOR ================= */}
          <div className="lg:col-span-6">
            <div className="relative bg-[#081226] text-white rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden">
              {/* Dynamic Glow responding to active service */}
              <div
                className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[100px] pointer-events-none transition-colors duration-500 opacity-30"
                style={{ backgroundColor: activeService.accentColor }}
              />

              {/* Top Status Bar */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10 relative z-10">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: activeService.accentColor }}
                  >
                    <ActiveIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase">
                      {activeService.category}
                    </span>
                    <h4 className="text-lg font-extrabold text-white">
                      {activeService.title}
                    </h4>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-400">
                    {activeService.metrics.label}
                  </div>
                  <div className="text-lg font-black text-emerald-400">
                    {activeService.metrics.value}
                  </div>
                </div>
              </div>

              {/* Dynamic Contextual Content with Smooth Transition */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="py-6 space-y-6 relative z-10"
                >
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                    {activeService.description}
                  </p>

                  {/* Architecture & Capabilities Checklist */}
                  <div className="space-y-2.5">
                    <div className="text-xs font-bold tracking-wider uppercase text-slate-400">
                      Engineering Deliverables
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeService.features.map((feat, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200"
                        >
                          <CheckCircle2
                            className="w-4 h-4 flex-shrink-0"
                            style={{ color: activeService.accentColor }}
                          />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Live Simulation / Terminal Signal Bar */}
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs font-mono text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Ready for production deployment</span>
                    </div>
                    <span className="text-[11px] text-cyan-400 font-semibold">
                      API v1 Verified
                    </span>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <Link
                      to={`/services/${activeService.slug}`}
                      className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{ backgroundColor: activeService.accentColor }}
                    >
                      <span>Explore {activeService.title} Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

