import React from 'react';
import {
  Sparkles,
  TrendingUp,
  BarChart2,
  Users2,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { FadeUp, StaggerContainer, StaggerItem } from '../common/ScrollReveal';

export default function WhyChooseUsSection() {
  const cards = [
    {
      title: 'Real-Time Analytics',
      desc: 'Stay ahead with accurate, real-time performance tracking and live visitor conversion monitoring.',
      icon: Activity,
      metric: 'Live Feed',
      metricSub: 'Sub-second updates',
    },
    {
      title: 'AI-Driven Growth',
      desc: 'Make smarter moves with accurate, real-time business insights and automated lead workflows.',
      icon: BarChart2,
      metric: '80% Automation',
      metricSub: '10% Operation Cost',
    },
    {
      title: 'Sync in Real Time',
      desc: 'Connect with your team and Master Admin CMS instantly to track project milestones and publish changes.',
      icon: Users2,
      metric: 'Instant Deploy',
      metricSub: 'Zero downtime sync',
    },
  ];

  const pills = [
    'Cost Effective',
    'Real-Time Insights',
    'Automation',
    'Data-Driven Decisions',
    'Faster Innovation',
  ];

  return (
    <section className="py-24 bg-[#F8FAFC] relative overflow-hidden border-b border-slate-200" id="why-us">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <FadeUp delay={0.05} className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BENEFITS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            Why <span className="text-blue-600">Choose Us</span>
          </h2>

          <p className="mt-3 text-base sm:text-lg text-[#64748B] leading-relaxed">
            Engineered with modern architecture, automated intelligence, and dedicated support for maximum performance.
          </p>
        </FadeUp>

        {/* 3 Clean Soft Neumorphic Benefit Cards */}
        <StaggerContainer
          staggerDelay={0.1}
          delayChildren={0.08}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12"
        >
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <StaggerItem
                key={idx}
                preset="card-reveal"
                className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  {/* Metric Dial / Badge container */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-6 shadow-xs group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8" />
                  </div>

                  {/* Highlights */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-3">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>{card.metric}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 font-normal">{card.metricSub}</span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0F172A] mb-3 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-sm text-[#64748B] leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Bottom Feature Pills */}
        <StaggerContainer
          staggerDelay={0.06}
          delayChildren={0.2}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {pills.map((pill, idx) => (
            <StaggerItem
              key={idx}
              preset="card-reveal"
              className="px-4 py-2 rounded-full bg-white border border-slate-200/90 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs flex items-center gap-2 hover:border-blue-400 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>{pill}</span>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
