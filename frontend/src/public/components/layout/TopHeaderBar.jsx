import React from 'react';
import { Link } from 'react-router-dom';
import { useCms } from '../../context/CmsContext';
import {
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function TopHeaderBar() {
  const { settings } = useCms();

  const phone = settings?.contactPhone || '01-4546038';
  const email = settings?.contactEmail || 'info@globalhelpfoundation.org.np';
  const socials = settings?.socialLinks || {};

  return (
    <div
      className="w-full text-white h-10 px-4 sm:px-6 lg:px-12 flex items-center justify-between text-xs sm:text-sm font-medium z-40 transition-colors duration-200"
      style={{ backgroundColor: 'var(--brand-primary, #3B66D4)' }}
    >
      {/* Left: Contact Phone & Email */}
      <div className="flex items-center gap-4 sm:gap-6">
        <a
          href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
          className="flex items-center gap-1.5 hover:text-cyan-200 transition-colors"
          title="Direct Phone Inquiry"
        >
          <Phone className="w-3.5 h-3.5 opacity-90" />
          <span className="tracking-tight">{phone}</span>
        </a>

        <a
          href={`mailto:${email}`}
          className="hidden md:flex items-center gap-1.5 hover:text-cyan-200 transition-colors"
          title="Direct Email Inquiry"
        >
          <Mail className="w-3.5 h-3.5 opacity-90" />
          <span className="tracking-tight">{email}</span>
        </a>
      </div>

      {/* Center: Social Media Icons Row */}
      <div className="flex items-center gap-3">
        {socials.facebook && (
          <a
            href={socials.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-200 transition-transform hover:scale-110"
            aria-label="Facebook"
          >
            <Facebook className="w-3.5 h-3.5" />
          </a>
        )}
        {socials.twitter && (
          <a
            href={socials.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-200 transition-transform hover:scale-110"
            aria-label="Twitter / X"
          >
            <Twitter className="w-3.5 h-3.5" />
          </a>
        )}
        {socials.instagram && (
          <a
            href={socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-200 transition-transform hover:scale-110"
            aria-label="Instagram"
          >
            <Instagram className="w-3.5 h-3.5" />
          </a>
        )}
        {socials.linkedin && (
          <a
            href={socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-200 transition-transform hover:scale-110"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-3.5 h-3.5" />
          </a>
        )}
        {socials.youtube && (
          <a
            href={socials.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-200 transition-transform hover:scale-110"
            aria-label="YouTube"
          >
            <Youtube className="w-3.5 h-3.5" />
          </a>
        )}
        {socials.github && (
          <a
            href={socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-200 transition-transform hover:scale-110"
            aria-label="GitHub"
          >
            <Github className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Right: Consultation / Inquiry Pill Link */}
      <div className="flex items-center gap-3">
        <Link
          to="/contact"
          className="flex items-center gap-1.5 hover:text-cyan-200 transition-colors"
          title="Book a Free Consultation"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Schedule a Consultation</span>
          <ArrowRight className="w-3 h-3 ml-0.5 opacity-80" />
        </Link>
      </div>
    </div>
  );
}

