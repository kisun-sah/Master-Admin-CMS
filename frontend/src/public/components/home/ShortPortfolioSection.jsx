import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCms } from '../../context/CmsContext';
import { resolveMediaUrl } from '../../lib/api';
import {
  FolderGit2,
  MessageSquare,
  Mail,
  Linkedin,
  Github,
  MessageCircle,
  Cpu,
  Bot,
  BarChart3,
  Sparkles,
  ArrowRight,
  Code2,
} from 'lucide-react';

export default function ShortPortfolioSection() {
  const { settings } = useCms();

  // Typewriter effect cycling through roles, starting with Laravel Expert as shown in screenshot
  const roles = [
    'Laravel Expert',
    'Full Stack Developer',
    'Digital Marketer',
    'AI & Automation Specialist',
    'IT Officer & Cloud Systems',
  ];
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullRole = roles[roleIndex];
    let speed = isDeleting ? 35 : 85;

    if (!isDeleting && displayText === currentFullRole) {
      speed = 1900; // Pause when word is completely typed
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
      speed = 350;
    }

    const timer = setTimeout(() => {
      if (!isDeleting && displayText === currentFullRole) {
        setIsDeleting(true);
      } else if (isDeleting) {
        setDisplayText(currentFullRole.substring(0, displayText.length - 1));
      } else {
        setDisplayText(currentFullRole.substring(0, displayText.length + 1));
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex, roles]);

  const rawPhone = settings?.contactPhone || '01-4546038';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
  const contactEmail = settings?.contactEmail || 'info@globalhelpfoundation.org.np';

  return (
    <section
      className="relative w-full overflow-hidden text-white py-16 sm:py-24 border-b border-blue-900/40"
      style={{
        // Lighter, luminous royal navy blue gradient (matching user reference screenshot)
        background:
          'radial-gradient(circle at 75% 38%, #163B80 0%, #0E2960 38%, #0A1E47 72%, #071738 100%)',
      }}
    >
      {/* Blueprint Grid Overlay (Clear, subtle cyan/white grid lines) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '44px 44px',
        }}
      />

      {/* Radiant Blue & Cyan Ambient Light Spheres */}
      <div className="absolute top-1/4 right-10 w-[32rem] h-[32rem] rounded-full bg-blue-500/25 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-16 left-10 w-96 h-96 rounded-full bg-cyan-500/15 blur-[130px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* ================= LEFT COLUMN: HERO INFORMATION & ACTIONS ================= */}
          <div className="lg:col-span-7 space-y-6">
            {/* Availability Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for Freelance & Full-time</span>
            </div>

            {/* Eyebrow Name */}
            <div className="text-xs sm:text-sm font-bold tracking-[0.25em] text-blue-200 uppercase">
              KISUN SAH
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-black text-white leading-[1.12] tracking-tight">
              Building Digital{' '}
              <span
                className="inline-block transition-colors"
                style={{ color: 'var(--brand-secondary, #F58220)' }}
              >
                Experiences
              </span>{' '}
              <br className="hidden sm:inline" />
              Through Code & Technology
            </h2>

            {/* Dynamic Typing Subheading */}
            <div className="text-base sm:text-xl font-medium text-blue-100 flex items-center gap-2 h-8">
              <span>I'm a</span>
              <span className="font-bold text-sky-300 min-w-[220px]">
                {displayText}
                <span className="inline-block w-0.5 h-5 bg-sky-300 ml-1 translate-y-0.5 animate-pulse" />
              </span>
            </div>

            {/* Paragraph Description */}
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-xl font-normal">
              Full Stack Developer & IT professional working across web development,
              IT operations, digital marketing, and intelligent automation. I build
              practical digital solutions that help businesses improve their online
              presence and workflows.
            </p>

            {/* 3 Call-To-Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              {/* Button 1: Explore My Work (Secondary Brand Button) */}
              <Link
                to="/portfolio"
                className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center gap-2.5 shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
                style={{ backgroundColor: 'var(--brand-secondary, #F58220)' }}
              >
                <FolderGit2 className="w-4 h-4" />
                <span>Explore My Work</span>
              </Link>

              {/* Button 2: Let's Work Together (Frosted Glass Button) */}
              <Link
                to="/contact"
                className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4 text-cyan-300" />
                <span>Let's Work Together</span>
              </Link>

              {/* Button 3: Hire Me (Frosted Glass Button) */}
              <Link
                to="/contact"
                className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all shadow-sm"
              >
                <Mail className="w-4 h-4 text-amber-300" />
                <span>Hire Me</span>
              </Link>
            </div>

            {/* Bottom Social Media Icons & Key Impact Metrics */}
            <div className="pt-8 border-t border-white/15 flex flex-wrap items-center justify-between gap-6">
              {/* Social Channels */}
              <div className="flex items-center gap-2.5">
                <a
                  href={settings?.socialLinks?.linkedin || 'https://linkedin.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center text-blue-100 hover:text-white transition-all shadow-sm hover:scale-105"
                >
                  <Linkedin className="w-4 h-4" />
                </a>

                <a
                  href={settings?.socialLinks?.github || 'https://github.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center text-blue-100 hover:text-white transition-all shadow-sm hover:scale-105"
                >
                  <Github className="w-4 h-4" />
                </a>

                <a
                  href={`mailto:${contactEmail}`}
                  aria-label="Send Direct Email"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center text-blue-100 hover:text-white transition-all shadow-sm hover:scale-105"
                >
                  <Mail className="w-4 h-4" />
                </a>

                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Direct WhatsApp Chat"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center text-blue-100 hover:text-white transition-all shadow-sm hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>

              {/* Numbers / Achievements */}
              <div className="flex items-center gap-6 sm:gap-8">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">3+</div>
                  <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">
                    YEARS EXP.
                  </div>
                </div>

                <div className="h-8 w-px bg-white/20" />

                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">10+</div>
                  <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">
                    PROJECTS
                  </div>
                </div>

                <div className="h-8 w-px bg-white/20" />

                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">8.4</div>
                  <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">
                    CGPA/10
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: INTERACTIVE FLOATING SKILL HUB / ORBIT ================= */}
          <div className="lg:col-span-5 relative">
            {/* Desktop Orbit Canvas */}
            <div className="relative min-h-[460px] flex items-center justify-center py-6">
              {/* Node 1: Top-Left (Laravel / PHP Backend) */}
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                className="lg:absolute lg:top-4 lg:-left-6 z-20 mb-4 lg:mb-0"
              >
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#142B5B]/85 border border-white/20 backdrop-blur-xl shadow-[0_12px_30px_rgba(3,10,30,0.5)] text-white hover:border-rose-400/50 transition-colors">
                  <span className="w-3 h-3 rounded-full bg-rose-500 shadow-md shadow-rose-500/80 animate-pulse" />
                  <span className="text-xs font-bold whitespace-nowrap">
                    Laravel / PHP Backend
                  </span>
                </div>
              </motion.div>

              {/* Node 2: Top-Right (React / MERN Frontend) */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
                className="lg:absolute lg:top-8 lg:-right-4 z-20 mb-4 lg:mb-0"
              >
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#142B5B]/85 border border-white/20 backdrop-blur-xl shadow-[0_12px_30px_rgba(3,10,30,0.5)] text-white hover:border-purple-400/50 transition-colors">
                  <Cpu className="w-4 h-4 text-purple-300" />
                  <span className="text-xs font-bold whitespace-nowrap">
                    React / MERN Frontend
                  </span>
                </div>
              </motion.div>

              {/* Central Main Glass Profile Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.25 }}
                className="relative bg-[#16336F]/80 border border-white/25 backdrop-blur-2xl p-7 sm:p-8 rounded-3xl shadow-[0_20px_50px_rgba(2,8,26,0.6)] text-center w-full max-w-[280px] sm:max-w-[310px] mx-auto z-10"
              >
                {/* White Circular Badge with Dynamic Logo from Site Settings */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white flex items-center justify-center p-3.5 mx-auto mb-4 shadow-[0_0_35px_rgba(59,130,246,0.4)] border-4 border-white/30 ring-4 ring-blue-400/25">
                  {settings?.logo ? (
                    <img
                      src={resolveMediaUrl(settings.logo)}
                      alt={settings.siteName || 'Logo'}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-[#1E3A8A] font-black text-xl">
                      KBR
                    </div>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight mb-1">
                  Kisun Sah
                </h3>
                <p className="text-xs text-blue-200 font-medium mb-3.5">
                  Full Stack Developer & IT Officer
                </p>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Open to Work</span>
                </div>
              </motion.div>

              {/* Node 3: Bottom-Left (AI & Automation n8n / Gemini) */}
              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="lg:absolute lg:bottom-4 lg:-left-8 z-20 mt-4 lg:mt-0"
              >
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#142B5B]/85 border border-white/20 backdrop-blur-xl shadow-[0_12px_30px_rgba(3,10,30,0.5)] text-white hover:border-emerald-400/50 transition-colors">
                  <Bot className="w-4 h-4 text-emerald-300" />
                  <div className="text-xs font-bold whitespace-nowrap">
                    <span>AI & Automation</span>
                    <span className="text-[10px] text-blue-200 ml-1.5 font-normal">
                      n8n / Gemini
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Node 4: Bottom-Right (Digital Marketing Meta · Google Ads) */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.1, repeat: Infinity, ease: 'easeInOut' }}
                className="lg:absolute lg:bottom-6 lg:-right-6 z-20 mt-4 lg:mt-0"
              >
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#142B5B]/85 border border-white/20 backdrop-blur-xl shadow-[0_12px_30px_rgba(3,10,30,0.5)] text-white hover:border-cyan-400/50 transition-colors">
                  <BarChart3 className="w-4 h-4 text-cyan-300" />
                  <div className="text-xs font-bold whitespace-nowrap">
                    <span>Digital Marketing</span>
                    <span className="text-[10px] text-blue-200 ml-1.5 font-normal">
                      Meta · Google Ads
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
