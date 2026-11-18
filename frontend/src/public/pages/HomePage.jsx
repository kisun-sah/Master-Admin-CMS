import React, { useEffect, useState } from 'react';
import SEOHead from '../components/layout/SEOHead';
import HeroBanner from '../components/home/HeroBanner';
import ProfessionalSkillsMarquee from '../components/home/ProfessionalSkillsMarquee';
import ShortPortfolioSection from '../components/home/ShortPortfolioSection';
import Service3dCarousel from '../components/home/Service3dCarousel';
import AboutUsAgencySection from '../components/home/AboutUsAgencySection';
import StatsStrip from '../components/home/StatsStrip';
import ProcessSection from '../components/home/ProcessSection';
import AiAutomationSection from '../components/home/AiAutomationSection';
import WhyChooseUsSection from '../components/home/WhyChooseUsSection';
import TemplatesGalleryPreview from '../components/home/TemplatesGalleryPreview';
import TestimonialsSlider from '../components/home/TestimonialsSlider';
import HomeBlogPreview from '../components/home/HomeBlogPreview';
import HomeFaqAccordion from '../components/home/HomeFaqAccordion';
import BottomCtaBanner from '../components/home/BottomCtaBanner';
import ScrollReveal from '../components/common/ScrollReveal';
import { useCms } from '../context/CmsContext';
import { DEFAULT_CMS_FALLBACKS } from '../config/defaultCmsFallbacks';
import {
  getSliders,
  getPartners,
  getServices,
  getGalleryAlbums,
  getGalleryImages,
  getTestimonials,
  getBlogs,
  getFaqs,
} from '../lib/api';

