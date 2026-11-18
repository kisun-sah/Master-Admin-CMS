import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPageBySlug, getTeam, resolveMediaUrl } from '../lib/api';
import { useCms } from '../context/CmsContext';
import SEOHead from '../components/layout/SEOHead';
import {
  Sparkles,
  Code2,
  Server,
  ArrowRight,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  CheckCircle2,
  Users,
  Quote,
  MessageCircle,
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
            // Check in loaded pages context as backup
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

        // 2. Fetch team directory from Admin CMS if any
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
  const testimonialsBlock = blocks.find((b) => b.type === 'testimonials');

  // Real Lead from team if created in CMS; otherwise use site branding (NO fake dummy name)
  const lead = team && team.length > 0 ? team[0] : null;
  const leadName = lead?.name || cmsPage?.title || settings?.siteName || 'About Us';
  const leadRole =
    lead?.role || settings?.siteTagline || 'IT Systems, Web Development & AI Solutions';

  // Dynamic Image from CMS: Page featuredImage -> Block mediaUrl -> Lead avatar -> Fallback
  const displayImage = resolveMediaUrl(
    cmsPage?.featuredImage ||
      richTextBlock?.mediaUrl ||
      heroBlock?.mediaUrl ||
      lead?.avatarUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop'
  );

  // Dynamic Text Fields from CMS Page
  const headerTitle = cmsPage?.title || 'About Us';

  const headerSubtitle =
    cmsPage?.excerpt ||
    settings?.siteTagline ||
    'Discover my journey in technology, software development, AI automation, and digital marketing. I build modern digital solutions that help businesses grow, operate smarter, and strengthen their online presence.';

  const storyHeading =
    richTextBlock?.title ||
    heroBlock?.title ||
    'Our Journey of Innovation';

  const storyContentHtml = richTextBlock?.content || null;
  const storyContentText = heroBlock?.content || null;

  // Dynamic Features / Competency Cards
  const featureItems =
    featuresBlock?.items && featuresBlock.items.length > 0
      ? featuresBlock.items
      : [
          {
            title: '100% Dynamic CMS Control',
            desc:
              'Every element of this platform is managed dynamically from the Master Admin CMS with real-time updates.',
            icon: Code2,
          },
          {
            title: 'Full-Stack Engineering & AI',
            desc:
              'Delivering scalable MERN applications, enterprise AI workflow automation, and resilient cloud architectures.',
            icon: Server,
          },
        ];

  // Dynamic CTA button
  const ctaButtonText =
    ctaBlock?.buttonText || heroBlock?.buttonText || 'Contact Us';
  const ctaButtonLink =
    ctaBlock?.buttonLink || heroBlock?.buttonLink || '/contact';

  // Clean phone number for WhatsApp
  const rawPhone = settings?.contactPhone || '01-4546038';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');

  // Dynamic SEO from CMS
  const seoTitle =
    cmsPage?.seo?.title ||
    cmsPage?.title ||
    `About Us — ${settings?.siteName || 'IT, AI & Web Development'}`;

  const seoDescription =
    cmsPage?.seo?.metaDescription ||
    cmsPage?.excerpt ||
    headerSubtitle;

  const seoImage = resolveMediaUrl(
    cmsPage?.seo?.ogImage || cmsPage?.featuredImage || displayImage
  );

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center text-slate-500 min-h-[60vh] flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--brand-primary,#3B66D4)] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-[#F8FAFC] min-h-screen">
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
          url: window.location.origin + '/about-us',
          mainEntity: {
            '@type': 'Organization',
            name: settings?.siteName || 'GLOBAL SERVICE TRAVEL & IT SOLUTIONS',
            url: window.location.origin,
            logo: resolveMediaUrl(settings?.logo),
            description: seoDescription,
          },
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================= HERO HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-[var(--brand-primary,#3B66D4)] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Professional Journey & Pedigree</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {headerTitle}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {headerSubtitle}
          </p>
        </div>

        {/* ================= 2-COLUMN SPLIT: PREVIOUS BELOVED LAYOUT (FULLY DYNAMIC) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Left Column: Dynamic Visual Portrait Card */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 mb-6 relative">
                <img
                  src={displayImage}
                  alt={cmsPage?.title || 'About Us Image'}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-slate-800 border border-slate-200 shadow-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Verified Identity</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-xl font-bold text-slate-900">{leadName}</div>
                <div className="text-xs text-[var(--brand-primary,#3B66D4)] font-semibold mb-3">
                  {leadRole}
                </div>

                {lead?.bio && (
                  <p className="text-xs text-slate-600 mb-4 px-2 leading-relaxed">
                    {lead.bio}
                  </p>
                )}

                {/* Social Links from Lead or Site Settings */}
                <div className="flex items-center justify-center gap-3 pt-1">
                  {(lead?.socialLinks?.github || settings?.socialLinks?.github) && (
                    <a
                      href={lead?.socialLinks?.github || settings?.socialLinks?.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:text-white hover:bg-[var(--brand-primary,#3B66D4)] transition-all"
                      aria-label="GitHub Profile"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {(lead?.socialLinks?.linkedin || settings?.socialLinks?.linkedin) && (
                    <a
                      href={lead?.socialLinks?.linkedin || settings?.socialLinks?.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:text-white hover:bg-[var(--brand-primary,#3B66D4)] transition-all"
                      aria-label="LinkedIn Profile"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {(lead?.socialLinks?.twitter || settings?.socialLinks?.twitter) && (
                    <a
                      href={lead?.socialLinks?.twitter || settings?.socialLinks?.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:text-white hover:bg-[var(--brand-primary,#3B66D4)] transition-all"
                      aria-label="Twitter Profile"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {settings?.socialLinks?.facebook && (
                    <a
                      href={settings.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:text-white hover:bg-[var(--brand-primary,#3B66D4)] transition-all"
                      aria-label="Facebook Profile"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Story, Competencies & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 leading-snug">
              {storyHeading}
            </h2>

            {/* Dynamic Content: Strictly rendered from CMS Rich Text / HTML */}
            {storyContentHtml ? (
              <div
                className="prose prose-slate max-w-none text-base text-slate-700 leading-relaxed whitespace-pre-line space-y-4"
                dangerouslySetInnerHTML={{ __html: storyContentHtml }}
              />
            ) : storyContentText ? (
              <p className="text-base text-slate-700 leading-relaxed whitespace-pre-line">
                {storyContentText}
              </p>
            ) : (
              <div className="text-base text-slate-700 leading-relaxed space-y-4">
                <p>
                  {headerSubtitle}
                </p>
                <p>
                  Our mission is to engineer modern web platforms, powerful AI automation solutions, and resilient cloud systems that drive tangible business growth and digital transformation.
                </p>
              </div>
            )}

            {/* Core Competencies Cards (Dynamic or Default) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {featureItems.slice(0, 2).map((feat, fIdx) => {
                const IconComponent = feat.icon || (fIdx === 0 ? Code2 : Server);
                return (
                  <div
                    key={fIdx}
                    className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2 text-[var(--brand-primary,#3B66D4)] font-bold text-sm">
                      <IconComponent className="w-4 h-4 shrink-0" />
                      <span>{feat.title}</span>
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      {feat.desc || feat.content}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to={ctaButtonLink}
                className="px-8 py-3.5 rounded-full bg-[var(--brand-primary,#3B66D4)] hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 inline-flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
              >
                <span>{ctaButtonText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm shadow-sm flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* ================= OPTIONAL CMS TESTIMONIAL QUOTE ================= */}
        {testimonialsBlock?.content && (
          <div className="mb-16 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm text-center max-w-3xl mx-auto">
            <Quote className="w-10 h-10 text-blue-200 mx-auto mb-3" />
            <p className="text-base text-slate-700 italic mb-3">
              "{testimonialsBlock.content}"
            </p>
            <div className="font-bold text-slate-900 text-sm">
              {testimonialsBlock.title || 'Verified Enterprise Review'}
            </div>
          </div>
        )}

        {/* ================= COLLABORATING TEAM MEMBERS (ONLY IF CONFIGURED IN CMS) ================= */}
        {team.length > 1 && (
          <div className="pt-12 border-t border-slate-200">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[var(--brand-primary,#3B66D4)] text-xs font-bold uppercase tracking-wider mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>Our Collaborative Force</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Collaborators & Specialized Contributors
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.slice(1).map((member, idx) => (
                <div
                  key={member._id || idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-start gap-4"
                >
                  <img
                    src={resolveMediaUrl(member.avatarUrl)}
                    alt={member.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-bold text-slate-900 truncate">
                      {member.name}
                    </div>
                    <div className="text-xs text-[var(--brand-primary,#3B66D4)] font-medium mb-1">
                      {member.role}
                    </div>
                    {member.bio && (
                      <div className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed mb-2">
                        {member.bio}
                      </div>
                    )}

                    {member.socialLinks && (
                      <div className="flex items-center gap-2 pt-1">
                        {member.socialLinks.github && (
                          <a
                            href={member.socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-700 transition-colors"
                            aria-label="GitHub"
                          >
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {member.socialLinks.linkedin && (
                          <a
                            href={member.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-blue-600 transition-colors"
                            aria-label="LinkedIn"
                          >
                            <Linkedin className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {member.socialLinks.twitter && (
                          <a
                            href={member.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-sky-500 transition-colors"
                            aria-label="Twitter"
                          >
                            <Twitter className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
