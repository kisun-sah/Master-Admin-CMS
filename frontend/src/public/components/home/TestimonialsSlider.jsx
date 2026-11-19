import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';
import { resolveMediaUrl } from '../../lib/api';
import { FadeUp, ScaleIn } from '../common/ScrollReveal';

export default function TestimonialsSlider({ testimonials = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  /*
   * CMS Testimonial Schema (Mongoose):
   *   clientName, clientRole, company, avatar, rating, quote, order, status, featured
   *
   * Map CMS fields → component display, with graceful fallbacks for older field names
   */
  const adminTestimonials = useMemo(() => {
    if (!Array.isArray(testimonials)) return [];
    return testimonials
      .filter((t) => !t.status || t.status === 'published')
      .map((t) => ({
        _id: t._id,
        clientName: t.clientName || 'Client',
        // CMS uses "clientRole"; fallback to legacy "clientPosition" / "role"
        clientRole: t.clientRole || t.clientPosition || t.role || '',
        // CMS uses "company"; fallback to legacy "companyName"
        company: t.company || t.companyName || '',
        // CMS uses "avatar"; fallback to legacy "avatarUrl"
        avatar: t.avatar || t.avatarUrl || '',
        rating: t.rating || 5,
        // CMS uses "quote"; fallback to legacy "content"
        quote: t.quote || t.content || '',
        featured: t.featured || false,
      }));
  }, [testimonials]);

  const hasAdminTestimonials = adminTestimonials.length > 0;

  // Fallback reviews (only shown if admin has 0 testimonials in DB)
  const defaultReviews = [
    {
      _id: 't-1',
      clientName: 'Sarah Johnson',
      clientRole: 'CEO',
      company: 'TechVision Global',
      rating: 5,
      quote:
        'AI Digital transformed our online presence. Their AI-driven strategies and custom web portal helped us grow our business faster than we expected!',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
    {
      _id: 't-2',
      clientName: 'David Vance',
      clientRole: 'Founder & Managing Director',
      company: 'Apex Media & Logistics',
      rating: 5,
      quote:
        'Fastest delivery and cleanest code architecture we have seen. The AI automation workflows alone save our support team over 15 hours every week.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    {
      _id: 't-3',
      clientName: 'Rahul Sharma',
      clientRole: 'Director of Technology',
      company: 'Horizon Systems',
      rating: 5,
      quote:
        'The Master Admin CMS portal completely streamlined our operations. We can manage content, analytics, and customer leads effortlessly in real time.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const items = hasAdminTestimonials ? adminTestimonials : defaultReviews;
  const total = items.length;

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  // Auto-advance every 5 seconds, pause on hover
  useEffect(() => {
    if (total < 2 || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, isHovered]);

  if (total === 0) return null;

  const current = items[currentIndex] || items[0];
  const avatarSrc = current.avatar ? resolveMediaUrl(current.avatar) : '';

  return (
    <section
      className="py-24 bg-[#F8FAFC] border-b border-slate-200 relative overflow-hidden"
      id="testimonials"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <FadeUp className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TESTIMONIALS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#172554] tracking-tight leading-tight">
            What Our <span className="text-blue-600">Clients Say</span>
          </h2>

          <p className="mt-3 text-base text-[#64748B]">
            Real stories. Real results from verified clients and business partners.
          </p>
        </FadeUp>

        {/* Testimonial Card */}
        <ScaleIn className="max-w-4xl mx-auto relative flex items-center justify-center">
          {/* Previous Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            className="hidden sm:flex absolute -left-6 lg:-left-12 z-20 w-12 h-12 rounded-full bg-white text-slate-700 hover:text-blue-600 shadow-lg border border-slate-200/90 items-center justify-center transition-all hover:scale-110 active:scale-95"
            aria-label="Previous Testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Testimonial Box */}
          <div className="w-full bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xl relative text-center flex flex-col items-center transition-all duration-500">
            {/* Quote Icon */}
            <Quote className="w-12 h-12 text-blue-200 mb-6" />

            {/* Quote Text — uses CMS "quote" field */}
            <p className="text-lg sm:text-2xl font-medium text-[#172554] leading-relaxed max-w-2xl mb-8 italic">
              &ldquo;{current.quote}&rdquo;
            </p>

            {/* Client Profile */}
            <div className="flex flex-col items-center">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={current.clientName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-600 shadow-md mb-3"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 font-extrabold text-xl flex items-center justify-center border-2 border-blue-600 shadow-md mb-3">
                  {current.clientName?.charAt(0) || 'C'}
                </div>
              )}

              <div className="font-extrabold text-slate-900 text-base sm:text-lg">
                {current.clientName}
              </div>

              <div className="text-xs text-blue-600 font-semibold mb-2">
                {current.clientRole || 'Client'}
                {current.company ? ` · ${current.company}` : ''}
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1">
                {[...Array(current.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          </div>

          {/* Next Arrow */}
          <button
            type="button"
            onClick={handleNext}
            className="hidden sm:flex absolute -right-6 lg:-right-12 z-20 w-12 h-12 rounded-full bg-white text-slate-700 hover:text-blue-600 shadow-lg border border-slate-200/90 items-center justify-center transition-all hover:scale-110 active:scale-95"
            aria-label="Next Testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </ScaleIn>

        {/* Pagination Dots + Mobile Controls */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {items.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => setCurrentIndex(dotIdx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                dotIdx === currentIndex ? 'w-7 bg-blue-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to testimonial ${dotIdx + 1}`}
            />
          ))}
        </div>

        {/* Source indicator */}
        {hasAdminTestimonials && (
          <p className="text-center mt-4 text-[10px] text-slate-400 uppercase tracking-widest">
            {total} verified client {total === 1 ? 'review' : 'reviews'} from CMS
          </p>
        )}
      </div>
    </section>
  );
}
