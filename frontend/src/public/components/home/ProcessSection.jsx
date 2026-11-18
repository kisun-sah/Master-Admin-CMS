import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';

export default function ProcessSection() {
  const steps = [
    {
      number: '01',
      title: 'Discover',
      desc: 'Understand your business goals, target audience, and system architecture.',
    },
    {
      number: '02',
      title: 'Strategy',
      desc: 'Plan the perfect technical blueprint, UX journey, and growth roadmap.',
    },
    {
      number: '03',
      title: 'Execute',
      desc: 'Bring ideas to life with clean code, modern CMS, and automated testing.',
    },
    {
      number: '04',
      title: 'Grow',
      desc: 'Measure performance, optimize conversions, and scale your business.',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#F8FAFC] relative overflow-hidden border-b border-slate-200" id="process">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 -left-20 w-96 h-96 bg-blue-100/50 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-cyan-100/40 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          {/* ================= LEFT: 4-STEP PROCESS (BALANCED 2x2 GRID) ================= */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/90 text-blue-600 text-xs font-bold tracking-widest uppercase mb-4 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <Sparkles className="w-3.5 h-3.5" />
                <span>OUR PROCESS</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-[1.18]">
                How <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">We Work</span>
              </h2>

              <p className="mt-3 text-base sm:text-lg text-[#64748B] max-w-2xl leading-relaxed">
                A simple, transparent process to achieve your digital and technology goals with measurable ROI.
              </p>
            </div>

            {/* Timeline Steps in a Spacious, Uncramped 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-300 transition-all duration-300 flex flex-col items-start text-left group hover:-translate-y-1"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-sm flex items-center justify-center mb-4 shadow-md shadow-blue-500/25 group-hover:scale-110 transition-transform">
                    {step.number}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mb-1.5 group-hover:text-blue-600 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ================= RIGHT: ROBOT ANALYTICS DASHBOARD ================= */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
              <img
                src="/assets/illustrations/robot-analytics-dashboard.jpg"
                alt="AI Robot Analytics Dashboard"
                className="w-full h-[360px] sm:h-[420px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Floating "Grow Together" Glass Pill */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-slate-200/90 shadow-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">
                    Grow Together
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    Continuous ROI
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
