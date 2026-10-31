import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resolveMediaUrl } from '../../lib/api';
import {
  Sparkles,
  Play,
  X,
  Code2,
  Cpu,
  TrendingUp,
  Server,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function HeroSection({ sliders = [] }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Default slide fallback if CMS has no active slider yet
  const defaultSlide = {
    title: 'Building High-Converting Websites, AI Solutions & Digital Growth for Every Business',
    subtitle:
      'Empowering businesses with custom full-stack web development, intelligent AI automation, robust IT infrastructure, and data-driven marketing.',
    badge: 'FULL-STACK DEVELOPER • IT OFFICER • AI & DIGITAL MARKETING',
    ctaText: 'Explore Website Packages',
    ctaLink: '/services',
    mediaType: 'video',
    mediaUrl: '',
  };

  const activeSlides = sliders.length > 0 ? sliders : [defaultSlide];
  const slide = activeSlides[currentSlideIndex] || activeSlides[0];

  // Auto-rotate if multiple slides
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  const hasVideoBg = slide.mediaType === 'video' && Boolean(slide.mediaUrl);
  const hasImageBg = slide.mediaType === 'image' && Boolean(slide.mediaUrl);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* 1. Background Video / Image Layer (35MB Video Reel support) */}
      {hasVideoBg ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            key={slide.mediaUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-25 filter blur-[1px] scale-105"
          >
            {slide.mobileMediaUrl && (
              <source
                src={resolveMediaUrl(slide.mobileMediaUrl)}
                media="(max-width: 767px)"
                type="video/mp4"
              />
            )}
            <source src={resolveMediaUrl(slide.mediaUrl)} type="video/mp4" />
          </video>
          {/* Obsidian dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#090D16]/90 via-[#090D16]/80 to-[#090D16]" />
        </div>
      ) : hasImageBg ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={resolveMediaUrl(slide.mediaUrl)}
            alt={slide.title}
            className="w-full h-full object-cover opacity-20 filter blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#090D16]/90 via-[#090D16]/80 to-[#090D16]" />
        </div>
      ) : (
        /* Atmospheric gradient glow orbs */
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-indigo-600/15 via-cyan-500/15 to-purple-600/10 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px]" />
        </div>
      )}

      {/* Grid Pattern Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Hero Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Subtitle Badge Pill with Neon Border */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-cyan-500/40 shadow-neon-cyan mb-6 animate-pulse-glow">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs sm:text-sm font-bold tracking-wider text-cyan-300 uppercase">
              {slide.badge ||
                slide.subtitle?.slice(0, 50) ||
                'FULL-STACK DEVELOPER • IT OFFICER • AI & DIGITAL MARKETING'}
            </span>
          </div>

          {/* Main H1 Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
            {slide.title}
          </h1>

          {/* Subtitle Paragraph */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
            {slide.subtitle ||
              'Empowering businesses with custom full-stack web development, intelligent AI automation, robust IT infrastructure, and data-driven marketing.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              to={slide.ctaLink || '/services'}
              className="inline-flex items-center gap-2 px-8 py-4 btn-primary-glow text-base font-bold shadow-neon-cyan group"
            >
              <span>{slide.ctaText || 'Explore Website Packages'}</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <button
              onClick={() => setShowVideoModal(true)}
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full glass-panel border border-white/20 text-white font-semibold hover:bg-white/10 hover:border-cyan-400/50 transition-all group"
            >
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </div>
              <span>Watch Live Demo Video</span>
            </button>
          </div>

          {/* Center Visual Mockup with 4 Floating Feature Cards (Matching Screenshot 3) */}
          <div className="relative w-full max-w-3xl mt-4">
            {/* Center Glowing Ring & Developer Portrait */}
            <div className="relative mx-auto w-56 h-56 sm:w-64 sm:h-64 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 shadow-neon-cyan flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#0D1322] overflow-hidden flex items-center justify-center relative">
                {/* Visual Avatar / Tech Core */}
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"
                  alt="Full-Stack Engineer & IT Specialist"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-transparent to-transparent opacity-60" />
              </div>

              {/* Status Ring Indicator */}
              <div className="absolute bottom-2 right-4 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Available for Hire</span>
              </div>
            </div>

            {/* Floating Card 1: Top Left - Web Development */}
            <div className="absolute -top-6 -left-2 sm:left-4 md:-left-8 glass-card rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 border border-white/15 shadow-2xl animate-float">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-neon-cyan">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                  React / Next.js UI
                </div>
                <div className="text-sm font-bold text-white">Web Development</div>
              </div>
            </div>

            {/* Floating Card 2: Top Right - AI & Automation */}
            <div
              className="absolute -top-6 -right-2 sm:right-4 md:-right-8 glass-card rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 border border-white/15 shadow-2xl animate-float"
              style={{ animationDelay: '1.5s' }}
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-neon-indigo">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                  LLMs & Chatbots
                </div>
                <div className="text-sm font-bold text-white">AI & Automation</div>
              </div>
            </div>

            {/* Floating Card 3: Bottom Left - SEO & Digital Marketing */}
            <div
              className="absolute -bottom-6 -left-2 sm:left-2 md:-left-6 glass-card rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 border border-white/15 shadow-2xl animate-float"
              style={{ animationDelay: '3s' }}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                  Google & Meta Ads
                </div>
                <div className="text-sm font-bold text-white">SEO & Growth</div>
              </div>
            </div>

            {/* Floating Card 4: Bottom Right - IT Infrastructure */}
            <div
              className="absolute -bottom-6 -right-2 sm:right-2 md:-right-6 glass-card rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 border border-white/15 shadow-2xl animate-float"
              style={{ animationDelay: '4.5s' }}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
                  Cloud & Security
                </div>
                <div className="text-sm font-bold text-white">IT Infrastructure</div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel slide indicators if multiple slides */}
        {activeSlides.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlideIndex
                    ? 'w-8 bg-cyan-400 shadow-neon-cyan'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Video Modal Player */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-4xl glass-panel rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="font-bold text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-cyan-400" />
                <span>Live Studio Showreel & CMS Demo</span>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="relative aspect-video bg-black flex items-center justify-center">
              {slide.mediaUrl && slide.mediaType === 'video' ? (
                <video
                  src={resolveMediaUrl(slide.mediaUrl)}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              ) : (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center shadow-neon-cyan">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Master Admin CMS & Client Solutions Demo
                  </h3>
                  <p className="text-sm text-slate-400 max-w-md mx-auto">
                    Full-Stack MERN Architecture, Dynamic Page Builder, 35MB Video Hero Reels, and E-Commerce storefronts.
                  </p>
                  <Link
                    to="/services"
                    onClick={() => setShowVideoModal(false)}
                    className="inline-block px-6 py-2.5 btn-primary-glow text-sm font-semibold"
                  >
                    Explore Ready Packages &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
