import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPageBySlug, getTeam, resolveMediaUrl } from '../lib/api';
import { useCms } from '../context/CmsContext';
import SEOHead from '../components/layout/SEOHead';
import { FadeUp, ScaleIn, StaggerContainer, StaggerItem } from '../components/common/ScrollReveal';
import ProfessionalSkillsMarquee from '../components/home/ProfessionalSkillsMarquee';
import {
  Sparkles,
  Code2,
  Cpu,
  ArrowRight,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  CheckCircle2,
  Users,
  MessageCircle,
  ShieldCheck,
  Award,
  Layers,
  Zap,
} from 'lucide-react';

export default function AboutPage() {
  const { settings, pages } = useCms();
  const [cmsPage, setCmsPage] = useState(null);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // 1. Fetch dynamic page from Admin CMS (check 'about-us' first, then 'about')
        let pageData = null;
        try {
          const res = await getPageBySlug('about-us');
          if (res && (res.title || res._id)) {
            pageData = res;
          }
        } catch (e) {
          try {
            const res2 = await getPageBySlug('about');
            if (res2 && (res2.title || res2._id)) {
              pageData = res2;
            }
          } catch (e2) {
            if (Array.isArray(pages)) {
              const matched = pages.find(
                (p) => p.slug === 'about-us' || p.slug === 'about'
              );
              if (matched) {
                try {
                  const res3 = await getPageBySlug(matched.slug);
                  if (res3) pageData = res3;
                } catch (e3) {
                  pageData = matched;
                }
              }
            }
          }
        }

        // 2. Fetch team directory from Admin CMS
        let teamData = [];
        try {
          const t = await getTeam();
          teamData = Array.isArray(t) ? t : [];
        } catch (e) {
          console.warn('Could not load team from CMS:', e);
        }

        setCmsPage(pageData);
        setTeam(teamData);
      } catch (err) {
        console.error('Error loading about data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [pages]);

  // Extract blocks if page exists in CMS
  const blocks = cmsPage?.blocks || [];
  const richTextBlock = blocks.find((b) => b.type === 'rich_text');
  const heroBlock = blocks.find((b) => b.type === 'hero');
  const featuresBlock = blocks.find((b) => b.type === 'features');
  const ctaBlock = blocks.find((b) => b.type === 'cta');

  // Dynamic Image Fallbacks strictly matching Reference Images 1 & 2
  // Image 1 reference: Modern curved architectural glass skyscraper
  const heroSkyscraperImage =
    cmsPage?.featuredImage ||
    heroBlock?.mediaUrl ||
    'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=1200&auto=format&fit=crop';

  // Dynamic Titles & Subtitles from Admin CMS
  const headerTitle = cmsPage?.title || 'About Us';
  const headerSubtitle =
    cmsPage?.excerpt ||
    settings?.siteTagline ||
    'Our mission is to provide businesses with the financial and digital tools they need to thrive in today’s market.';

  const storyHeading = richTextBlock?.title || 'Our Story';

  // 3 Structured Narrative Sections matching Image 2
  const historyText =
    blocks.find((b) => b.title?.toLowerCase().includes('history'))?.content ||
    'Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example.';

  const missionText =
    blocks.find((b) => b.title?.toLowerCase().includes('mission'))?.content ||
    'Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure.';

  const valuesText =
    blocks.find((b) => b.title?.toLowerCase().includes('value'))?.content ||
    'Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure.';

  // Default team members if CMS has 0 entries
  const defaultTeam = [
    {
      _id: 'dt-1',
      name: 'Kisun Sah',
      role: 'Principal Software Engineer & Founder',
      bio: 'Full-stack MERN architect specializing in high-performance web systems, enterprise CMS platforms, and AI automation.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    {
      _id: 'dt-2',
      name: 'Aarav Sharma',
      role: 'Head of AI & Machine Learning',
      bio: 'Oversees neural workflows, conversational AI bots, LLM integrations, and automated customer lifecycle pipelines.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    {
      _id: 'dt-3',
      name: 'Elena Rostova',
      role: 'Lead UI/UX & Design Systems',
      bio: 'Crafts accessible user journeys, responsive web ergonomics, and high-fidelity product design tokens.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const displayTeam = team && team.length > 0 ? team : defaultTeam;

  // Phone number for WhatsApp
  const rawPhone = settings?.contactPhone || '01-4546038';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');

  // Dynamic SEO from CMS
  const seoTitle =
    cmsPage?.seo?.title ||
    `${headerTitle} — ${settings?.siteName || 'KBR Digital'}`;

  const seoDescription =
    cmsPage?.seo?.metaDescription ||
    cmsPage?.excerpt ||
    headerSubtitle;

  const seoImage = resolveMediaUrl(
    cmsPage?.seo?.ogImage || cmsPage?.featuredImage || heroSkyscraperImage
  );

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center text-slate-500 min-h-[60vh] flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--brand-primary,#3B66D4)] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* 100% Dynamic SEO from Admin CMS */}
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        image={seoImage}
        seoData={cmsPage?.seo}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: headerTitle,
          description: seoDescription,
          url: typeof window !== 'undefined' ? `${window.location.origin}/about-us` : undefined,
          mainEntity: {
            '@type': 'Organization',
            name: settings?.siteName || 'KBR Digital',
            url: typeof window !== 'undefined' ? window.location.origin : undefined,
            logo: resolveMediaUrl(settings?.logo),
            description: seoDescription,
          },
        }}
      />

      {/* =========================================================================
          SECTION 1: HERO SECTION (Exact Image 1 Structure & Design)
          - Soft sky-blue gradient background
          - Left: Large bold "About Us" + Mission paragraph
          - Right: Modern architectural curved glass skyscraper perspective
         ========================================================================= */}
      <section className="relative pt-32 sm:pt-36 lg:pt-40 pb-16 lg:pb-24 overflow-hidden bg-gradient-to-r from-[#eef5fc] via-[#f3f8fd] to-[#f8fafd] border-b border-slate-200/60">
        {/* Soft Ambient Light Glow */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-sky-200/40 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading & Mission Statement */}
            <FadeUp delay={0.05} className="lg:col-span-5 text-left space-y-5">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#111827] tracking-tight leading-[1.12]">
                {headerTitle}
              </h1>

              <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed max-w-xl font-normal">
                {headerSubtitle}
              </p>

              {/* Verified Trust Badges */}
              <div className="pt-3 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Enterprise Precision</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>100% Dynamic CMS</span>
                </div>
              </div>
            </FadeUp>

            {/* Right Column: Curved Glass Skyscraper Architecture (Image 1 Reference) */}
            <ScaleIn delay={0.15} className="lg:col-span-7 relative flex justify-end">
              <div className="relative w-full max-w-2xl h-[340px] sm:h-[420px] lg:h-[460px] rounded-3xl sm:rounded-[36px] overflow-hidden shadow-2xl shadow-sky-900/10 border-4 border-white/80 group">
                <img
                  src={resolveMediaUrl(heroSkyscraperImage)}
                  alt="Modern Curved Architecture Perspective"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Subtle sky ambient gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-900/20 via-transparent to-transparent pointer-events-none" />

                {/* Floating Architectural Badge */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-slate-200/80 shadow-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      Forward-Thinking
                    </div>
                    <div className="text-xs font-bold text-slate-900">
                      Engineering Next-Gen Scale
                    </div>
                  </div>
                </div>
              </div>
            </ScaleIn>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: "OUR STORY / JOURNEY" (Full-Width Description, No Second Image)
          - Single clean full-width narrative layout
          - Removes competing second image to keep focus on the main above hero card
         ========================================================================= */}
      <section className="py-20 sm:py-28 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp delay={0.08} className="w-full max-w-5xl mx-auto space-y-8 text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111827] tracking-tight">
              {storyHeading}
            </h2>

            {/* If CMS Rich Text content is available, display full-width */}
            {richTextBlock?.content ? (
              <div
                className="prose prose-slate max-w-none text-base sm:text-lg text-[#4B5563] leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: richTextBlock.content }}
              />
            ) : (
              <div className="space-y-8">
                {/* Sub-block 1: History Of The Company */}
                <div className="space-y-2.5">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#111827]">
                    History Of The Company
                  </h3>
                  <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
                    {historyText}
                  </p>
                </div>

                {/* Sub-block 2: Mission */}
                <div className="space-y-2.5">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#111827]">
                    Mission
                  </h3>
                  <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
                    {missionText}
                  </p>
                </div>

                {/* Sub-block 3: Company Values */}
                <div className="space-y-2.5">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#111827]">
                    Company Values
                  </h3>
                  <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
                    {valuesText}
                  </p>
                </div>
              </div>
            )}
          </FadeUp>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: "ROTATED SKILLS" SHOWCASE
          User Request: "and also intgrste a skills rotated this attach"
          - Central 360° Rotating Skill Seal / Ring Badge (continuous rotation)
          - Dual-row auto-scrolling infinite skills marquee with authentic brand SVGs
         ========================================================================= */}
      <section className="py-20 sm:py-24 bg-[#F8FAFC] border-b border-slate-200/80 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header with 360° Rotating Skill Seal Badge */}
          <FadeUp className="text-center max-w-3xl mx-auto mb-14 flex flex-col items-center">
            {/* 360° Rotating Circular Skill Badge */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-6 flex items-center justify-center">
              {/* Rotating Circular Text Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 w-full h-full flex items-center justify-center"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                  <path
                    id="skillCirclePath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text className="text-[9.5px] font-bold tracking-[0.22em] fill-blue-600 uppercase">
                    <textPath href="#skillCirclePath" startOffset="0%">
                      • FULL STACK • AI AUTOMATION • CLOUD & DEVOPS •
                    </textPath>
                  </text>
                </svg>
              </motion.div>

              {/* Static Center Icon Stamp */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-500/30 flex items-center justify-center border-2 border-white">
                <Cpu className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold tracking-widest uppercase mb-3 shadow-xs">
              <Zap className="w-3.5 h-3.5" />
              <span>CORE TECHNICAL MASTERY</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111827] tracking-tight">
              Rotated Skills & Modern Technologies
            </h2>

            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl">
              Production-tested proficiencies in enterprise web engineering, full-stack frameworks, AI workflow automation, and distributed cloud computing.
            </p>
          </FadeUp>

          {/* Continuous Infinite Skills Marquee */}
          <div className="pt-2">
            <ProfessionalSkillsMarquee />
          </div>
        </div>
      </section>




      {/* =========================================================================
          SECTION 5: BOTTOM CALL TO ACTION BANNER
          - Connected to dynamic CMS phone & WhatsApp
         ========================================================================= */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white relative overflow-hidden">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
                Ready to Partner with Us?
              </h2>
              <p className="text-base text-blue-100 font-normal leading-relaxed">
                Schedule a consultation to explore how our full-stack engineering and AI workflows can transform your business goals.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-4 rounded-full bg-white text-blue-600 hover:bg-slate-100 font-extrabold text-sm sm:text-base shadow-xl transition-transform hover:scale-105 active:scale-95 inline-flex items-center gap-2"
              >
                <span>Book a Consultation</span>
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
        </div>
      </section>
    </div>
  );
}
