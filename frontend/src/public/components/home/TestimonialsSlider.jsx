import React, { useState } from 'react';
import { resolveMediaUrl } from '../../lib/api';
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function TestimonialsSlider({ testimonials = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const defaultReviews = [
    {
      clientName: 'Sarah Jenkins',
      clientPosition: 'Founder & CEO',
      companyName: 'Lumina Health Clinics',
      content:
        'Working with this studio was a game-changer. They built our entire clinic portal with the Master Admin CMS in under 3 weeks. Our patients love the speed, and our staff can update doctor schedules effortlessly.',
      rating: 5,
      avatarUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    },
    {
      clientName: 'Marcus Vance',
      clientPosition: 'Director of E-Commerce',
      companyName: 'Aura Apparel Co.',
      content:
        'The dynamic video hero reel and instant load times increased our online checkout conversions by 34%. Having full admin control without relying on ongoing developer billings is priceless.',
      rating: 5,
      avatarUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    },
    {
      clientName: 'Elena Rostova',
      clientPosition: 'VP of Operations',
      companyName: 'Skyline Logistics',
      content:
        'Outstanding IT officer expertise! They audited our internal network, migrated our databases to encrypted AWS clusters, and set up an automated backup pipeline. Highest recommendation.',
      rating: 5,
      avatarUrl:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    },
  ];

  const items = testimonials.length > 0 ? testimonials : defaultReviews;
  const current = items[currentIndex] || items[0];

  const prev = () => {
    setCurrentIndex((c) => (c === 0 ? items.length - 1 : c - 1));
  };

  const next = () => {
    setCurrentIndex((c) => (c === items.length - 1 ? 0 : c + 1));
  };

  return (
    <section className="py-24 bg-[#070A10] border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Proven Client Results</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Trusted by Business Owners Worldwide
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Real feedback from clients who ordered custom websites, AI automation, and IT solutions.
          </p>
        </div>

        {/* Carousel Review Card */}
        <div className="max-w-3xl mx-auto">
          <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/15 relative shadow-2xl">
            <Quote className="w-12 h-12 text-cyan-500/20 absolute top-8 right-8 pointer-events-none" />

            {/* Stars */}
            <div className="flex items-center gap-1 mb-6">
              {[...Array(current.rating || 5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-amber-400 fill-amber-400 drop-shadow-sm"
                />
              ))}
            </div>

            {/* Review Content */}
            <p className="text-lg sm:text-xl text-slate-200 leading-relaxed italic mb-8">
              "{current.content}"
            </p>

            {/* Client Info */}
            <div className="flex items-center justify-between border-t border-white/10 pt-6">
              <div className="flex items-center gap-4">
                <img
                  src={resolveMediaUrl(
                    current.avatarUrl ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
                  )}
                  alt={current.clientName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400/50"
                />
                <div>
                  <div className="font-bold text-white text-base">
                    {current.clientName}
                  </div>
                  <div className="text-xs text-slate-400">
                    {current.clientPosition}
                    {current.companyName && ` • ${current.companyName}`}
                  </div>
                </div>
              </div>

              {/* Navigation arrows */}
              {items.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={prev}
                    aria-label="Previous review"
                    className="p-2 rounded-xl glass-panel border border-white/10 text-slate-300 hover:text-white hover:border-cyan-400 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next review"
                    className="p-2 rounded-xl glass-panel border border-white/10 text-slate-300 hover:text-white hover:border-cyan-400 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
