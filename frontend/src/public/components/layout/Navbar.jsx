import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCms } from '../../context/CmsContext';
import { useTheme } from '../../context/ThemeContext';
import { resolveMediaUrl } from '../../lib/api';
import {
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  Code2,
  Terminal,
  ExternalLink,
} from 'lucide-react';

export default function Navbar() {
  const { settings, navigation } = useCms();
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Scroll detection for enhanced glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  // Extract header navigation menu
  const headerMenu = navigation?.find((m) => m.location === 'header');
  const navItems =
    headerMenu?.items?.length > 0
      ? headerMenu.items
      : [
          { label: 'Home', url: '/' },
          { label: 'About & IT Profile', url: '/about' },
          {
            label: 'Services',
            url: '/services',
            children: [
              { label: 'Custom Websites & CMS', url: '/services?category=Custom+Websites+%26+CMS' },
              { label: 'AI & Automation', url: '/services?category=AI+%26+Automation' },
              { label: 'Digital Marketing & SEO', url: '/services?category=Digital+Marketing+%26+SEO' },
              { label: 'IT Officer & Cloud Support', url: '/services?category=IT+Officer+%26+Cloud+Support' },
            ],
          },
          { label: 'Website Packages', url: '/website-packages' },
          { label: 'Project Gallery', url: '/gallery' },
          { label: 'Tech Blog', url: '/blog' },
          { label: 'Careers', url: '/careers' },
        ];

  // Dynamic logo selection: Dark Mode logo vs Light Mode logo
  const currentLogo = isDark
    ? settings?.darkLogo || settings?.logo
    : settings?.logo || settings?.darkLogo;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-panel shadow-glass border-b border-white/10 dark:border-white/10 light:border-slate-200'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group">
          {currentLogo ? (
            <img
              src={resolveMediaUrl(currentLogo)}
              alt={settings?.siteName || 'Logo'}
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-neon-cyan">
              <Code2 className="w-6 h-6" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-white dark:text-white light:text-slate-900 group-hover:text-cyan-400 transition-colors">
              {settings?.siteName || 'NEXUS DEVS'}
            </span>
            <span className="text-[10px] tracking-wider uppercase text-cyan-400/80 font-semibold -mt-1 hidden sm:block">
              {settings?.siteTagline ? settings.siteTagline.slice(0, 32) : 'IT, AI & Web Dev Studio'}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item, idx) => {
            const isActive =
              location.pathname === item.url ||
              (item.url !== '/' && location.pathname.startsWith(item.url));
            const hasChildren = item.children && item.children.length > 0;

            if (hasChildren) {
              return (
                <div
                  key={idx}
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown(idx)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 shadow-sm'
                        : 'text-slate-300 hover:text-white dark:text-slate-300 dark:hover:text-white light:text-slate-700 light:hover:text-slate-900'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </button>

                  {/* Dropdown Menu */}
                  {openDropdown === idx && (
                    <div className="absolute top-full left-0 mt-2 w-64 glass-panel rounded-xl shadow-2xl p-2 border border-white/10 animate-in fade-in zoom-in-95 duration-150">
                      <Link
                        to={item.url}
                        className="block px-3 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 hover:bg-white/5 rounded-lg mb-1"
                      >
                        All {item.label} &rarr;
                      </Link>
                      <div className="border-t border-white/10 my-1"></div>
                      {item.children.map((sub, sIdx) => (
                        <Link
                          key={sIdx}
                          to={sub.url}
                          className="flex items-center justify-between px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-cyan-500/10 rounded-lg transition-colors"
                        >
                          <span>{sub.label}</span>
                          <span className="text-cyan-400 text-xs opacity-0 hover:opacity-100">&rsaquo;</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={idx}
                to={item.url}
                target={item.target || '_self'}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 shadow-sm'
                    : 'text-slate-300 hover:text-white dark:text-slate-300 dark:hover:text-white light:text-slate-700 light:hover:text-slate-900 hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Theme Toggle + Glowing CTA */}
        <div className="flex items-center gap-3">
          {/* Admin CMS Access Link */}
          <Link
            to="/admin/login"
            title="CMS Admin Panel Login"
            className="p-2.5 rounded-xl text-slate-300 hover:text-cyan-400 bg-slate-800/50 hover:bg-slate-800 border border-white/10 transition-colors hidden sm:flex items-center justify-center"
          >
            <Terminal className="w-5 h-5" />
          </Link>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-white/10 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
          </button>

          {/* Glowing CTA Button */}
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 btn-primary-glow text-sm font-bold shadow-neon-cyan"
          >
            <Sparkles className="w-4 h-4" />
            <span>Hire Me / Get a Website</span>
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-800/50 border border-white/10"
            aria-label="Open Mobile Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bottom-0 glass-panel border-t border-white/10 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-top duration-200">
          <div className="space-y-2">
            {navItems.map((item, idx) => (
              <div key={idx} className="border-b border-white/5 pb-2">
                <Link
                  to={item.url}
                  className="block px-3 py-2 text-base font-semibold text-slate-200 hover:text-cyan-400"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-4 space-y-1 mt-1">
                    {item.children.map((sub, sIdx) => (
                      <Link
                        key={sIdx}
                        to={sub.url}
                        className="block px-3 py-1.5 text-sm text-slate-400 hover:text-cyan-300"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
            <Link
              to="/contact"
              className="w-full text-center py-3 btn-primary-glow font-bold text-sm"
            >
              Hire Me / Order a Website
            </Link>
            <div className="text-center text-xs text-slate-400">
              Direct Contact:{' '}
              <a href={`tel:${settings?.contactPhone}`} className="text-cyan-400 font-medium">
                {settings?.contactPhone || '+1 (555) 019-2834'}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
