import React from 'react';
import { Link } from 'react-router-dom';
import { useCms } from '../../context/CmsContext';
import { resolveMediaUrl } from '../../lib/api';
import {
  Code2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  MessageCircle,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';

export default function Footer() {
  const { settings, navigation, pages } = useCms();
  const [logoFailed, setLogoFailed] = React.useState(false);

  React.useEffect(() => {
    setLogoFailed(false);
  }, [settings?.logo]);

  const col1 = navigation?.find((m) => m.location === 'footer_col_1');
  const col2 = navigation?.find((m) => m.location === 'footer_col_2');
  const legal = navigation?.find((m) => m.location === 'legal_links');

  const defaultServices = [
    { label: 'Full-Stack Web & CMS', url: '/services/full-stack-web-cms' },
    { label: 'AI Chatbots & Automation', url: '/services/ai-automation' },
    { label: 'Digital Marketing & SEO', url: '/services/digital-marketing' },
    { label: 'IT Officer & Cloud Support', url: '/services/it-officer-cloud' },
    { label: 'Cybersecurity Hardening', url: '/services/cybersecurity' },
  ];

  const footerPages = Array.isArray(pages)
    ? pages
        .filter((p) => (!p.status || p.status === 'published') && p.placement?.showInFooter)
        .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
        .map((p) => ({
          label: p.title,
          url: `/${p.slug.replace(/^\//, '')}`,
        }))
    : [];

  const defaultQuickLinks = [
    { label: 'Home', url: '/' },
    { label: 'About Us', url: '/about-us' },
    { label: 'Our Services', url: '/services' },
    { label: 'Our Work / Portfolio', url: '/portfolio' },
    { label: 'Blogs & Insights', url: '/blog' },
    { label: 'Contact Us', url: '/contact' },
  ];

  const mergedQuickLinks = [...defaultQuickLinks];
  if (footerPages.length > 0) {
    footerPages.forEach((fp) => {
      if (!mergedQuickLinks.some((l) => l.url.toLowerCase() === fp.url.toLowerCase())) {
        mergedQuickLinks.push(fp);
      }
    });
  }

  const servicesList = col1?.items?.length ? col1.items : defaultServices;
  const quickLinksList = col2?.items?.length ? col2.items : mergedQuickLinks;

  const phone = settings?.contactPhone || '01-4546038';
  const email = settings?.contactEmail || 'info@globalhelpfoundation.org.np';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const socials = settings?.socialLinks || {};

  return (
    <footer
      className="relative bg-[#1E3A8A] text-white pt-16 pb-10 border-t-4"
      style={{ borderTopColor: 'var(--brand-secondary, #06B6D4)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/15">
          {/* ================= COLUMN 1: BRAND LOGO & BIO ================= */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              {settings?.logo && !logoFailed ? (
                <div className="bg-white p-2 rounded-xl inline-block shadow-sm">
                  <img
                    src={resolveMediaUrl(settings.logo)}
                    alt={settings.siteName || 'Logo'}
                    className="h-10 w-auto max-w-[160px] object-contain"
                    onError={() => setLogoFailed(true)}
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-white text-[#1E3A8A] flex items-center justify-center font-black text-xl shadow-md">
                  {settings?.siteName ? (
                    <span className="text-sm font-extrabold">{settings.siteName.slice(0, 3).toUpperCase()}</span>
                  ) : (
                    <Code2 className="w-7 h-7" />
                  )}
                </div>
              )}
            </Link>

            <h3 className="font-extrabold text-base tracking-tight text-white">
              {settings?.siteName || 'GLOBAL SERVICE TRAVEL & IT SOLUTIONS'}
            </h3>

            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              {settings?.footerDescription ||
                'Empowering modern businesses with custom high-converting web applications, Master Admin CMS, enterprise AI automation, and ROI-driven marketing.'}
            </p>

            {/* Social Media Row with Square Borders */}
            <div className="flex items-center gap-2 pt-2">
              {socials.facebook && (
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg border border-white/30 hover:border-white bg-white/10 hover:bg-white hover:text-[#1E3A8A] flex items-center justify-center text-white transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {socials.twitter && (
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg border border-white/30 hover:border-white bg-white/10 hover:bg-white hover:text-[#1E3A8A] flex items-center justify-center text-white transition-all"
                  aria-label="Twitter / X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {socials.instagram && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg border border-white/30 hover:border-white bg-white/10 hover:bg-white hover:text-[#1E3A8A] flex items-center justify-center text-white transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {socials.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg border border-white/30 hover:border-white bg-white/10 hover:bg-white hover:text-[#1E3A8A] flex items-center justify-center text-white transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {socials.youtube && (
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg border border-white/30 hover:border-white bg-white/10 hover:bg-white hover:text-[#1E3A8A] flex items-center justify-center text-white transition-all"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {socials.github && (
                <a
                  href={socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg border border-white/30 hover:border-white bg-white/10 hover:bg-white hover:text-[#1E3A8A] flex items-center justify-center text-white transition-all"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* ================= COLUMN 2: TOP SERVICES ================= */}
          <div>
            <h4 className="text-sm font-extrabold text-white tracking-wider uppercase mb-5 pb-2 border-b border-white/20 inline-block">
              Top Services & Solutions
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              {servicesList.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.url}
                    className="text-blue-100 hover:text-white hover:underline transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= COLUMN 3: QUICK LINKS ================= */}
          <div>
            <h4 className="text-sm font-extrabold text-white tracking-wider uppercase mb-5 pb-2 border-b border-white/20 inline-block">
              Quick Links & Resources
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              {quickLinksList.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.url}
                    className="text-blue-100 hover:text-white hover:underline transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= COLUMN 4: CONTACT INFO + LIVE GOOGLE MAP ================= */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold text-white tracking-wider uppercase mb-5 pb-2 border-b border-white/20 inline-block">
              Contact & Location
            </h4>

            <div className="space-y-2 text-xs sm:text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-300 flex-shrink-0" />
                <a href={`tel:${cleanPhone}`} className="hover:text-white">
                  {phone}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-300 flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white truncate">
                  {email}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-300 flex-shrink-0" />
                <span>Sun – Fri: 10:00 AM – 6:00 PM</span>
              </div>
            </div>

            {/* Quick Consultation CTA */}
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all text-white mt-1"
              style={{ backgroundColor: 'var(--brand-secondary, #06B6D4)' }}
            >
              <span>Get a Free Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Embedded Live Google Map Card */}
            {settings?.mapEmbedUrl && (
              <div className="rounded-xl overflow-hidden shadow-lg h-36 w-full border-2 border-white/20 mt-3">
                <iframe
                  title="Office Location Map"
                  src={settings.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>
        </div>

        {/* ================= BOTTOM COPYRIGHT BAR ================= */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-200">
          <div>
            {settings?.copyrightText ||
              `© ${new Date().getFullYear()} Global Service Travel & IT Solutions. Powered 100% Dynamically by Master Admin CMS.`}
          </div>

          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/about" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors">
              Help Center
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Direct WhatsApp CTA Button */}
      <a
        href={`https://wa.me/${cleanPhone}?text=Hello!%20I'm%20interested%20in%20your%20IT,%20Web%20Development%20&%20Digital%20Services.`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Chat"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm shadow-2xl shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline">WhatsApp Us</span>
      </a>
    </footer>
  );
}
