import React from 'react';
import { Link } from 'react-router-dom';
import { useCms } from '../../context/CmsContext';
import { Sparkles, ArrowRight, MessageCircle, Phone, CheckCircle2 } from 'lucide-react';
import { FadeUp, ScaleIn } from '../common/ScrollReveal';

export default function BottomCtaBanner() {
  const { settings } = useCms();

  const phone = settings?.contactPhone || '01-4546038';
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScaleIn className="relative rounded-3xl p-8 sm:p-14 lg:p-16 overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/20 rounded-full blur-[100px] pointer-events-none" />

          {/* Left Text */}
          <div className="relative z-10 max-w-2xl text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-sm">
              Ready to Grow Your Business?
            </h2>

            <p className="text-base sm:text-lg text-blue-50 font-normal leading-relaxed mb-6">
              Let's create something amazing together. Transform your business with modern web engineering, AI automation, and high-impact digital marketing.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-4 rounded-full bg-white text-blue-600 hover:bg-slate-100 font-extrabold text-sm sm:text-base shadow-xl transition-transform hover:scale-105 active:scale-95 inline-flex items-center gap-2"
              >
                <span>Get a Free Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2 hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right AI Robot Graphic */}
          <div className="relative z-10 shrink-0 w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            <img
              src="/assets/illustrations/robot-analytics-dashboard.jpg"
              alt="AI Robot Digital Partner"
              className="w-full h-full object-cover rounded-3xl border-4 border-white/40 shadow-2xl transition-transform hover:scale-105 duration-500"
            />
          </div>
        </ScaleIn>
      </div>
    </section>
  );
}
