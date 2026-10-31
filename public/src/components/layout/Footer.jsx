import React from 'react';
import { Link } from 'react-router-dom';
import { useCms } from '../../context/CmsContext';
import { useTheme } from '../../context/ThemeContext';
import { resolveMediaUrl } from '../../lib/api';
import {
  Code2,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function Footer() {
  const { settings, navigation } = useCms();
  const { isDark } = useTheme();

  // Dynamic columns from CMS navigation
  const col1 = navigation?.find((m) => m.location === 'footer_col_1');
  const col2 = navigation?.find((m) => m.location === 'footer_col_2');
  const col3 = navigation?.find((m) => m.location === 'footer_col_3');
  const legal = navigation?.find((m) => m.location === 'legal_links');

  // Fallback columns if none seeded yet
  const defaultCol1 = {
    title: 'Services & Solutions',
    items: [
      { label: 'Custom Websites & CMS', url: '/services' },
      { label: 'AI Chatbots & Automation', url: '/services' },
      { label: 'Digital Marketing & SEO', url: '/services' },
      { label: 'IT Officer Consulting', url: '/services' },
      { label: 'Cloud & Server Architecture', url: '/services' },
    ],
  };

  const defaultCol2 = {
    title: 'Website Templates',
    items: [
      { label: 'E-Commerce Websites', url: '/gallery' },
      { label: 'Hospital & Clinic Portals', url: '/gallery' },
      { label: 'School & College Systems', url: '/gallery' },
      { label: 'Travel & Booking Platforms', url: '/gallery' },
      { label: 'Corporate CMS Websites', url: '/gallery' },
    ],
  };

  const defaultCol3 = {
    title: 'Studio & Insights',
    items: [
      { label: 'About & IT Pedigree', url: '/about' },
      { label: 'Tech & Marketing Blog', url: '/blog' },
      { label: 'Careers & Collaborations', url: '/careers' },
      { label: 'Order Website / Hire Me', url: '/contact' },
      { label: 'Sitemap XML', url: '/sitemap.xml', target: '_blank' },
    ],
  };

  const activeCol1 = col1?.items?.length ? col1 : defaultCol1;
  const activeCol2 = col2?.items?.length ? col2 : defaultCol2;
  const activeCol3 = col3?.items?.length ? col3 : defaultCol3;

  const currentLogo = isDark
    ? settings?.darkLogo || settings?.logo
    : settings?.logo || settings?.darkLogo;

  // Clean WhatsApp phone number for click-to-chat
  const whatsappNumber = settings?.contactPhone
    ? settings.contactPhone.replace(/[^0-9]/g, '')
    : '15550192834';

  return (
    <footer className="relative bg-[#070A10] border-t border-white/10 text-slate-300 pt-16 pb-12 overflow-hidden">
      {/* Background ambient neon glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Brand Info (2 Columns wide on LG) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              {currentLogo ? (
                <img
                  src={resolveMediaUrl(currentLogo)}
                  alt={settings?.siteName || 'Logo'}
                  className="h-9 w-auto object-contain"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white">
                  <Code2 className="w-5 h-5" />
                </div>
              )}
              <span className="font-extrabold text-xl text-white tracking-tight">
                {settings?.siteName || 'NEXUS DEVS'}
              </span>
            </Link>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              {settings?.footerDescription ||
                'Personal IT, Full-Stack MERN Development, AI Automation & Digital Marketing Studio. Building high-converting websites and scalable digital growth systems for modern businesses.'}
            </p>

            {/* Direct Contact Details */}
            <div className="space-y-2 pt-2 text-sm text-slate-400">
              {settings?.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
                >
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>{settings.contactEmail}</span>
                </a>
              )}
              {settings?.contactPhone && (
                <a
                  href={`tel:${settings.contactPhone}`}
                  className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
                >
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <span>{settings.contactPhone}</span>
                </a>
              )}
              {settings?.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </div>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-3">
              {settings?.socialLinks?.github && (
                <a
                  href={settings.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-cyan-500 hover:text-black flex items-center justify-center text-slate-300 transition-all"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {settings?.socialLinks?.linkedin && (
                <a
                  href={settings.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-cyan-500 hover:text-black flex items-center justify-center text-slate-300 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {settings?.socialLinks?.twitter && (
                <a
                  href={settings.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-cyan-500 hover:text-black flex items-center justify-center text-slate-300 transition-all"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {settings?.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-cyan-500 hover:text-black flex items-center justify-center text-slate-300 transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings?.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-cyan-500 hover:text-black flex items-center justify-center text-slate-300 transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings?.socialLinks?.youtube && (
                <a
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-cyan-500 hover:text-black flex items-center justify-center text-slate-300 transition-all"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 1: Services */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
              {activeCol1.title || 'Services'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {activeCol1.items.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.url}
                    className="text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Website Templates */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
              {activeCol2.title || 'Templates & Portals'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {activeCol2.items.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.url}
                    className="text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Studio & Insights */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
              {activeCol3.title || 'Explore Studio'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {activeCol3.items.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.url}
                    target={item.target || '_self'}
                    className="text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Sub-Footer: Copyright + Legal Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            {settings?.copyrightText ||
              `© ${new Date().getFullYear()} NEXUS DEVS. 100% Dynamic Master Admin CMS Architecture.`}
          </div>

          <div className="flex items-center gap-6">
            {legal?.items?.length ? (
              legal.items.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.url}
                  className="hover:text-slate-300 transition-colors"
                >
                  {item.label}
                </Link>
              ))
            ) : (
              <>
                <Link to="/pages/privacy-policy" className="hover:text-slate-300 transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/pages/terms" className="hover:text-slate-300 transition-colors">
                  Terms of Service
                </Link>
                <a href="/robots.txt" target="_blank" className="hover:text-slate-300 transition-colors">
                  Robots Directives
                </a>
                <a href="/sitemap.xml" target="_blank" className="hover:text-slate-300 transition-colors">
                  XML Sitemap
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Floating Direct WhatsApp Action Pill */}
      {settings?.contactPhone && (
        <a
          href={`https://wa.me/${whatsappNumber}?text=Hi!%20I'm%20interested%20in%20ordering%20a%20website%20or%20IT%20services.`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-2xl shadow-emerald-500/50 hover:scale-105 transition-all"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline">Chat on WhatsApp</span>
        </a>
      )}
    </footer>
  );
}