export default function HomePage() {
  const { settings } = useCms();
  const [data, setData] = useState({
    sliders: [],
    partners: [],
    services: [],
    albums: [],
    galleryImages: [],
    testimonials: [],
    blogs: [],
    faqs: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [
          sliders,
          partners,
          services,
          albums,
          galleryImages,
          testimonials,
          blogs,
          faqs,
        ] = await Promise.allSettled([
          getSliders(),
          getPartners(),
          getServices(),
          getGalleryAlbums(),
          getGalleryImages(),
          getTestimonials(),
          getBlogs(),
          getFaqs(),
        ]);

        setData({
          sliders: sliders.status === 'fulfilled' ? sliders.value : [],
          partners: partners.status === 'fulfilled' ? partners.value : [],
          services: services.status === 'fulfilled' ? services.value : [],
          albums: albums.status === 'fulfilled' ? albums.value : [],
          galleryImages: galleryImages.status === 'fulfilled' ? galleryImages.value : [],
          testimonials: testimonials.status === 'fulfilled' ? testimonials.value : [],
          blogs: blogs.status === 'fulfilled' ? blogs.value : [],
          faqs: faqs.status === 'fulfilled' ? faqs.value : [],
        });
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  // Dynamic Section Rendering driven by Admin CMS Settings
  let rawSections =
    Array.isArray(settings?.homepageSections) && settings.homepageSections.length > 0
      ? [...settings.homepageSections]
      : DEFAULT_CMS_FALLBACKS.settings.homepageSections;

  // Filter out any company partner logos section and team/founder section as instructed
  rawSections = rawSections.filter((sec) => sec.id !== 'partners' && sec.id !== 'team');

  const heroIdx = rawSections.findIndex((s) => s.id === 'hero');
  const heroOrder = heroIdx >= 0 ? (Number(rawSections[heroIdx].order) || 1) : 1;

  // 1. Ensure NEW Professional Skills Marquee is placed immediately below Hero Banner
  if (!rawSections.some((sec) => sec.id === 'skillsMarquee')) {
    rawSections.push({
      id: 'skillsMarquee',
      name: 'Professional Skills & Technologies Marquee',
      enabled: true,
      order: heroOrder + 0.1,
      animation: 'fade-up',
    });
  }

  // 2. Ensure Short Portfolio section is present right after Skills Marquee
  if (!rawSections.some((sec) => sec.id === 'shortPortfolio')) {
    rawSections.push({
      id: 'shortPortfolio',
      name: 'Short Portfolio & Skill Hub',
      enabled: true,
      order: heroOrder + 0.2,
      animation: 'fade-up',
    });
  }

  // 3. Ensure Agency & AI sections are present in sequence
  const srvIdx = rawSections.findIndex((s) => s.id === 'services');
  const srvOrder = srvIdx >= 0 ? (Number(rawSections[srvIdx].order) || 4) : 4;

  if (!rawSections.some((sec) => sec.id === 'about')) {
    rawSections.push({
      id: 'about',
      name: 'About Agency & Core Capabilities',
      enabled: true,
      order: srvOrder + 0.1,
      animation: 'fade-up',
    });
  }
  if (!rawSections.some((sec) => sec.id === 'process')) {
    rawSections.push({
      id: 'process',
      name: 'Our 4-Step Working Process',
      enabled: true,
      order: srvOrder + 0.2,
      animation: 'fade-up',
    });
  }
  if (!rawSections.some((sec) => sec.id === 'aiAutomation')) {
    rawSections.push({
      id: 'aiAutomation',
      name: 'AI Solutions & Business Automation',
      enabled: true,
      order: srvOrder + 0.3,
      animation: 'fade-up',
    });
  }
  if (!rawSections.some((sec) => sec.id === 'whyUs')) {
    rawSections.push({
      id: 'whyUs',
      name: 'Why Choose Us & Benefits',
      enabled: true,
      order: srvOrder + 0.4,
      animation: 'fade-up',
    });
  }

  const sortedActiveSections = rawSections
    .filter((sec) => sec.enabled !== false)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  const sectionRenderers = {
    hero: () => <HeroBanner key="hero" sliders={data.sliders} loading={loading} />,
    skillsMarquee: (anim) => (
      <ScrollReveal key="skillsMarquee" preset={anim || 'fade-up'}>
        <ProfessionalSkillsMarquee />
      </ScrollReveal>
    ),
    shortPortfolio: (anim) => (
      <ScrollReveal key="shortPortfolio" preset={anim || 'fade-up'}>
        <ShortPortfolioSection />
      </ScrollReveal>
    ),
    services: (anim) => (
      <ScrollReveal key="services" preset={anim || 'fade-up'}>
        <Service3dCarousel services={data.services} />
      </ScrollReveal>
    ),
    about: (anim) => (
      <ScrollReveal key="about" preset={anim || 'fade-up'}>
        <AboutUsAgencySection />
      </ScrollReveal>
    ),
    stats: (anim) => (
      <ScrollReveal key="stats" preset={anim || 'fade-up'}>
        <StatsStrip />
      </ScrollReveal>
    ),
    process: (anim) => (
      <ScrollReveal key="process" preset={anim || 'fade-up'}>
        <ProcessSection />
      </ScrollReveal>
    ),
    aiAutomation: (anim) => (
      <ScrollReveal key="aiAutomation" preset={anim || 'fade-up'}>
        <AiAutomationSection />
      </ScrollReveal>
    ),
    whyUs: (anim) => (
      <ScrollReveal key="whyUs" preset={anim || 'fade-up'}>
        <WhyChooseUsSection />
      </ScrollReveal>
    ),
    gallery: (anim) => (
      <ScrollReveal key="gallery" preset={anim || 'fade-up'}>
        <TemplatesGalleryPreview albums={data.albums} images={data.galleryImages} />
      </ScrollReveal>
    ),
    testimonials: (anim) => (
      <ScrollReveal key="testimonials" preset={anim || 'fade-up'}>
        <TestimonialsSlider testimonials={data.testimonials} />
      </ScrollReveal>
    ),
    blogs: (anim) => (
      <ScrollReveal key="blogs" preset={anim || 'fade-up'}>
        <HomeBlogPreview blogs={data.blogs} />
      </ScrollReveal>
    ),
    faqs: (anim) => (
      <ScrollReveal key="faqs" preset={anim || 'fade-up'}>
        <HomeFaqAccordion faqs={data.faqs} />
      </ScrollReveal>
    ),
    cta: (anim) => (
      <ScrollReveal key="cta" preset={anim || 'fade-up'}>
        <BottomCtaBanner />
      </ScrollReveal>
    ),
  };

  return (
    <>
      <SEOHead
        title={
          settings?.seoDefaults?.metaTitle ||
          'Building High-Converting Websites, AI Solutions & Digital Growth'
        }
        description={
          settings?.seoDefaults?.metaDescription ||
          'Personal IT Officer, Full-Stack MERN Developer & Digital Marketer. Order custom business websites powered by Master Admin CMS, AI chatbots, and SEO.'
        }
        schema={{
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: settings?.siteName || ' & IT SOLUTIONS',
          description:
            settings?.footerDescription ||
            'Bespoke web development, Master Admin CMS websites, AI automation, and IT Officer solutions.',
          url: window.location.origin,
        }}
      />

      {/* Dynamic Sections in Admin Configured Order */}
      {sortedActiveSections.map((sec) => {
        const renderer = sectionRenderers[sec.id];
        return renderer ? renderer(sec.animation) : null;
      })}
    </>
  );
}
