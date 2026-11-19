import React from 'react';
import { Link } from 'react-router-dom';
import { resolveMediaUrl } from '../../lib/api';
import { useCms } from '../../context/CmsContext';
import {
  Sparkles,
  ArrowRight,
  Bot,
  BarChart3,
  Lightbulb,
  Headphones,
  CheckCircle2,
} from 'lucide-react';
import { FadeUp, ScaleIn, StaggerContainer, StaggerItem } from '../common/ScrollReveal';

export default function AboutUsAgencySection() {
  const { settings } = useCms();

  const features = [
    {
      title: 'AI-Powered Strategies',
      desc: 'Stay ahead with intelligent solutions and automated digital growth.',
      icon: Bot,
      iconBg: 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-500/30',
      badgeColor: 'border-blue-100 bg-blue-50/50',
    },
    {
      title: 'Data-Driven Results',
      desc: 'Turn insights into verified revenue growth and high-converting traffic.',
      icon: BarChart3,
      iconBg: 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-cyan-500/30',
      badgeColor: 'border-cyan-100 bg-cyan-50/50',
    },
    {
      title: 'Creative Excellence',
      desc: 'High-impact digital designs and brand experiences that captivate clients.',
      icon: Lightbulb,
      iconBg: 'bg-gradient-to-tr from-violet-600 to-purple-600 text-white shadow-purple-500/30',
      badgeColor: 'border-purple-100 bg-purple-50/50',
    },
    {
      title: 'Dedicated Support',
      desc: 'Always here for you with 24/7 technical monitoring and priority SLA.',
      icon: Headphones,
      iconBg: 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-emerald-500/30',
      badgeColor: 'border-emerald-100 bg-emerald-50/50',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden border-b border-slate-200" id="about">
      {/* Subtle Ambient Radial Lighting for Premium Depth */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-100/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-cyan-100/35 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          {/* ================= LEFT COLUMN: INTRODUCTION ================= */}
          <FadeUp delay={0.05} className="lg:col-span-4 space-y-6 text-left">
            {/* Sleek Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/90 text-blue-600 text-xs font-bold tracking-widest uppercase shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <Sparkles className="w-3.5 h-3.5" />
              <span>ABOUT US</span>
            </div>

            {/* Title with Gradient Accent */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-[1.18]">
              Your Trusted Partner in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">
                Digital Growth
              </span>
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
              We are a modern digital technology &amp; software development studio specializing in high-performance web applications, Master Admin CMS websites, AI-powered automation, and data-driven marketing strategies that help businesses scale.
            </p>

            {/* Learn More Action Button */}
            <div className="pt-2">
              <Link
                to="/about"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </FadeUp>

          {/* ================= CENTER COLUMN: TEAM COLLABORATION IMAGE ================= */}
          <ScaleIn delay={0.15} className="lg:col-span-4 relative flex justify-center">
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="Digital Team Working Together"
                className="w-full h-[420px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />

              {/* Bottom Glass Tag */}
              <div className="absolute bottom-4 inset-x-4 bg-slate-900/85 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-xl text-white">
                <div className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400 mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Full-Stack Engineering &amp; AI</span>
                </div>
                <div className="text-sm font-bold text-slate-100">
                  Delivering Scalable Digital Experiences
                </div>
              </div>
            </div>
          </ScaleIn>

          {/* ================= RIGHT COLUMN: 4 FEATURE CARDS ================= */}
          <StaggerContainer
            staggerDelay={0.09}
            delayChildren={0.1}
            className="lg:col-span-4 space-y-3.5"
          >
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <StaggerItem
                  key={idx}
                  preset="card-reveal"
                  className="bg-[#F8FAFC] hover:bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 hover:border-blue-300/80 shadow-xs hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 flex items-start gap-4 group hover:-translate-y-0.5"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${feat.iconBg} flex items-center justify-center shrink-0 shadow-md transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-[#0F172A] mb-1 group-hover:text-blue-600 transition-colors">
                      {feat.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
