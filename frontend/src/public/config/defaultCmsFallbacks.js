/**
 * Smart Default CMS Fallbacks System
 * Ensures the public client frontend never renders empty, blank, or broken sections
 * even if the Master Admin CMS has not yet configured data for that module.
 */

export const DEFAULT_CMS_FALLBACKS = {
  settings: {
    siteName: 'KBR PVT. LTD.',
    siteTagline: 'Personal IT, AI, Web Development & Digital Marketing Studio',
    primaryColor: '#3B66D4', // Royal Blue
    secondaryColor: '#06B6D4', // Cyan
    fontFamily: 'Inter',
    contactEmail: 'info@globalhelpfoundation.org.np',
    contactPhone: '01-4546038',
    address: 'Kathmandu, Nepal & Remote Worldwide',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14128.504938637775!2d85.31295!3d27.71304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a307baabf%3A0xb5137c1bf18db1ea!2sKathmandu%2044600!5e0!3m2!1sen!2snp!4v1700000000000',
    footerDescription:
      'Empowering modern businesses with custom high-converting web applications powered by Master Admin CMS, enterprise AI automation, scalable cloud setups, and ROI-driven digital marketing.',
    copyrightText: '© 2026 Global Service Travel Pvt. Ltd. / Nexus IT & Digital Studio. All rights reserved.',
    socialLinks: {
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
      youtube: 'https://youtube.com',
      github: 'https://github.com',
    },
    seoDefaults: {
      metaTitle: 'Building High-Converting Websites, AI Solutions & Digital Growth',
      metaDescription:
        'Personal IT Officer, Full-Stack MERN Developer & Digital Marketer. Custom business websites with Master Admin CMS, AI chatbots, and SEO growth.',
      defaultOgImage: '',
      robots: 'index, follow',
    },
    homepageSections: [
      { id: 'hero', name: 'Hero Video & Banner Slider', enabled: true, order: 1, animation: 'fade-in' },
      { id: 'skillsMarquee', name: 'Professional Skills & Technologies Marquee', enabled: true, order: 2, animation: 'fade-up' },
      { id: 'shortPortfolio', name: 'Short Portfolio & Skill Hub', enabled: true, order: 3, animation: 'fade-up' },
      { id: 'services', name: '3D Auto-Rotating Services Carousel', enabled: true, order: 4, animation: 'fade-up' },
      { id: 'about', name: 'About Agency & Core Capabilities', enabled: true, order: 5, animation: 'fade-up' },
      { id: 'stats', name: 'Key Metrics & Impact Numbers', enabled: true, order: 6, animation: 'fade-up' },
      { id: 'process', name: 'Our 4-Step Working Process', enabled: true, order: 7, animation: 'fade-up' },
      { id: 'aiAutomation', name: 'AI Solutions & Business Automation', enabled: true, order: 8, animation: 'fade-up' },
      { id: 'whyUs', name: 'Why Choose Us & Benefits', enabled: true, order: 9, animation: 'fade-up' },
      { id: 'gallery', name: 'Clean Visual Portfolio & Gallery', enabled: true, order: 10, animation: 'fade-up' },
      { id: 'testimonials', name: 'Client Testimonials & Feedback', enabled: true, order: 11, animation: 'fade-up' },
      { id: 'blogs', name: 'Latest Blogs & Tech Insights', enabled: true, order: 12, animation: 'fade-up' },
      { id: 'faqs', name: 'Frequently Asked Questions (FAQ)', enabled: true, order: 13, animation: 'fade-up' },
      { id: 'cta', name: 'Bottom Consultation CTA Banner', enabled: true, order: 14, animation: 'fade-up' },
    ],
    animationSettings: {
      enabled: true,
      defaultPreset: 'fade-up',
      duration: 0.55,
      delay: 0,
      staggerDelay: 0.08,
    },
  },

  navigation: [
    {
      _id: 'default-header-nav',
      title: 'Main Header Navigation',
      location: 'header',
      status: 'active',
      items: [],
    },
    {
      _id: 'default-footer-nav-1',
      title: 'Top Solutions',
      location: 'footer_col_1',
      status: 'active',
      items: [
        { label: 'Custom Websites & CMS', url: '/services/full-stack-web-cms' },
        { label: 'AI Chatbots & Automation', url: '/services/ai-automation' },
        { label: 'Digital Marketing & SEO', url: '/services/digital-marketing' },
        { label: 'IT Officer & Cloud Support', url: '/services/it-officer-cloud' },
        { label: 'Cybersecurity Hardening', url: '/services/cybersecurity' },
      ],
    },
    {
      _id: 'default-footer-nav-2',
      title: 'Company & Resources',
      location: 'footer_col_2',
      status: 'active',
      items: [
        { label: 'About Us', url: '/about' },
        { label: 'Website Packages & Pricing', url: '/website-packages' },
        { label: 'Client Case Studies', url: '/gallery' },
        { label: 'Tech & Marketing Insights', url: '/blog' },
        { label: 'Careers & Collaborations', url: '/careers' },
        { label: 'Request a Free Quote', url: '/contact' },
      ],
    },
  ],

  heroBanner: {
    badge: 'LEADING IT, AI & DIGITAL GROWTH STUDIO',
    title: 'Building High-Converting Websites, AI Solutions & Digital Growth',
    subtitle:
      'Empowering modern businesses with custom full-stack web applications, Master Admin CMS, intelligent AI workflow automation, robust IT infrastructure, and data-driven marketing.',
    ctaPrimaryText: 'Explore Solutions',
    ctaPrimaryLink: '/services',
    ctaSecondaryText: 'Schedule a Consultation',
    ctaSecondaryLink: '/contact',
    trustPills: [
      'Enterprise-Grade Security',
      '24/7 Expert Technical Support',
      'End-to-End Agile Delivery',
    ],
    stats: [
      { label: 'Delivered Projects', value: '50+' },
      { label: 'Global Certifications', value: '500+' },
      { label: 'Enterprise Clients', value: '400+' },
      { label: 'Years of Experience', value: '15+' },
    ],
  },

  services: [
    {
      _id: 'srv-01',
      number: '01',
      title: 'Full-Stack Web & Master CMS Development',
      slug: 'full-stack-web-cms',
      category: 'Web Development',
      featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      shortDescription:
        'High-performance React, Next.js, and Node.js business portals with our dynamic Master Admin CMS so you control every pixel.',
      tags: ['MERN / Next.js', 'Custom Admin CMS', 'High Performance'],
      rating: 5.0,
      deliveryTime: '7–14 Days Delivery',
    },
    {
      _id: 'srv-02',
      number: '02',
      title: 'AI Integration & Intelligent Chatbots',
      slug: 'ai-automation',
      category: 'AI & Automation',
      featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
      shortDescription:
        'Custom conversational AI agents, OpenAI/Gemini workflow pipelines, and automated customer support integration for your business.',
      tags: ['OpenAI / Gemini', 'Smart Assistants', 'Workflow Automation'],
      rating: 5.0,
      deliveryTime: 'Instant Deployment',
    },
    {
      _id: 'srv-03',
      number: '03',
      title: 'Digital Marketing, SEO & Paid Ads Growth',
      slug: 'digital-marketing',
      category: 'Digital Marketing',
      featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      shortDescription:
        'Data-driven Google Ads, Meta advertising, technical SEO audits, and content strategies that generate verified paying leads.',
      tags: ['Google & Meta Ads', 'Technical SEO', 'Lead Generation'],
      rating: 5.0,
      deliveryTime: 'Monthly ROI Retainer',
    },
    {
      _id: 'srv-04',
      number: '04',
      title: 'IT Officer Consulting & Cloud Infrastructure',
      slug: 'it-officer-cloud',
      category: 'IT & Cloud Support',
      featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      shortDescription:
        'Complete systems administration, AWS/Linux cloud deployment, corporate networking, VPN setup, and 24/7 server monitoring.',
      tags: ['AWS / Linux', 'DevOps & CI/CD', '24/7 Uptime SLA'],
      rating: 5.0,
      deliveryTime: 'Dedicated Support',
    },
    {
      _id: 'srv-05',
      number: '05',
      title: 'Cybersecurity Hardening & Vulnerability Audits',
      slug: 'cybersecurity',
      category: 'IT & Cloud Support',
      featuredImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      shortDescription:
        'Penetration testing, RBAC security, zero-trust network policies, SSL encryption, and compliance checks to protect your data.',
      tags: ['Security Audits', 'Zero-Trust RBAC', 'Data Protection'],
      rating: 5.0,
      deliveryTime: 'Full Audit Report',
    },
    {
      _id: 'srv-06',
      number: '06',
      title: 'E-Commerce & Payment Gateway Portals',
      slug: 'ecommerce-portals',
      category: 'Web Development',
      featuredImage: 'https://images.unsplash.com/photo-1556742049-0a67e5572248?auto=format&fit=crop&w=800&q=80',
      shortDescription:
        'Complete online storefronts with Stripe, eSewa, Khalti, product catalogs, dynamic inventory tracking, and order fulfillment.',
      tags: ['Payment Gateways', 'Inventory Sync', 'Global Currencies'],
      rating: 5.0,
      deliveryTime: '10–20 Days Delivery',
    },
  ],

  stats: [
    { label: 'Delivered Projects', value: '50+' },
    { label: 'Global Certifications', value: '500+' },
    { label: 'Enterprise Clients', value: '400+' },
    { label: 'Years of Experience', value: '15+' },
  ],

  faqs: [
    {
      _id: 'faq-01',
      question: 'How long does it take to build a custom website?',
      answer:
        'A standard business website equipped with our Master Admin CMS typically launches within 7 to 14 business days. Complex enterprise portals or e-commerce platforms take 2 to 4 weeks depending on integrations.',
      category: 'Web Development',
    },
    {
      _id: 'faq-02',
      question: 'Do I get an Admin Panel to manage my own website content?',
      answer:
        'Yes, 100%! Every website we deliver is connected to the Master Admin CMS, allowing you to update banners, videos, services, blogs, team members, photo galleries, popups, and SEO meta tags without writing code.',
      category: 'CMS & Support',
    },
    {
      _id: 'faq-03',
      question: 'Can you integrate AI chatbots and automated customer workflows?',
      answer:
        'Absolutely. We integrate custom AI assistants (OpenAI, Gemini, Claude) that can answer customer questions, capture qualified leads, schedule meetings, and automate customer inquiries 24/7.',
      category: 'AI & Automation',
    },
    {
      _id: 'faq-04',
      question: 'What is included in your Monthly Digital Marketing & SEO service?',
      answer:
        'Our digital growth packages include Google Search & Display Ads, Meta (Facebook/Instagram) targeted campaigns, technical on-page & off-page SEO, monthly ranking reports, and conversion rate optimization.',
      category: 'Marketing',
    },
  ],
};

