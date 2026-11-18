import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import NeuralCoreVisual from '../ai-visuals/NeuralCoreVisual';
import {
  Sparkles,
  ArrowRight,
  Code2,
  Cpu,
  Workflow,
  CheckCircle2,
  Terminal,
  Zap,
} from 'lucide-react';

export default function AiHeroSection({ sliders = [], settings = {} }) {
  // If active slider exists in CMS, use dynamic title/subtitle/badge
  const activeSlider = sliders.find((s) => s.status === 'active') || sliders[0];

  const headline =
    activeSlider?.title ||
    'Building Intelligent Digital Experiences for the Future.';

  const description =
    activeSlider?.subtitle ||
    'I design and develop modern web applications, intelligent digital solutions, and performance-driven digital experiences that help businesses grow.';

  const badgeText =
    activeSlider?.badge ||
    'AI & FULL-STACK ENGINEERING STUDIO';

  const ctaPrimaryText = activeSlider?.ctaText || 'Explore My Services';
  const ctaPrimaryLink = activeSlider?.ctaLink || '/services';

  const ctaSecondaryText = activeSlider?.ctaSecondaryText || "Let's Work Together";
  const ctaSecondaryLink = activeSlider?.ctaSecondaryLink || '/contact';

  const techHighlights = [
    { label: 'Next.js & React 18', icon: Code2 },
    { label: 'AI & LLM Workflows', icon: Cpu },
    { label: 'Cloud Infrastructure', icon: Workflow },
    { label: 'Full-Stack Architecture', icon: Terminal },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#070D1F] text-white pt-28 pb-16 lg:py-24 border-b border-slate-800">
      {/* Cyber Grid Background & Ambient Lighting */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-blue-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full bg-cyan-500/15 blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* ================= LEFT COLUMN: HERO INFORMATION ================= */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Technology Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold tracking-widest uppercase backdrop-blur-md shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>{badgeText}</span>
            </motion.div>

            {/* Powerful Professional Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-[3.35rem] font-black text-white leading-[1.12] tracking-tight drop-shadow-sm"
            >
              {headline}
            </motion.h1>

            {/* Short Introduction */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal"
            >
              {description}
            </motion.p>

            {/* Two Clear Call-to-Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link
                to={ctaPrimaryLink}
                className="px-7 py-3.5 rounded-full font-bold text-sm sm:text-base text-white flex items-center gap-2.5 shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all"
                style={{ backgroundColor: 'var(--brand-primary, #3B66D4)' }}
              >
                <span>{ctaPrimaryText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to={ctaSecondaryLink}
                className="px-7 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all shadow-sm"
              >
                <span>{ctaSecondaryText}</span>
              </Link>
            </motion.div>

            {/* Relevant Technology Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-semibold text-slate-300"
            >
              {techHighlights.map((tech, idx) => {
                const IconComponent = tech.icon;
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <IconComponent className="w-3.5 h-3.5 text-cyan-300" />
                    <span>{tech.label}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* ================= RIGHT COLUMN: INTERACTIVE AI-INSPIRED VISUAL ================= */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <NeuralCoreVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

