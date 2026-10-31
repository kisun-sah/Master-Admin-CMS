import React from 'react';
import { Link } from 'react-router-dom';
import { useCms } from '../../context/CmsContext';
import { Sparkles, ArrowRight, MessageCircle, Phone, CheckCircle2 } from 'lucide-react';

export default function BottomCtaBanner() {
  const { settings } = useCms();

  const whatsappNumber = settings?.contactPhone
    ? settings.contactPhone.replace(/[^0-9]/g, '')
    : '15550192834';

  return (
    <section className="py-20 bg-[#090D16] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl p-8 sm:p-14 lg:p-16 overflow-hidden border border-cyan-500/30 bg-gradient-to-tr from-[#0D1322] via-[#111827] to-[#162032] shadow-2xl shadow-cyan-500/10">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Turnkey Development & Digital Marketing</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Ready to Launch Your Website or Scale Your Business with AI & Digital Growth?
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
              Whether you need a high-converting business website with your own Master Admin CMS, an intelligent AI customer chatbot, or 24/7 dedicated IT Officer support, we are ready to build it.
            </p>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>100% Dynamic CMS Control</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Ultra-Fast Page Speeds (99+)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Guaranteed 24/7 Technical SLA</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-4 btn-primary-glow font-bold text-base shadow-neon-cyan inline-flex items-center gap-2"
              >
                <span>Order a Website / Hire Me</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/gallery"
                className="px-7 py-4 rounded-full glass-panel border border-white/20 text-white font-semibold text-base hover:bg-white/10 transition-all"
              >
                Explore Ready Templates
              </Link>

              {settings?.contactPhone && (
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-white font-semibold text-sm transition-all inline-flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
