import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../config/db.js';
import { Role } from '../models/Role.js';
import { User } from '../models/User.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { NavigationMenu } from '../models/NavigationMenu.js';
import { Page } from '../models/Page.js';
import { Service } from '../models/Service.js';
import { BlogPost } from '../models/BlogPost.js';
import { Slider } from '../models/Slider.js';
import { Testimonial } from '../models/Testimonial.js';
import { TeamMember } from '../models/TeamMember.js';
import { Partner } from '../models/Partner.js';
import { FAQ } from '../models/FAQ.js';
import { Popup } from '../models/Popup.js';
import { JobVacancy } from '../models/JobVacancy.js';
import { JobApplication } from '../models/JobApplication.js';
import { GalleryAlbum } from '../models/GalleryAlbum.js';
import { GalleryImage } from '../models/GalleryImage.js';

export async function seedDatabase() {
  await connectDB();
  console.log('[Seeder] Starting Master Admin CMS database initialization...');

  // 1. Roles
  const roles = [
    {
      key: 'superadmin',
      name: 'Super Administrator',
      description: 'Unrestricted control over system configuration, roles, users, and all content.',
      permissions: ['*'],
      isSystem: true,
    },
    {
      key: 'admin',
      name: 'Administrator',
      description: 'Manages all content modules, site settings, and standard users.',
      permissions: [
        'dashboard:read',
        'settings:read',
        'settings:update',
        'pages:read',
        'pages:create',
        'pages:update',
        'pages:publish',
        'pages:delete',
        'services:read',
        'services:create',
        'services:update',
        'services:delete',
        'blogs:read',
        'blogs:create',
        'blogs:update',
        'blogs:delete',
        'sliders:read',
        'sliders:manage',
        'testimonials:read',
        'testimonials:manage',
        'team:read',
        'team:manage',
        'partners:read',
        'partners:manage',
        'faqs:read',
        'faqs:manage',
        'popups:read',
        'popups:manage',
        'media:read',
        'media:create',
        'media:delete',
        'contacts:read',
        'contacts:manage',
        'contacts:export',
        'careers:read',
        'careers:manage',
        'jobapplications:read',
        'jobapplications:manage',
        'jobapplications:download_cv',
        'gallery:read',
        'gallery:manage',
        'seo:read',
        'seo:manage',
        'menus:read',
        'menus:manage',
        'users:read',
        'users:manage',
        'audit:read',
        'system:read',
      ],
      isSystem: true,
    },
    {
      key: 'editor',
      name: 'Content Editor',
      description: 'Creates, drafts, updates, and publishes content and media.',
      permissions: [
        'dashboard:read',
        'pages:read',
        'pages:create',
        'pages:update',
        'pages:publish',
        'services:read',
        'services:create',
        'services:update',
        'blogs:read',
        'blogs:create',
        'blogs:update',
        'sliders:read',
        'sliders:manage',
        'testimonials:read',
        'testimonials:manage',
        'team:read',
        'partners:read',
        'faqs:read',
        'media:read',
        'media:create',
        'contacts:read',
        'careers:read',
        'careers:manage',
        'jobapplications:read',
        'gallery:read',
        'gallery:manage',
      ],
      isSystem: false,
    },
    {
      key: 'viewer',
      name: 'Auditor / Viewer',
      description: 'Read-only visibility for reporting and auditing.',
      permissions: [
        'dashboard:read',
        'pages:read',
        'services:read',
        'blogs:read',
        'contacts:read',
        'careers:read',
        'jobapplications:read',
        'gallery:read',
        'audit:read',
      ],
      isSystem: false,
    },
  ];

  for (const r of roles) {
    await Role.findOneAndUpdate({ key: r.key }, r, { upsert: true, new: true });
  }
  console.log('[Seeder] RBAC Roles configured.');

  // 2. Initial Super Admin Account
  const adminEmail = 'admin@mastercms.com';
  let adminUser = await User.findOne({ email: adminEmail });
  if (!adminUser) {
    const passwordHash = await User.hashPassword('Admin@123456');
    adminUser = await User.create({
      email: adminEmail,
      displayName: 'Alex Carter',
      passwordHash,
      role: 'superadmin',
      status: 'active',
    });
    console.log(`[Seeder] Created default Super Admin: ${adminEmail} (password: Admin@123456)`);
  }

  // 3. Global Site Settings
  let settings = await SiteSettings.findOne({ key: 'global' });
  if (!settings) {
    settings = await SiteSettings.create({
      key: 'global',
      siteName: 'Apex Enterprise Solutions',
      siteTagline: 'Engineering Next-Generation Digital Experiences',
      primaryColor: '#4F46E5',
      secondaryColor: '#06B6D4',
      fontFamily: 'Inter',
      contactEmail: 'contact@apexsolutions.io',
      contactPhone: '+1 (800) 555-0199',
      address: '500 Howard Street, Suite 1200, San Francisco, CA 94105',
      socialLinks: {
        twitter: 'https://twitter.com/apexsolutions',
        linkedin: 'https://linkedin.com/company/apex-solutions',
        github: 'https://github.com/apex-solutions',
      },
      footerDescription: 'Modern corporate content administration, digital media management, and enterprise API layer.',
      copyrightText: `© ${new Date().getFullYear()} Apex Enterprise Solutions. All rights reserved.`,
      seoDefaults: {
        metaTitle: 'Apex Enterprise Solutions — Scalable Digital Cloud Platforms',
        metaDescription: 'Leading enterprise solutions provider offering scalable cloud architecture, AI engineering, and web development.',
        robots: 'index, follow',
      },
      updatedBy: adminUser._id,
    });
    console.log('[Seeder] Global Site Settings created.');
  }

  // 4. Navigation Menus
  const existingNav = await NavigationMenu.findOne({ location: 'header' });
  if (!existingNav) {
    await NavigationMenu.create({
      location: 'header',
      title: 'Primary Header Navigation',
      items: [
        { label: 'Home', url: '/', order: 0, target: '_self' },
        { label: 'Services', url: '/services', order: 1, target: '_self' },
        { label: 'About Us', url: '/about-us', order: 2, target: '_self' },
        { label: 'Insights & Blog', url: '/blog', order: 3, target: '_self' },
        { label: 'Contact', url: '/contact', order: 4, target: '_self' },
      ],
    });
    await NavigationMenu.create({
      location: 'footer_col_1',
      title: 'Company',
      items: [
        { label: 'About Company', url: '/about-us', order: 0, target: '_self' },
        { label: 'Leadership Team', url: '/team', order: 1, target: '_self' },
        { label: 'Partner Network', url: '/partners', order: 2, target: '_self' },
      ],
    });
    console.log('[Seeder] Navigation Menus seeded.');
  }

  // 5. Seed Starter Content if empty
  const pageCount = await Page.countDocuments();
  if (pageCount === 0) {
    await Page.create([
      {
        title: 'Home',
        slug: 'home',
        excerpt: 'Welcome to Apex Enterprise Solutions.',
        status: 'published',
        placement: { isHomepage: true, showInHeader: true },
        author: adminUser._id,
        blocks: [
          {
            type: 'hero',
            title: 'Architecting Tomorrow’s Digital Infrastructure',
            content: 'We empower ambitious organizations with resilient cloud architectures, scalable APIs, and bespoke software solutions.',
            buttonText: 'Schedule Consultation',
            buttonLink: '/contact',
            order: 0,
          },
          {
            type: 'features',
            title: 'Enterprise Core Capabilities',
            content: 'Engineered for high-availability, seamless scale, and uncompromising reliability.',
            order: 1,
          },
        ],
        seo: {
          title: 'Home — Apex Enterprise Solutions',
          metaDescription: 'Pioneering enterprise digital transformation and cloud architectures.',
        },
      },
      {
        title: 'About Us',
        slug: 'about-us',
        excerpt: 'Discover our mission, culture, and track record of delivering transformative tech solutions.',
        status: 'published',
        placement: { showInHeader: true, showInFooter: true },
        author: adminUser._id,
        blocks: [
          {
            type: 'rich_text',
            title: 'Our Journey of Innovation',
            content: '<p>Founded in 2018, Apex Solutions has scaled from a boutique engineering firm to a global technology consultancy serving Fortune 500 enterprises.</p>',
            order: 0,
          },
        ],
        seo: {
          title: 'About Us — Apex Enterprise Solutions',
          metaDescription: 'Learn about our engineering pedigree and digital solutions philosophy.',
        },
      },
    ]);

    await Service.create([
      {
        title: 'Cloud Infrastructure & DevOps',
        slug: 'cloud-infrastructure-devops',
        shortDescription: 'Zero-downtime CI/CD pipelines, container orchestration with Kubernetes, and multi-region cloud scaling.',
        content: 'Comprehensive cloud migrations, infrastructure as code (Terraform), and proactive 24/7 reliability engineering.',
        category: 'Cloud Engineering',
        order: 1,
        status: 'published',
        featured: true,
      },
      {
        title: 'Enterprise Web Platforms',
        slug: 'enterprise-web-platforms',
        shortDescription: 'High-throughput MERN and Next.js applications engineered with decoupled API microservices.',
        content: 'From custom content management engines to enterprise dashboards, we architect web experiences that perform at scale.',
        category: 'Web Engineering',
        order: 2,
        status: 'published',
        featured: true,
      },
      {
        title: 'Data Systems & AI Integration',
        slug: 'data-systems-ai-integration',
        shortDescription: 'Modern data warehousing, automated ETL pipelines, and pragmatic generative AI workflow integration.',
        content: 'Harness machine learning and automated analytics to derive immediate business intelligence from your core operations.',
        category: 'Data & AI',
        order: 3,
        status: 'published',
        featured: false,
      },
    ]);

    await BlogPost.create([
      {
        title: 'Designing Decoupled CMS Architectures in 2026',
        slug: 'designing-decoupled-cms-architectures-2026',
        excerpt: 'Why modern enterprises are separating admin control planes from diverse consumer client applications.',
        body: '<p>Decoupled content architecture allows organizations to build resilient web portals, native mobile apps, and automated syndication feeds from a single authoritative source of truth.</p>',
        category: 'Architecture',
        tags: ['MERN', 'NodeJS', 'System Design', 'APIs'],
        status: 'published',
        author: adminUser._id,
        authorName: 'Alex Carter',
        readingTimeMinutes: 4,
      },
      {
        title: 'Securing Server-Validated Cookies and Eliminating XSS',
        slug: 'securing-server-validated-cookies-and-eliminating-xss',
        excerpt: 'A deep-dive into why opaque HttpOnly cookies outshine localStorage tokens for mission-critical web portals.',
        body: '<p>Storing tokens in localStorage leaves applications permanently vulnerable to malicious script execution. By combining HttpOnly cookies with CSRF defense, we build impenetrable session boundaries.</p>',
        category: 'Security',
        tags: ['Security', 'OAuth', 'Cookies', 'OWASP'],
        status: 'published',
        author: adminUser._id,
        authorName: 'Alex Carter',
        readingTimeMinutes: 5,
      },
    ]);

    await Slider.create([
      {
        title: 'Enterprise Digital Transformation',
        subtitle: 'Empowering modern brands with scalable MERN platforms and decoupled APIs',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
        ctaText: 'Explore Platform',
        ctaLink: '/services',
        order: 1,
        status: 'active',
      },
      {
        title: 'Zero-Trust Security & Cloud Resilience',
        subtitle: 'Defending mission-critical digital assets with server-side authentication guards',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
        ctaText: 'View Security Specs',
        ctaLink: '/about-us',
        order: 2,
        status: 'active',
      },
    ]);

    await Testimonial.create([
      {
        clientName: 'Elena Rostova',
        clientRole: 'Chief Technology Officer',
        company: 'Vanguard Global Logistics',
        rating: 5,
        quote: 'Apex delivered our enterprise portal two weeks ahead of schedule. Their decoupled API design handled our global launch with zero downtime.',
        order: 1,
        status: 'published',
        featured: true,
      },
      {
        clientName: 'Marcus Sterling',
        clientRole: 'VP of Product',
        company: 'Hyperion Analytics',
        rating: 5,
        quote: 'The Master Admin CMS provided our editorial team with instant superpowers. Managing global blocks, SEO, and banners has never been smoother.',
        order: 2,
        status: 'published',
        featured: true,
      },
    ]);

    await TeamMember.create([
      {
        name: 'Alexander Vance',
        designation: 'Lead Systems Architect',
        bio: 'Over 14 years specializing in distributed systems, high-concurrency Node.js microservices, and reactive SPAs.',
        portrait: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
        order: 1,
        status: 'active',
      },
      {
        name: 'Sophia Chen',
        designation: 'Head of Product Engineering',
        bio: 'Pioneered cloud architecture migrations for fintech and healthcare leaders across North America and APAC.',
        portrait: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
        order: 2,
        status: 'active',
      },
    ]);

    await Partner.create([
      {
        name: 'Amazon Web Services',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
        websiteUrl: 'https://aws.amazon.com',
        order: 1,
        status: 'active',
      },
      {
        name: 'MongoDB Atlas',
        logo: 'https://webassets.mongodb.com/_com_assets/cms/mongodb_logo1-76twgcu2dm.png',
        websiteUrl: 'https://mongodb.com',
        order: 2,
        status: 'active',
      },
    ]);

    await FAQ.create([
      {
        question: 'How does the Master Admin CMS support multiple consumer frontends?',
        answer: 'The CMS exposes versioned, read-only RESTful endpoints (/api/v1/public/...) that return clean, sanitized JSON representations of published pages, blogs, and settings.',
        category: 'Architecture',
        order: 1,
        status: 'published',
      },
      {
        question: 'What is the maximum allowed video upload size?',
        answer: 'The system strictly validates and enforces up to 35 MB video files (MP4, WebM) specifically optimized for high-impact hero sliders and dynamic background banners.',
        category: 'Media & Uploads',
        order: 2,
        status: 'published',
      },
    ]);

    await Popup.create({
      title: 'Q4 Enterprise Cloud Acceleration Workshop',
      content: 'Join our principal architects for a live 45-minute deep-dive on scaling decoupled web applications.',
      ctaText: 'Reserve Your Seat',
      ctaLink: '/contact',
      frequency: 'once_per_session',
      status: 'active',
    });

    // 10. Careers & Job Vacancies
    const countVacancies = await JobVacancy.countDocuments();
    if (countVacancies === 0) {
      const v1 = await JobVacancy.create({
        title: 'Senior Full-Stack MERN Architect',
        slug: 'senior-full-stack-mern-architect',
        department: 'Engineering',
        employmentType: 'full-time',
        location: 'San Francisco, CA',
        workMode: 'hybrid',
        openings: 2,
        experience: '5+ years production Node.js & React experience',
        education: 'B.S. or M.S. in Computer Science or equivalent',
        salaryRange: '$140,000 - $175,000 / yr',
        shortDescription: 'Lead architecture, REST API scaling, and modular React admin frontend delivery for our high-throughput CMS.',
        description: 'We are seeking an experienced Senior Full-Stack Engineer to lead development of our mission-critical administrative control planes and distributed client APIs.',
        responsibilities: [
          'Architect and maintain high-performance Express and Mongoose data layers',
          'Build accessible, responsive UI features in React using modern CSS design tokens',
          'Enforce strict security guardrails, RBAC policies, and audit logging standards',
          'Mentor junior developers and participate in code architecture reviews',
        ],
        requirements: [
          'Proficiency with MongoDB indexing, connection pooling, and schema design',
          'Deep expertise in modern React 18, Vite, and state management',
          'Experience building robust RESTful APIs with cookie sessions and CSRF defenses',
          'Familiarity with containerized deployments and automated integration tests',
        ],
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days in future
        status: 'published',
        createdBy: adminUser._id,
        updatedBy: adminUser._id,
      });

      const v2 = await JobVacancy.create({
        title: 'DevOps & Cloud Security Engineer',
        slug: 'devops-cloud-security-engineer',
        department: 'Infrastructure',
        employmentType: 'full-time',
        location: 'Austin, TX',
        workMode: 'remote',
        openings: 1,
        experience: '3+ years cloud infrastructure & CI/CD',
        education: 'Bachelor degree in relevant STEM field',
        salaryRange: '$130,000 - $160,000 / yr',
        shortDescription: 'Maintain infrastructure security, zero-trust network policies, automated backups, and container pipelines.',
        description: 'Join our infrastructure operations team to ensure high availability, encrypted file storage, automated testing pipelines, and 99.99% uptime.',
        responsibilities: [
          'Manage cloud server provisioning and zero-trust firewall configurations',
          'Automate continuous integration pipelines and automated security scans',
          'Monitor database health, memory telemetry, and disk storage utilization',
        ],
        requirements: [
          'Experience managing Linux production environments and Docker containers',
          'Strong understanding of web security, SSL/TLS, and isolated storage permissions',
        ],
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: 'published',
        createdBy: adminUser._id,
        updatedBy: adminUser._id,
      });

      // Sample Job Application
      await JobApplication.create({
        applicationRef: 'APP-20261028-SEED1',
        vacancy: v1._id,
        vacancyTitle: v1.title,
        candidate: {
          name: 'Sarah Chen',
          email: 'sarah.chen@example.com',
          phone: '+1 (555) 234-5678',
          education: 'M.S. in Software Engineering, Stanford University',
          currentOrganization: 'CloudScale Systems',
          experienceYears: '6 years',
          portfolioUrl: 'https://sarahchen.dev',
          linkedinUrl: 'https://linkedin.com/in/sarahchen-dev',
        },
        coverLetter: 'I am excited to submit my candidacy for the Senior Full-Stack MERN Architect role. With over 6 years of experience architecting large-scale React and Node.js applications, I am confident in driving impactful outcomes.',
        resume: {
          filename: 'sample_resume.pdf',
          originalName: 'Sarah_Chen_Resume.pdf',
          storagePath: 'sample_resume.pdf',
          mimeType: 'application/pdf',
          size: 142850,
        },
        status: 'under_review',
        statusHistory: [
          {
            status: 'new',
            changedByName: 'Candidate Submission',
            changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            note: 'Application received via Careers Portal.',
          },
          {
            status: 'under_review',
            changedByName: 'Alex Carter',
            changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            note: 'Strong portfolio and relevant MERN background.',
          },
        ],
        notes: [
          {
            text: 'Impressive GitHub contributions and experience with MongoDB connection pooling.',
            authorName: 'Alex Carter',
            createdAt: new Date(),
          },
        ],
        privacyConsent: {
          accepted: true,
          consentTimestamp: new Date(),
        },
      });

      v1.applicationCount = 1;
      await v1.save();
    }

    // 11. Organization Gallery & Albums
    const countAlbums = await GalleryAlbum.countDocuments();
    if (countAlbums === 0) {
      const album1 = await GalleryAlbum.create({
        title: 'Global Tech Summit & Leadership Keynote',
        slug: 'global-tech-summit-leadership-keynote',
        description: 'Moments and keynote highlights from our annual international engineering conference.',
        category: 'Events',
        eventDate: new Date('2026-09-15'),
        displayOrder: 1,
        coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
        status: 'published',
        imageCount: 2,
        createdBy: adminUser._id,
        updatedBy: adminUser._id,
      });

      await GalleryImage.create([
        {
          title: 'Principal Architects Panel Discussion',
          altText: 'Panel discussion at the Global Tech Summit',
          caption: 'Discussing the future of distributed control planes and decoupled headless architectures.',
          imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80',
          storageKey: 'gallery_summit_1.jpg',
          originalName: 'panel_discussion.jpg',
          album: album1._id,
          albumTitle: album1.title,
          category: 'Events',
          displayOrder: 1,
          status: 'published',
          uploadedBy: adminUser._id,
        },
        {
          title: 'Engineering Innovation Showcase',
          altText: 'Exhibition hall showing enterprise solutions',
          caption: 'Live demonstration of high-throughput content management systems.',
          imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
          storageKey: 'gallery_summit_2.jpg',
          originalName: 'innovation_showcase.jpg',
          album: album1._id,
          albumTitle: album1.title,
          category: 'Events',
          displayOrder: 2,
          status: 'published',
          uploadedBy: adminUser._id,
        },
      ]);
    }

    console.log('[Seeder] Initial starter content seeded successfully.');
  }

  console.log('[Seeder] Database initialization complete!');
}

// Direct execution
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Seeder Error]', err);
      process.exit(1);
    });
}
