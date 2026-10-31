import React, { useEffect, useState } from 'react';
import SEOHead from '../components/layout/SEOHead';
import HeroSection from '../components/home/HeroSection';
import PartnerMarquee from '../components/home/PartnerMarquee';
import ServicesBento from '../components/home/ServicesBento';
import StatsStrip from '../components/home/StatsStrip';
import TemplatesGalleryPreview from '../components/home/TemplatesGalleryPreview';
import FounderSpotlight from '../components/home/FounderSpotlight';
import TestimonialsSlider from '../components/home/TestimonialsSlider';
import HomeBlogPreview from '../components/home/HomeBlogPreview';
import HomeFaqAccordion from '../components/home/HomeFaqAccordion';
import BottomCtaBanner from '../components/home/BottomCtaBanner';
import {
  getSliders,
  getPartners,
  getServices,
  getGalleryAlbums,
  getTeam,
  getTestimonials,
  getBlogs,
  getFaqs,
} from '../lib/api';

export default function HomePage() {
  const [data, setData] = useState({
    sliders: [],
    partners: [],
    services: [],
    albums: [],
    team: [],
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
          team,
          testimonials,
          blogs,
          faqs,
        ] = await Promise.allSettled([
          getSliders(),
          getPartners(),
          getServices(),
          getGalleryAlbums(),
          getTeam(),
          getTestimonials(),
          getBlogs(),
          getFaqs(),
        ]);

        setData({
          sliders: sliders.status === 'fulfilled' ? sliders.value : [],
          partners: partners.status === 'fulfilled' ? partners.value : [],
          services: services.status === 'fulfilled' ? services.value : [],
          albums: albums.status === 'fulfilled' ? albums.value : [],
          team: team.status === 'fulfilled' ? team.value : [],
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

  return (
    <>
      <SEOHead
        title="Building High-Converting Websites, AI Solutions & Digital Growth"
        description="Personal IT Officer, Full-Stack MERN Developer & Digital Marketer. Order custom business websites powered by Master Admin CMS, AI chatbots, and SEO."
        schema={{
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: 'NEXUS DEVS — Personal IT & Digital Agency Studio',
          description:
            'Bespoke web development, Master Admin CMS websites, AI automation, and IT Officer solutions.',
          url: window.location.origin,
        }}
      />

      <HeroSection sliders={data.sliders} />
      <PartnerMarquee partners={data.partners} />
      <ServicesBento services={data.services} />
      <StatsStrip />
      <TemplatesGalleryPreview albums={data.albums} />
      <FounderSpotlight team={data.team} />
      <TestimonialsSlider testimonials={data.testimonials} />
      <HomeBlogPreview blogs={data.blogs} />
      <HomeFaqAccordion faqs={data.faqs} />
      <BottomCtaBanner />
    </>
  );
}
