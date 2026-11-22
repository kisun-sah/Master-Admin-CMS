import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCms } from '../../context/CmsContext';
import { resolveMediaUrl, getServices } from '../../lib/api';
import TopHeaderBar from './TopHeaderBar';
import ServiceMegaMenu from './ServiceMegaMenu';
import {
  Menu,
  X,
  ChevronDown,
  PhoneCall,
  Code2,
  Sparkles,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';

export default function Navbar() {
  const { settings, pages } = useCms();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileServicesList, setMobileServicesList] = useState([]);
  const [logoFailed, setLogoFailed] = useState(false);
  const megaMenuTimeoutRef = useRef(null);

  useEffect(() => {
    setLogoFailed(false);
  }, [settings?.logo]);

  // Scroll detection: Transition from transparent over banner to fixed solid white
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY >= 45);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setMegaMenuOpen(false);
    setMobileServicesOpen(false);
  }, [location.pathname]);

  // Load published services for mobile accordion
  useEffect(() => {
    async function load() {
      try {
        const res = await getServices();
        if (Array.isArray(res) && res.length > 0) {
          setMobileServicesList(res.filter((s) => !s.status || s.status === 'published'));
        }
      } catch (e) {
        // Ignored
      }
    }
    load();
  }, []);

  // Assemble dynamic navbar items based SOLELY on CMS published pages + default Home & Contact Us
  const cmsHomePage = Array.isArray(pages)
    ? pages.find(
      (p) =>
        p.placement?.showInHeader &&
        (!p.status || p.status === 'published') &&
        (p.slug === 'home' || p.slug === '' || p.placement?.designateAsHomepage)
    )
    : null;

  const cmsContactPage = Array.isArray(pages)
    ? pages.find(
      (p) =>
        p.placement?.showInHeader &&
        (!p.status || p.status === 'published') &&
        (p.slug === 'contact' || p.slug === 'contact-us')
    )
    : null;

  const headerPages = Array.isArray(pages)
    ? pages
      .filter(
        (p) =>
          p.placement?.showInHeader &&
          (!p.status || p.status === 'published') &&
          p.slug !== 'home' &&
          p.slug !== '' &&
          p.slug !== 'contact' &&
          p.slug !== 'contact-us' &&
          !p.placement?.designateAsHomepage
      )
      .map((p) => {
        const cleanSlug = (p.slug || '').replace(/^\//, '');
        const isService =
          cleanSlug === 'services' ||
          cleanSlug.includes('service') ||
          (p.title || '').toLowerCase().includes('service');
        return {
          label: p.title,
          url: `/${cleanSlug}`,
          isMegaMenu: isService,
          order: Number(p.order) || 0,
        };
      })
    : [];

  const homeItem = cmsHomePage
    ? {
      label: cmsHomePage.title || 'Home',
      url: '/',
      order: Number(cmsHomePage.order) || -9999,
    }
    : { label: 'Home', url: '/', order: -9999 };

  const contactItem = cmsContactPage
    ? {
      label: cmsContactPage.title || 'Contact Us',
      url: `/${(cmsContactPage.slug || 'contact').replace(/^\//, '')}`,
      order: Number(cmsContactPage.order) || 9999,
    }
    : { label: 'Contact Us', url: '/contact', order: 9999 };

  // Only Home (default), CMS created pages, and Contact Us (default)
  const baseItems = [
    homeItem,
    ...headerPages,
    contactItem,
  ].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  const isHomePage = location.pathname === '/';
  const showDarkNavbarText = scrolled || !isHomePage;

  const rawPhone = settings?.contactPhone || '01-4546038';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');

  const handleMouseEnterServices = (item) => {
    if (
      item.isMegaMenu ||
      item.url === '/services' ||
      item.label.toLowerCase().includes('service')
    ) {
      if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
      setMegaMenuOpen(true);
    }
  };

  const handleMouseLeaveServices = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 220);
  };

  const handleMouseEnterMegaMenu = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
  };

  return (
    <>
      {/* Top Royal Blue Utility Bar (Visible at top, scrolls out of view naturally) */}
      {!scrolled && <TopHeaderBar />}

      {/* Main Sticky Navbar (Transparent over banner, turns solid white on scroll) */}
      <header
        className={`w-full z-50 transition-all duration-300 ${scrolled
          ? 'fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md text-slate-900 shadow-md border-b border-slate-200/80'
          : isHomePage
            ? 'absolute top-10 left-0 right-0 bg-transparent text-white border-b border-transparent'
            : 'sticky top-0 left-0 right-0 bg-white text-slate-900 shadow-sm border-b border-slate-200'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* ================= LEFT ZONE: BRAND LOGO (WHITE HANGING TAB BADGE) ================= */}
          <Link
            to="/"
            className={`group self-start bg-white rounded-t-none rounded-b-2xl sm:rounded-b-3xl shadow-xl shadow-slate-900/15 border-x border-b border-slate-100/90 flex items-center justify-center transition-all duration-300 z-20 ${scrolled
              ? 'h-16 min-w-[76px] sm:min-w-[88px] max-w-[130px] p-1.5'
              : 'h-24 sm:h-28 md:h-32 min-w-[96px] sm:min-w-[116px] md:min-w-[130px] max-w-[180px] p-2 sm:p-2.5 md:p-3'
              }`}
            title={settings?.siteName || 'Home'}
          >
            {settings?.logo && !logoFailed ? (
              <img
                src={resolveMediaUrl(settings.logo)}
                alt={settings.siteName || 'Logo'}
                className="w-full h-full max-h-full max-w-full object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <div className="w-full h-full rounded-b-xl bg-gradient-to-tr from-cyan-500 to-[var(--brand-primary,#3B66D4)] flex items-center justify-center text-white shadow-sm font-bold text-sm sm:text-base">
                {settings?.siteName ? (
                  settings.siteName.slice(0, 3).toUpperCase()
                ) : (
                  <Code2 className="w-8 h-8 sm:w-10 sm:h-10" />
                )}
              </div>
            )}
          </Link>

          {/* ================= RIGHT ZONE: DYNAMIC MENU ITEMS + CONSULTATION CTA + WHATSAPP ================= */}
          <div className="flex items-center gap-2 sm:gap-4 xl:gap-6">
            {/* Dynamic Menu Items (Right-Aligned) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
              {baseItems.map((item, index) => {
                const isServiceLink =
                  item.isMegaMenu ||
                  item.url === '/services' ||
                  item.label.toLowerCase().includes('service');
                const isActive =
                  location.pathname === item.url ||
                  (item.url === '/about-us' && location.pathname === '/about') ||
                  (item.url === '/about' && location.pathname === '/about-us');

                return (
                  <div
                    key={index}
                    className="relative py-2"
                    onMouseEnter={() => handleMouseEnterServices(item)}
                    onMouseLeave={handleMouseLeaveServices}
                  >
                    <Link
                      to={item.url}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1 ${isActive
                        ? showDarkNavbarText
                          ? 'text-[var(--brand-primary,#3B66D4)] bg-blue-50'
                          : 'text-cyan-300 bg-white/10'
                        : showDarkNavbarText
                          ? 'text-slate-700 hover:text-[var(--brand-primary,#3B66D4)] hover:bg-slate-50'
                          : 'text-slate-200 hover:text-white hover:bg-white/10'
                        }`}
                    >
                      <span>{item.label}</span>
                      {isServiceLink && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''
                            }`}
                        />
                      )}
                    </Link>
                  </div>
                );
              })}
            </nav>


            {/* Direct WhatsApp Quick Chat Icon */}
            <div className="hidden sm:flex items-center">
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-md transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
                title={`Chat Directly on WhatsApp (${rawPhone})`}
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden items-center gap-2">
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#25D366] text-white"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <button
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
                className={`p-2 rounded-lg ${showDarkNavbarText
                  ? 'text-slate-900 hover:bg-slate-100'
                  : 'text-white hover:bg-white/10'
                  }`}
                aria-label="Toggle Mobile Menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Hover Visual Mega-Menu Component */}
        <ServiceMegaMenu
          isOpen={megaMenuOpen}
          onClose={() => setMegaMenuOpen(false)}
          onMouseEnter={handleMouseEnterMegaMenu}
          onMouseLeave={handleMouseLeaveServices}
        />
      </header>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-84 max-w-[85vw] bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: 'var(--brand-secondary, #06B6D4)' }}
                  />
                  <span className="font-extrabold text-slate-900 text-sm tracking-wide">
                    Navigation Menu
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex flex-col gap-1 py-4">
                {baseItems.map((item, idx) => {
                  const isServiceLink =
                    item.isMegaMenu ||
                    item.url === '/services' ||
                    item.label.toLowerCase().includes('service');

                  if (isServiceLink) {
                    return (
                      <div key={idx} className="border-b border-slate-50 pb-1">
                        <div className="flex items-center justify-between">
                          <Link
                            to={item.url}
                            onClick={() => setMobileOpen(false)}
                            className="px-3 py-2.5 rounded-lg text-sm font-bold text-slate-800 hover:text-[var(--brand-primary,#3B66D4)] flex-grow"
                          >
                            {item.label}
                          </Link>
                          <button
                            type="button"
                            onClick={() => setMobileServicesOpen((prev) => !prev)}
                            className="p-2 text-slate-400 hover:text-slate-700"
                            aria-label="Toggle Services Accordion"
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''
                                }`}
                            />
                          </button>
                        </div>

                        {/* Mobile Services Accordion */}
                        {mobileServicesOpen && (
                          <div className="pl-4 pr-2 py-2 space-y-1 bg-slate-50 rounded-xl mb-2">
                            {mobileServicesList.slice(0, 8).map((srv) => (
                              <Link
                                key={srv._id || srv.slug}
                                to={`/services/${srv.slug}`}
                                onClick={() => setMobileOpen(false)}
                                className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-[var(--brand-primary,#3B66D4)] hover:bg-white"
                              >
                                {srv.title}
                              </Link>
                            ))}
                            <Link
                              to="/services"
                              onClick={() => setMobileOpen(false)}
                              className="block px-3 py-2 rounded-lg text-xs font-bold text-[var(--brand-primary,#3B66D4)] hover:underline flex items-center gap-1"
                            >
                              <span>View All Services</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={idx}
                      to={item.url}
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:text-[var(--brand-primary,#3B66D4)] hover:bg-blue-50 transition-colors"
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Drawer Footer Contact & Consultation CTA */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="w-full btn-secondary-brand py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md text-white text-center"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Get a Free Consultation</span>
              </Link>

              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp ({rawPhone})</span>
              </a>

              <p className="text-xs text-center text-slate-400">
                {settings?.contactEmail || 'info@globalhelpfoundation.org.np'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
