import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { resolveMediaUrl } from '../../lib/api';
import { FadeUp, ScaleIn } from '../common/ScrollReveal';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Play,
  TrendingUp,
  Bot,
  Zap,
} from 'lucide-react';

export default function HeroBanner({ sliders = [], loading = false }) {
  // 1. Sort active sliders deterministically by configured order
  const activeSliders = useMemo(() => {
    if (!Array.isArray(sliders)) return [];
    return [...sliders]
      .filter((s) => s.status === 'active')
      .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  }, [sliders]);

  // Check for active video slide
  const videoSlide = useMemo(() => {
    return activeSliders.find(
      (s) => s.mediaType === 'video' && Boolean(s.mediaUrl)
    );
  }, [activeSliders]);

  // Check for image slides (when video is off/inactive)
  const imageSlides = useMemo(() => {
    return activeSliders.filter(
      (s) => s.mediaType === 'image' && Boolean(s.mediaUrl)
    );
  }, [activeSliders]);

  const isVideoMode = Boolean(videoSlide);
  const isImageSliderMode = !isVideoMode && imageSlides.length > 0;

  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    setVideoError(false);
  }, [videoSlide?.mediaUrl]);

  // Active slide index for image carousel - ALWAYS deterministically initialized to 0
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Keep index within range if slides count changes
  useEffect(() => {
    setCurrentSlideIndex(0);
  }, [imageSlides.length]);

  // Predictable Multi-Slide Interval with pause on hover
  useEffect(() => {
    if (!isImageSliderMode || imageSlides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % imageSlides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isImageSliderMode, imageSlides.length, isPaused]);

  // =========================================================================
  // LOADING STATE: Prevent abrupt content flash on page refresh
  // =========================================================================
  if (loading && sliders.length === 0) {
    return (
      <section className="relative w-full h-[90vh] min-h-[640px] bg-slate-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 animate-pulse" />
        <div className="relative z-10 flex flex-col items-center gap-3 text-white/70">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest font-semibold">Loading Experience...</span>
        </div>
      </section>
    );
  }

  const activeSlide = isVideoMode
    ? videoSlide
    : isImageSliderMode
    ? imageSlides[currentSlideIndex] || imageSlides[0]
    : null;

  const handlePrevSlide = () => {
    if (imageSlides.length > 1) {
      setCurrentSlideIndex(
        (prev) => (prev - 1 + imageSlides.length) % imageSlides.length
      );
    }
  };

  const handleNextSlide = () => {
    if (imageSlides.length > 1) {
      setCurrentSlideIndex((prev) => (prev + 1) % imageSlides.length);
    }
  };

  // =========================================================================
  // CASE A: USER UPLOADED ACTIVE VIDEO SLIDE IN CMS
  // =========================================================================
  if (isVideoMode) {
    return (
      <section className="relative w-full overflow-hidden bg-slate-900">
        <div className="relative w-full h-[90vh] min-h-[640px] flex items-center justify-center">
          <div className="absolute inset-0 z-0 overflow-hidden">
            {!videoError ? (
              <video
                key={videoSlide.mediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                onError={() => setVideoError(true)}
              >
                {videoSlide.mobileMediaUrl && (
                  <source
                    src={resolveMediaUrl(videoSlide.mobileMediaUrl)}
                    media="(max-width: 767px)"
                    type="video/mp4"
                  />
                )}
                <source
                  src={resolveMediaUrl(videoSlide.mediaUrl)}
                  type="video/mp4"
                />
              </video>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-[#070D1F] via-[#0A192F] to-[#0F172A]">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-indigo-600/20 via-cyan-500/20 to-purple-600/15 rounded-full blur-[140px]" />
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px]" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]" />
          </div>

          {activeSlide && (
            <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white flex flex-col items-center">
              {activeSlide.badge && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-cyan-300 text-xs sm:text-sm font-bold tracking-wider uppercase mb-5 shadow-sm">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>{activeSlide.badge}</span>
                </div>
              )}
              {activeSlide.title && (
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-4 drop-shadow-md text-white max-w-4xl">
                  {activeSlide.title}
                </h1>
              )}
              {activeSlide.subtitle && (
                <p className="text-sm sm:text-lg lg:text-xl text-slate-200 max-w-3xl mb-8 leading-relaxed font-normal drop-shadow">
                  {activeSlide.subtitle}
                </p>
              )}
              {activeSlide.ctaText && (
                <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                  <Link
                    to={activeSlide.ctaLink || '/services'}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-full shadow-lg shadow-blue-500/30 flex items-center gap-2 text-sm sm:text-base transition-transform hover:scale-105 active:scale-95"
                  >
                    <span>{activeSlide.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  {activeSlide.ctaSecondaryText && (
                    <Link
                      to={activeSlide.ctaSecondaryLink || '/contact'}
                      className="bg-white/15 hover:bg-white hover:text-slate-900 text-white font-bold px-7 py-3.5 rounded-full backdrop-blur-md border border-white/30 text-sm sm:text-base transition-all hover:scale-105 active:scale-95 shadow-md"
                    >
                      {activeSlide.ctaSecondaryText}
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }

  // =========================================================================
  // CASE B: USER UPLOADED ACTIVE IMAGE SLIDES IN CMS
  // =========================================================================
  if (isImageSliderMode) {
    return (
      <section
        className="relative w-full overflow-hidden bg-slate-900"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative w-full h-[90vh] min-h-[640px] flex items-center justify-center">
          <div className="absolute inset-0 z-0 overflow-hidden">
            {imageSlides.map((slide, idx) => (
              <div
                key={slide._id || idx}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  idx === currentSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img
                  src={resolveMediaUrl(slide.mediaUrl)}
                  alt={slide.title || 'Hero Banner'}
                  className="w-full h-full object-cover transform scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-black/45" />
              </div>
            ))}

            {imageSlides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 backdrop-blur-md flex items-center justify-center transition-all shadow-lg"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 backdrop-blur-md flex items-center justify-center transition-all shadow-lg"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                  {imageSlides.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setCurrentSlideIndex(dotIdx)}
                      className={`h-2 rounded-full transition-all ${
                        dotIdx === currentSlideIndex
                          ? 'w-6 bg-white'
                          : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {activeSlide && (
            <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white flex flex-col items-center">
              {activeSlide.badge && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-cyan-300 text-xs sm:text-sm font-bold tracking-wider uppercase mb-5 shadow-sm">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>{activeSlide.badge}</span>
                </div>
              )}
              {activeSlide.title && (
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-4 drop-shadow-md text-white max-w-4xl">
                  {activeSlide.title}
                </h1>
              )}
              {activeSlide.subtitle && (
                <p className="text-sm sm:text-lg lg:text-xl text-slate-200 max-w-3xl mb-8 leading-relaxed font-normal drop-shadow">
                  {activeSlide.subtitle}
                </p>
              )}
              {activeSlide.ctaText && (
                <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                  <Link
                    to={activeSlide.ctaLink || '/services'}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-full shadow-lg shadow-blue-500/30 flex items-center gap-2 text-sm sm:text-base transition-transform hover:scale-105 active:scale-95"
                  >
                    <span>{activeSlide.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }

  // =========================================================================
  // CASE C: LIGHT THEME AGENCY HERO (Matches Reference Image media_1794930772884_e06a2e4a.jpg)
  // =========================================================================
  const headline = 'Grow Your Business with AI-Powered Digital Marketing';
  const subtitle =
    'Smart strategies. Powerful technology. Real results. Let’s build your digital success together.';
  const badgeText = 'NEXT-GEN DIGITAL SOLUTIONS';

  return (
    <section className="relative w-full pt-32 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-b from-[#F8FAFC] via-[#EFF6FF]/40 to-[#FFFFFF] text-slate-900 overflow-hidden border-b border-slate-200">
      {/* Soft Ambient Radial Lighting */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[300px] bg-blue-100/60 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-100/50 rounded-full blur-[110px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* ================= LEFT COLUMN: HERO INFORMATION ================= */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <FadeUp delay={0.05}>
              {/* Next-Gen Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold tracking-widest uppercase shadow-sm mb-4">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <span>{badgeText}</span>
              </div>

              {/* Powerful Professional Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#172554] tracking-tight leading-[1.15]">
                Grow Your Business with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">
                  AI-Powered
                </span>{' '}
                Digital Marketing
              </h1>
            </FadeUp>

            {/* Subtitle */}
            <FadeUp delay={0.15}>
              <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-xl">
                {subtitle}
              </p>
            </FadeUp>

            {/* Action Buttons */}
            <FadeUp delay={0.25}>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/services"
                  className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-blue-500/25 transition-transform hover:scale-105 active:scale-95 inline-flex items-center gap-2"
                >
                  <span>Explore Our Services</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/contact"
                  className="px-7 py-4 rounded-full bg-white hover:bg-slate-50 text-[#172554] border border-slate-200/90 font-bold text-sm sm:text-base shadow-sm transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2.5"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </div>
                  <span>Get a Free Consultation</span>
                </Link>
              </div>
            </FadeUp>

            {/* Trust highlights */}
            <FadeUp delay={0.35}>
              <div className="pt-4 flex items-center flex-wrap gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Verified ROI Strategy</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>AI Automated Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>100% Dynamic CMS Control</span>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* ================= RIGHT COLUMN: 3D TECHNOLOGY VISUAL ================= */}
          <div className="lg:col-span-6 relative flex justify-center">
            <ScaleIn delay={0.2} className="relative w-full max-w-lg">
              {/* Main 3D Laptop with Holographic AI Visual */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80"
                  alt="AI Technology & Analytics Dashboard"
                  className="w-full h-[380px] sm:h-[420px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 via-transparent to-cyan-500/10" />

                {/* Floating Telemetry Badge 1: AI Brain Automation */}
                <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-slate-200/90 shadow-xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      Neural Engine
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                      AI Workflow Active
                    </div>
                  </div>
                </div>

                {/* Floating Telemetry Badge 2: Growth Metric */}
                <div className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-slate-200/90 shadow-xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/25">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">
                      +145% Conversions
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      Verified Client Growth
                    </div>
                  </div>
                </div>
              </div>
            </ScaleIn>
          </div>
        </div>
      </div>
    </section>
  );
}
