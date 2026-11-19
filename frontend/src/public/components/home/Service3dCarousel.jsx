import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resolveMediaUrl } from '../../lib/api';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function Service3dCarousel({ services = [] }) {
  const navigate = useNavigate();

  // 1. Strictly filter only active and published services from the CMS database
  const publishedServices = useMemo(() => {
    if (!Array.isArray(services)) return [];
    return services
      .filter((s) => !s.status || s.status === 'published')
      .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  }, [services]);

  const count = publishedServices.length;

  /*
   * =========================================================================
   * MONOTONIC VIRTUAL STEPPING ARCHITECTURE
   *
   * Root cause of previous backward animation:
   * When using cyclic modulo offset with a fixed array of N cards (0 to N-1),
   * transitioning from the last card (N-1) back to the first card (0) caused
   * card offsets to invert from negative to positive across the boundary.
   * With CSS transitions enabled, the browser animated those cards backwards
   * across the screen from left to right.
   *
   * The Solution:
   * Logical looping != Visual looping.
   * We maintain a monotonic integer `step` that increases strictly forward
   * (0, 1, 2, 3, ...).
   * We render a sliding virtual window of items keyed by their unique virtual
   * index `k` in the range [step - 4, step + 4].
   * The visual position of item `k` relative to center is simply `pos = k - step`.
   * When `step` advances to `step + 1`, EVERY card's position changes from
   * `pos` to `pos - 1`. Every card moves strictly from RIGHT to LEFT.
   * New cards enter smoothly from the right; exiting cards leave smoothly to
   * the left. It is mathematically impossible for any card to reverse direction.
   * =========================================================================
   */
  const [step, setStep] = useState(0);

  // Hover state ONLY triggered when cursor enters an individual service card
  const [isCardHovered, setIsCardHovered] = useState(false);

  const timerRef = useRef(null);
  const touchStartXRef = useRef(null);

  // Responsive Breakpoint Detection for accurate multi-card layout
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isLaptop = windowWidth >= 1024 && windowWidth < 1280;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const isMobile = windowWidth < 640;

  // Unidirectional navigation handlers
  const nextSlide = useCallback(() => {
    if (count <= 1) return;
    setStep((prev) => prev + 1);
  }, [count]);

  const prevSlide = useCallback(() => {
    if (count <= 1) return;
    setStep((prev) => prev - 1);
  }, [count]);

  // 2. Continuous 2000ms Automatic Rotation (Strict Right-to-Left)
  // Only auto-rotates if there are at least 3 services, and pauses ONLY when an individual card is hovered
  useEffect(() => {
    if (count < 3 || isCardHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setStep((prev) => prev + 1);
    }, 2000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [count, isCardHovered]);

  // Touch Swipe for mobile devices
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    touchStartXRef.current = null;
  };

  // Helper to resolve actual service image uploaded via Admin CMS
  const getServiceImageUrl = (service) => {
    if (service.featuredImage) return resolveMediaUrl(service.featuredImage);
    if (service.icon && (service.icon.startsWith('/') || service.icon.startsWith('http'))) {
      return resolveMediaUrl(service.icon);
    }
    return null;
  };

  // Active logical index in the database array (for pagination dots)
  const activeLogicalIndex = count > 0 ? ((step % count) + count) % count : 0;

  // =========================================================================
  // SCENARIO 1: NO PUBLISHED SERVICES IN DATABASE
  // =========================================================================
  if (count === 0) {
    return null;
  }

  // =========================================================================
  // SCENARIO 2: EXACTLY ONE SERVICE IN DATABASE
  // =========================================================================
  if (count === 1) {
    const service = publishedServices[0];
    const imageUrl = getServiceImageUrl(service);

    return (
      <section className="relative w-full py-24 bg-[#FFFFFF] text-slate-900 overflow-hidden border-b border-slate-200" id="services">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <SectionHeader />
          <div className="max-w-[380px] mx-auto">
            <ServiceCard service={service} imageUrl={imageUrl} isCenter navigate={navigate} />
          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // SCENARIO 3: EXACTLY TWO SERVICES IN DATABASE
  // =========================================================================
  if (count === 2) {
    return (
      <section className="relative w-full py-24 bg-[#FFFFFF] text-slate-900 overflow-hidden border-b border-slate-200" id="services">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <SectionHeader />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 max-w-4xl mx-auto">
            {publishedServices.map((service) => {
              const imageUrl = getServiceImageUrl(service);
              return (
                <div key={service._id || service.slug} className="w-full sm:w-1/2 max-w-[370px]">
                  <ServiceCard service={service} imageUrl={imageUrl} isCenter navigate={navigate} />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // SCENARIO 4 & 5: THREE OR MORE SERVICES — VIRTUALIZED UNIDIRECTIONAL 3D SHOWCASE
  //
  // Generates virtual items around `step`:
  // pos = -4 to +4 (9 items in pipeline)
  // Visible on desktop: pos in [-2, -1, 0, 1, 2]
  // Pre-buffered offscreen: pos in [-4, -3] and [3, 4]
  // =========================================================================
  const virtualWindow = [];
  for (let k = step - 4; k <= step + 4; k++) {
    const serviceIndex = ((k % count) + count) % count;
    virtualWindow.push({
      virtualKey: k,
      pos: k - step,
      service: publishedServices[serviceIndex],
    });
  }

  // Card dimension and positioning configuration
  const cardWidth = isMobile ? '86vw' : isTablet ? '320px' : isLaptop ? '335px' : '350px';

  const getPositionStyles = (pos) => {
    let transform = '';
    let zIndex = 0;
    let opacity = 0;
    let pointerEvents = 'none';
    let filter = 'none';

    if (isMobile) {
      // Mobile: 1 center card + side peeks
      if (pos === 0) {
        transform = 'translate3d(-50%, -50%, 0) scale(1)';
        zIndex = 30; opacity = 1; pointerEvents = 'auto';
      } else if (pos === 1) {
        transform = 'translate3d(calc(-50% + 72vw), -50%, 0) scale(0.82)';
        zIndex = 10; opacity = 0.35; pointerEvents = 'auto';
      } else if (pos === -1) {
        transform = 'translate3d(calc(-50% - 72vw), -50%, 0) scale(0.82)';
        zIndex = 10; opacity = 0.35; pointerEvents = 'auto';
      } else {
        const offX = pos > 0 ? '110vw' : '-110vw';
        transform = `translate3d(calc(-50% + ${offX}), -50%, 0) scale(0.6)`;
        zIndex = 0; opacity = 0;
      }
    } else if (isTablet) {
      // Tablet: 3 visible overlapping cards
      if (pos === 0) {
        transform = 'translate3d(-50%, -50%, 0) scale(1)';
        zIndex = 30; opacity = 1; pointerEvents = 'auto';
      } else if (pos === 1) {
        transform = 'translate3d(calc(-50% + 220px), -50%, 0) scale(0.88)';
        zIndex = 20; opacity = 0.95; pointerEvents = 'auto';
        filter = 'brightness(0.97)';
      } else if (pos === -1) {
        transform = 'translate3d(calc(-50% - 220px), -50%, 0) scale(0.88)';
        zIndex = 20; opacity = 0.95; pointerEvents = 'auto';
        filter = 'brightness(0.97)';
      } else {
        const offX = pos > 0 ? '560px' : '-560px';
        transform = `translate3d(calc(-50% + ${offX}), -50%, 0) scale(0.65)`;
        zIndex = 0; opacity = 0;
      }
    } else {
      // Desktop / Laptop: 5-card overlapping 3D hierarchy
      const innerGap = isLaptop ? '215px' : '255px';
      const outerGap = isLaptop ? '395px' : '480px';
      const bufferGap = isLaptop ? '590px' : '720px';

      if (pos === 0) {
        // Center: Primary focus, elevated foreground
        transform = 'translate3d(-50%, -50%, 0) scale(1)';
        zIndex = 30; opacity = 1; pointerEvents = 'auto';
      } else if (pos === 1) {
        // Inner Right: Entering next
        transform = `translate3d(calc(-50% + ${innerGap}), -50%, 0) scale(0.90)`;
        zIndex = 20; opacity = 0.96; pointerEvents = 'auto';
        filter = 'brightness(0.97)';
      } else if (pos === -1) {
        // Inner Left: Exiting previous
        transform = `translate3d(calc(-50% - ${innerGap}), -50%, 0) scale(0.90)`;
        zIndex = 20; opacity = 0.96; pointerEvents = 'auto';
        filter = 'brightness(0.97)';
      } else if (pos === 2) {
        // Outer Right: Visible depth layer
        transform = `translate3d(calc(-50% + ${outerGap}), -50%, 0) scale(0.78)`;
        zIndex = 10; opacity = 0.82; pointerEvents = 'auto';
        filter = 'brightness(0.94)';
      } else if (pos === -2) {
        // Outer Left: Visible depth layer
        transform = `translate3d(calc(-50% - ${outerGap}), -50%, 0) scale(0.78)`;
        zIndex = 10; opacity = 0.82; pointerEvents = 'auto';
        filter = 'brightness(0.94)';
      } else if (pos === 3) {
        // Offscreen Right Buffer (Invisible enter point)
        transform = `translate3d(calc(-50% + ${bufferGap}), -50%, 0) scale(0.65)`;
        zIndex = 5; opacity = 0;
      } else if (pos === -3) {
        // Offscreen Left Buffer (Invisible exit point)
        transform = `translate3d(calc(-50% - ${bufferGap}), -50%, 0) scale(0.65)`;
        zIndex = 5; opacity = 0;
      } else {
        const offX = pos > 0 ? '920px' : '-920px';
        transform = `translate3d(calc(-50% + ${offX}), -50%, 0) scale(0.5)`;
        zIndex = 0; opacity = 0;
      }
    }

    return { transform, zIndex, opacity, pointerEvents, filter };
  };

  return (
    <section
      className="relative w-full py-24 bg-[#FFFFFF] text-slate-900 overflow-hidden border-b border-slate-200"
      id="services"
    >
      {/* Soft Ambient Radial Glow (Ultra-Clean Light Mode) */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-blue-50/60 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-96 h-96 bg-sky-50/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-50/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Section Header */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <SectionHeader />
      </div>

      {/* ================= WIDE EXPANSIVE 3D CAROUSEL STAGE ================= */}
      <div className="relative w-full max-w-[1440px] mx-auto px-2 sm:px-6 lg:px-8 z-10">
        <div
          className="relative w-full h-[540px] sm:h-[570px] flex items-center justify-center select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Previous Slide Chevron (Left) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-slate-600 hover:text-blue-600 shadow-md hover:shadow-xl border border-slate-200/90 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Previous Service"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Slide Chevron (Right) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-slate-600 hover:text-blue-600 shadow-md hover:shadow-xl border border-slate-200/90 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Next Service"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Continuous Virtualized 3D Cards Track */}
          <div className="relative w-full h-full">
            {virtualWindow.map(({ virtualKey, pos, service }) => {
              const { transform, zIndex, opacity, pointerEvents, filter } = getPositionStyles(pos);
              const imageUrl = getServiceImageUrl(service);
              const isCenter = pos === 0;

              // Card click interaction:
              // Center card -> opens service detail page
              // Side card -> advances carousel smoothly to center that card
              const handleCardClick = () => {
                if (isCenter) {
                  navigate(`/services/${service.slug}`);
                } else if (pos !== 0) {
                  setStep((prev) => prev + pos);
                }
              };

              return (
                <div
                  key={virtualKey}
                  onClick={handleCardClick}
                  onMouseEnter={() => setIsCardHovered(true)}
                  onMouseLeave={() => setIsCardHovered(false)}
                  className="absolute cursor-pointer will-change-transform"
                  style={{
                    left: '50%',
                    top: '50%',
                    width: cardWidth,
                    transform,
                    zIndex,
                    opacity,
                    pointerEvents,
                    filter,
                    transition:
                      'transform 750ms cubic-bezier(0.25, 1, 0.5, 1), opacity 750ms cubic-bezier(0.25, 1, 0.5, 1), filter 500ms ease',
                  }}
                  title={service.title}
                >
                  {/* Clean Light-Mode Card Shell */}
                  <div
                    className={`group bg-white rounded-[32px] p-3.5 transition-all duration-500 border overflow-hidden ${isCenter
                      ? 'border-slate-200/90 shadow-[0_25px_60px_-15px_rgba(37,99,235,0.18),0_12px_24px_-8px_rgba(15,23,42,0.06)] ring-1 ring-blue-500/10'
                      : 'border-slate-200/70 shadow-[0_15px_35px_-10px_rgba(15,23,42,0.08)] hover:border-blue-300'
                      }`}
                  >
                    {/* Visual Area: Actual CMS Image or Clean Neutral Surface */}
                    <div className="relative w-full h-[200px] sm:h-[220px] rounded-[22px] overflow-hidden bg-slate-100 transition-all duration-500">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={service.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-100 via-blue-50/30 to-slate-50">
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                            {service.category || 'Service Solution'}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            KBR Digital Systems
                          </span>
                        </div>
                      )}

                      {/* Subtle Bottom Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-transparent pointer-events-none" />

                      {/* Category Pill on top-left of image */}
                      {service.category && (
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-blue-600 uppercase tracking-wider shadow-sm border border-slate-200/60">
                          {service.category}
                        </div>
                      )}
                    </div>

                    {/* Text Area Below Image */}
                    <div className="px-5 pt-5 pb-5 sm:px-6 sm:pt-6 sm:pb-6 flex flex-col justify-between text-left">
                      <div>
                        {/* Service Title */}
                        <h3 className="text-xl sm:text-[22px] font-bold text-[#172554] tracking-tight leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {service.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs sm:text-[13px] text-[#64748B] leading-relaxed line-clamp-3 mb-6">
                          {service.shortDescription ||
                            'Delivering enterprise-grade architecture, scalable cloud infrastructure, and revenue-driven technology.'}
                        </p>
                      </div>

                      {/* Action Button */}
                      <div>
                        {isCenter ? (
                          <Link
                            to={`/services/${service.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
                          >
                            <span>Learn more</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        ) : (
                          <Link
                            to={`/services/${service.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 bg-white hover:bg-blue-50/60 font-medium text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 shadow-2xs"
                          >
                            <span>Learn more</span>
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= BOTTOM: STATUS, DOTS & VIEW ALL ================= */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/80">
          {/* Pagination Indicators (1 per database service) */}
          <div className="flex items-center gap-2">
            {publishedServices.map((_, dotIdx) => {
              const isActive = dotIdx === activeLogicalIndex;
              return (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => {
                    let diff = dotIdx - activeLogicalIndex;
                    if (diff < 0) diff += count;
                    setStep((prev) => prev + diff);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${isActive
                    ? 'w-7 bg-blue-600 shadow-sm'
                    : 'w-2 bg-blue-200/90 hover:bg-blue-300'
                    }`}
                  aria-label={`Go to service ${dotIdx + 1}`}
                />
              );
            })}
          </div>

          {/* Autoplay Status Indicator: Minimal & Elegant */}
          <div className="text-xs text-[#64748B] flex items-center gap-2 font-medium">
            <span
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${isCardHovered ? 'bg-amber-400' : 'bg-emerald-500 animate-pulse'
                }`}
            />
          </div>

          {/* View All Services Link */}
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-blue-600 text-slate-700 hover:text-white font-bold text-xs uppercase tracking-wider border border-slate-200/90 shadow-sm transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span>View All Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   REUSABLE SUB-COMPONENTS
   ========================================================================= */

function SectionHeader() {
  return (
    <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold tracking-widest uppercase mb-4 shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
        <span>OUR SERVICES</span>
      </div>

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#172554] tracking-tight leading-tight">
        Discover What We Do
      </h2>

      <p className="mt-4 text-base sm:text-lg text-[#64748B] leading-relaxed">
        Comprehensive digital solutions to help your business grow, engage and succeed in the modern digital economy.
      </p>
    </div>
  );
}

function ServiceCard({ service, imageUrl, isCenter, navigate }) {
  return (
    <div
      onClick={() => navigate(`/services/${service.slug}`)}
      className="group bg-white rounded-[32px] p-3.5 border border-slate-200/90 shadow-xl cursor-pointer hover:border-blue-400 transition-all duration-300"
    >
      <div className="relative w-full h-[220px] rounded-[22px] overflow-hidden bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-100 via-blue-50/30 to-slate-50">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              {service.category || 'Professional Service'}
            </span>
          </div>
        )}
        {service.category && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-blue-600 uppercase tracking-wider shadow-sm border border-slate-200/60">
            {service.category}
          </div>
        )}
      </div>

      <div className="px-5 pt-5 pb-5 text-left">
        <h3 className="text-xl font-bold text-[#172554] tracking-tight leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {service.title}
        </h3>
        <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3 mb-6">
          {service.shortDescription ||
            'High-performance digital engineering, architecture, and technology solutions.'}
        </p>
        <Link
          to={`/services/${service.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-xs shadow-md shadow-blue-500/25 transition-all"
        >
          <span>Learn more</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
