import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

/* ================= AUTHENTIC SVG BRAND ICONS ================= */
// 1. React.js
const ReactIcon = () => (
  <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-8 h-8 sm:w-9 sm:h-9">
    <title>React.js</title>
    <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
    <g stroke="#61DAFB" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);

// 2. Next.js
const NextjsIcon = () => (
  <svg viewBox="0 0 180 180" className="w-8 h-8 sm:w-9 sm:h-9">
    <title>Next.js</title>
    <circle cx="90" cy="90" r="90" fill="#000000" />
    <path
      fill="#ffffff"
      d="M149.508 157.438L69.147 54H54V125.979H66.9836V69.3831L139.999 164.845C143.333 162.614 146.509 160.147 149.508 157.438Z"
    />
    <rect x="115" y="54" width="13" height="72" fill="#ffffff" />
  </svg>
);

// 3. JavaScript
const JavaScriptIcon = () => (
  <svg viewBox="0 0 105 105" className="w-8 h-8 sm:w-9 sm:h-9 rounded-md">
    <title>JavaScript</title>
    <rect width="105" height="105" fill="#F7DF1E" />
    <path
      d="M26.2 73.5c1.7 2.8 4 4.8 8.1 4.8 4.1 0 6.8-2 6.8-9.8V35h9.3v33.4c0 13.1-7.8 19-18.4 19-8.3 0-13.4-4.2-16-9.6l10.2-5.7zm38.4 4.2c3.5 2 7.7 3.4 12.3 3.4 6.9 0 10.4-3.5 10.4-8.4 0-5.7-4.6-7.8-12.7-11.4-11.6-5.1-16.7-10.4-16.7-19.7 0-9.8 7.5-17.1 19.3-17.1 8 0 13.3 2.7 16.9 6.8l-7.3 5.9c-2.4-2.7-5.5-4.2-9.6-4.2-4.5 0-7.8 2.8-7.8 6.6 0 4.7 3.3 6.6 11.2 10.1 12.5 5.4 18.2 10.6 18.2 21.1 0 11.8-9.2 18.4-22.3 18.4-9.9 0-17.1-3.6-21.2-8.5l9.6-5.5z"
      fill="#000000"
    />
  </svg>
);

// 4. Node.js
const NodejsIcon = () => (
  <svg viewBox="0 0 256 289" className="w-8 h-8 sm:w-9 sm:h-9">
    <title>Node.js</title>
    <path
      fill="#5FA04E"
      d="M128 0L0 74v141l128 74 128-74V74L128 0zm68 184c-3 10-12 18-24 18-17 0-24-11-24-25v-48c0-8 6-14 14-14s14 6 14 14v45c0 4 2 7 6 7s6-3 6-7v-66h18v76zm-74-32v38c0 7-5 12-12 12s-12-5-12-12v-65c0-7 5-12 12-12s12 5 12 12v27zm-39-25c0-14 11-25 25-25s25 11 25 25v64c0 14-11 25-25 25s-25-11-25-25v-64z"
    />
  </svg>
);

// 5. Express.js
const ExpressIcon = () => (
  <svg viewBox="0 0 120 40" className="w-10 h-7 sm:w-11 sm:h-8">
    <title>Express.js</title>
    <text
      x="5"
      y="28"
      fontFamily="system-ui, -apple-system, sans-serif"
      fontWeight="900"
      fontSize="30"
      fill="#18181B"
      letterSpacing="-1.5"
    >
      express
    </text>
  </svg>
);

// 6. MongoDB
const MongoDbIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 sm:w-9 sm:h-9">
    <title>MongoDB</title>
    <path
      d="M17.193 9.555c-1.264-4.48-4.544-6.896-4.821-7.1-.211-.16-.534-.16-.745 0-.276.204-3.556 2.62-4.82 7.1-1.393 4.935.535 9.077 4.82 11.99.117.079.253.118.39.118s.273-.039.39-.118c4.285-2.913 6.213-7.055 4.82-11.99h-.034zm-5.074 10.457c-3.14-2.277-4.66-5.46-3.704-9.33.916-3.714 3.255-5.918 4.093-6.626.837.708 3.176 2.912 4.092 6.626.956 3.87-.564 7.053-3.704 9.33h-.777z"
      fill="#47A248"
    />
    <path
      d="M12.001 3.52c-.104.096-.208.2-.311.309-1.218 1.282-3.13 4.225-2.39 7.747.669 3.185 2.147 4.978 2.701 5.56V3.52z"
      fill="#499D4A"
    />
  </svg>
);

// 7. Laravel
const LaravelIcon = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 sm:w-9 sm:h-9">
    <title>Laravel</title>
    <path
      d="M20 70 L50 85 L80 70 L80 40 L50 55 L20 40 Z"
      fill="#FF2D20"
      opacity="0.9"
    />
    <path
      d="M20 40 L50 55 L80 40 L80 25 L50 10 L20 25 Z"
      fill="#FF2D20"
    />
    <path
      d="M50 55 L80 40 L80 70 L50 85 Z"
      fill="#D9261B"
    />
  </svg>
);

// 8. PHP
const PhpIcon = () => (
  <svg viewBox="0 0 128 128" className="w-8 h-8 sm:w-9 sm:h-9">
    <title>PHP</title>
    <ellipse cx="64" cy="64" rx="60" ry="34" fill="#777BB4" />
    <path
      d="M44 52h-8c-2 0-3 1-3 3l-6 22h7l2-8h4c5 0 8-3 9-8 1-5-1-9-5-9zm-4 9h-4l1-5h4c2 0 3 1 3 2 0 2-1 3-3 3zm26-9h-7l-6 22h7l2-8h4c5 0 8-3 9-8 1-5-1-9-5-9zm-4 9h-4l1-5h4c2 0 3 1 3 2 0 2-1 3-3 3zm40-9h-7l-2 8h-8l2-8h-7l-6 22h7l2-8h8l-2 8h7l6-22z"
      fill="#ffffff"
    />
  </svg>
);

// 9. MySQL
const MysqlIcon = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 sm:w-9 sm:h-9">
    <title>MySQL</title>
    <path
      d="M25 65 C15 55 18 35 35 25 C50 18 70 20 80 32 C85 38 88 50 82 58 C75 66 65 65 58 60 C50 54 45 42 40 40 C35 38 30 45 32 52 C34 58 30 63 25 65 Z"
      fill="#00758F"
    />
    <path
      d="M60 48 C65 42 72 45 75 50 C78 55 76 60 70 60 C64 60 60 55 60 48 Z"
      fill="#F29111"
    />
  </svg>
);

// 10. Git
const GitIcon = () => (
  <svg viewBox="0 0 128 128" className="w-8 h-8 sm:w-9 sm:h-9">
    <title>Git</title>
    <path
      d="M125 58L70 3a10 10 0 00-14 0L42 17l18 18a12 12 0 0115 15l17 17a12 12 0 11-7 7L69 58v33a12 12 0 11-10 0V56a12 12 0 01-6-16L35 23 3 55a10 10 0 000 14l55 56a10 10 0 0014 0l53-53a10 10 0 000-14z"
      fill="#F05032"
    />
  </svg>
);

// 11. GitHub
const GithubIcon = () => (
  <svg viewBox="0 0 98 96" className="w-8 h-8 sm:w-9 sm:h-9">
    <title>GitHub</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.215-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
      fill="#181717"
    />
  </svg>
);

// 12. Postman
const PostmanIcon = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 sm:w-9 sm:h-9">
    <title>Postman</title>
    <circle cx="50" cy="50" r="48" fill="#FF6C37" />
    <path
      d="M32 62 L68 34 L45 74 L42 56 Z"
      fill="#ffffff"
    />
    <path
      d="M45 74 L52 64 L42 56 Z"
      fill="#E55A27"
    />
  </svg>
);

// 13. REST API
const RestApiIcon = () => (
  <svg viewBox="0 0 64 64" className="w-8 h-8 sm:w-9 sm:h-9">
    <title>REST API</title>
    <rect width="64" height="64" rx="14" fill="#0284C7" />
    <circle cx="20" cy="32" r="6" fill="#ffffff" />
    <circle cx="44" cy="22" r="6" fill="#ffffff" />
    <circle cx="44" cy="42" r="6" fill="#ffffff" />
    <path
      d="M25 30 L39 24 M25 34 L39 40"
      stroke="#ffffff"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
  </svg>
);

// 14. Docker
const DockerIcon = () => (
  <svg viewBox="0 0 128 128" className="w-8 h-8 sm:w-9 sm:h-9">
    <title>Docker</title>
    <path
      d="M125 57c-2-1-10-3-16 2-4-4-11-5-17-4l-1 5c4 4 6 10 5 16-10 1-13-5-18-5H7c-5 13 4 33 24 37 32 6 62 1 81-19 8-8 12-20 13-32z"
      fill="#2496ED"
    />
    <path
      d="M17 56h11v11H17zm15 0h11v11H32zm15 0h11v11H47zm15 0h11v11H62zm-30-15h11v11H32zm15 0h11v11H47zm15 0h11v11H62zm15 0h11v11H77zm-15-15h11v11H62z"
      fill="#2496ED"
    />
  </svg>
);

// 15. Linux
const LinuxIcon = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 sm:w-9 sm:h-9">
    <title>Linux</title>
    <ellipse cx="50" cy="55" rx="30" ry="35" fill="#18181B" />
    <ellipse cx="50" cy="62" rx="20" ry="24" fill="#FFFFFF" />
    <ellipse cx="50" cy="28" rx="18" ry="16" fill="#18181B" />
    <circle cx="44" cy="25" r="3" fill="#FFFFFF" />
    <circle cx="56" cy="25" r="3" fill="#FFFFFF" />
    <circle cx="45" cy="25" r="1.5" fill="#000000" />
    <circle cx="55" cy="25" r="1.5" fill="#000000" />
    <path d="M44 31 Q50 37 56 31 Z" fill="#FCC624" />
    <ellipse cx="32" cy="88" rx="14" ry="7" fill="#FCC624" transform="rotate(-15 32 88)" />
    <ellipse cx="68" cy="88" rx="14" ry="7" fill="#FCC624" transform="rotate(15 68 88)" />
  </svg>
);

// 16. Meta Ads
const MetaAdsIcon = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 sm:w-9 sm:h-9">
    <title>Meta Ads</title>
    <defs>
      <linearGradient id="metaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0081FB" />
        <stop offset="100%" stopColor="#0064E0" />
      </linearGradient>
    </defs>
    <path
      d="M26 64 C16 64 8 55 8 46 C8 37 16 28 26 28 C35 28 42 36 50 48 C58 36 65 28 74 28 C84 28 92 37 92 46 C92 55 84 64 74 64 C65 64 58 56 50 44 C42 56 35 64 26 64 Z"
      fill="none"
      stroke="url(#metaGrad)"
      strokeWidth="11"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 17. Google Ads
const GoogleAdsIcon = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 sm:w-9 sm:h-9">
    <title>Google Ads</title>
    <path
      d="M32 20 L58 68 A16 16 0 0 1 30 84 L4 36 A16 16 0 0 1 32 20 Z"
      fill="#F4B400"
    />
    <path
      d="M68 20 L96 68 A16 16 0 0 1 68 84 L40 36 A16 16 0 0 1 68 20 Z"
      fill="#4285F4"
    />
    <circle cx="34" cy="74" r="14" fill="#0F9D58" />
  </svg>
);

// 18. Search Engine Optimization (SEO)
const SeoIcon = () => (
  <svg viewBox="0 0 64 64" className="w-8 h-8 sm:w-9 sm:h-9">
    <title>SEO</title>
    <rect width="64" height="64" rx="14" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2.5" />
    <circle cx="28" cy="28" r="12" fill="none" stroke="#2563EB" strokeWidth="4" />
    <path d="M37 37 L50 50" stroke="#2563EB" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M22 31 L26 25 L30 27 L35 20" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M32 20 H35 V23" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

// 19. Google Analytics
const GoogleAnalyticsIcon = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 sm:w-9 sm:h-9">
    <title>Google Analytics</title>
    <path d="M68 20 H86 V80 H68 Z" fill="#F9AB00" rx="9" />
    <path d="M41 42 H59 V80 H41 Z" fill="#E37400" rx="9" />
    <circle cx="23" cy="71" r="9" fill="#E37400" />
  </svg>
);

// 20. Social Media Marketing
const SocialMediaIcon = () => (
  <svg viewBox="0 0 64 64" className="w-8 h-8 sm:w-9 sm:h-9">
    <title>Social Media Marketing</title>
    <rect width="64" height="64" rx="14" fill="#F3E8FF" stroke="#A855F7" strokeWidth="2.5" />
    <circle cx="20" cy="32" r="6" fill="#8B5CF6" />
    <circle cx="44" cy="18" r="6" fill="#EC4899" />
    <circle cx="44" cy="46" r="6" fill="#06B6D4" />
    <path d="M25 29 L39 21 M25 35 L39 43" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// 21. WhatsApp Marketing
const WhatsappIcon = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 sm:w-9 sm:h-9">
    <title>WhatsApp</title>
    <circle cx="50" cy="50" r="46" fill="#25D366" />
    <path
      d="M50 20 A30 30 0 0 0 24 64 L20 80 L37 76 A30 30 0 1 0 50 20 Z"
      fill="#25D366"
    />
    <path
      d="M38 34 C36 34 34 36 34 38 C34 44 40 56 48 60 C53 62 57 60 58 57 L61 52 C62 50 61 49 59 48 L54 46 C52 45 51 46 50 47 L48 49 C45 47 43 45 41 42 L43 40 C44 39 44 38 43 36 L41 31 C40 29 39 29 38 34 Z"
      fill="#ffffff"
    />
  </svg>
);

// 22. Computer Networking
const NetworkingIcon = () => (
  <svg viewBox="0 0 64 64" className="w-8 h-8 sm:w-9 sm:h-9">
    <title>Computer Networking</title>
    <rect width="64" height="64" rx="14" fill="#F0F9FF" stroke="#0284C7" strokeWidth="2.5" />
    <rect x="22" y="14" width="20" height="12" rx="3" fill="#0284C7" />
    <rect x="10" y="38" width="18" height="12" rx="3" fill="#0369A1" />
    <rect x="36" y="38" width="18" height="12" rx="3" fill="#0369A1" />
    <path d="M32 26 V32 M19 32 H45 M19 32 V38 M45 32 V38" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// 23. IT Support
const ItSupportIcon = () => (
  <svg viewBox="0 0 64 64" className="w-8 h-8 sm:w-9 sm:h-9">
    <title>IT Support</title>
    <rect width="64" height="64" rx="14" fill="#F0FDFA" stroke="#0D9488" strokeWidth="2.5" />
    <path d="M18 34 C18 24 24 16 32 16 C40 16 46 24 46 34" fill="none" stroke="#0D9488" strokeWidth="4" strokeLinecap="round" />
    <rect x="14" y="32" width="7" height="12" rx="3" fill="#0D9488" />
    <rect x="43" y="32" width="7" height="12" rx="3" fill="#0D9488" />
    <path d="M47 40 C47 46 41 50 35 50 H32" fill="none" stroke="#0D9488" strokeWidth="3" strokeLinecap="round" />
    <circle cx="30" cy="50" r="3" fill="#14B8A6" />
  </svg>
);

// 24. System Administration
const SysAdminIcon = () => (
  <svg viewBox="0 0 64 64" className="w-8 h-8 sm:w-9 sm:h-9">
    <title>System Administration</title>
    <rect width="64" height="64" rx="14" fill="#F8FAFC" stroke="#475569" strokeWidth="2.5" />
    <rect x="14" y="16" width="36" height="12" rx="3" fill="#334155" />
    <rect x="14" y="36" width="36" height="12" rx="3" fill="#334155" />
    <circle cx="20" cy="22" r="2" fill="#22C55E" />
    <circle cx="26" cy="22" r="2" fill="#38BDF8" />
    <circle cx="20" cy="42" r="2" fill="#22C55E" />
    <circle cx="26" cy="42" r="2" fill="#38BDF8" />
    <path d="M42 22 H44 M42 42 H44" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// 25. Cybersecurity
const CybersecurityIcon = () => (
  <svg viewBox="0 0 64 64" className="w-8 h-8 sm:w-9 sm:h-9">
    <title>Cybersecurity</title>
    <rect width="64" height="64" rx="14" fill="#ECFDF5" stroke="#10B981" strokeWidth="2.5" />
    <path
      d="M32 14 L46 20 V33 C46 42 39 49 32 52 C25 49 18 42 18 33 V20 Z"
      fill="#10B981"
    />
    <circle cx="32" cy="30" r="3" fill="#FFFFFF" />
    <path d="M32 33 V38" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// 26. Canva
const CanvaIcon = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 sm:w-9 sm:h-9">
    <title>Canva</title>
    <circle cx="50" cy="50" r="48" fill="#00C4CC" />
    <text
      x="50"
      y="64"
      fontFamily="Georgia, serif"
      fontStyle="italic"
      fontWeight="bold"
      fontSize="44"
      fill="#FFFFFF"
      textAnchor="middle"
    >
      C
    </text>
  </svg>
);

// 27. Graphic Design
const GraphicDesignIcon = () => (
  <svg viewBox="0 0 64 64" className="w-8 h-8 sm:w-9 sm:h-9">
    <title>Graphic Design</title>
    <rect width="64" height="64" rx="14" fill="#FDF2F8" stroke="#EC4899" strokeWidth="2.5" />
    <path d="M22 42 L38 26 L46 30 L42 46 Z" fill="#EC4899" opacity="0.2" />
    <path
      d="M44 18 C46 16 50 16 52 18 C54 20 54 24 52 26 L38 40 L28 44 L32 34 Z"
      fill="#DB2777"
    />
    <circle cx="48" cy="22" r="2.5" fill="#FFFFFF" />
    <path d="M28 44 L16 52" stroke="#BE185D" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// 28. Figma
const FigmaIcon = () => (
  <svg viewBox="0 0 38 57" className="w-7 h-9 sm:w-8 sm:h-10">
    <title>Figma</title>
    <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
    <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
    <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
    <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
    <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
  </svg>
);

/* ================= 28 PROFESSIONAL SKILLS DATA ================= */
// Row 1: Full-Stack Development & Dev Tools (14 skills)
export const ROW_1_SKILLS = [
  { id: 'react', name: 'React.js', icon: <ReactIcon /> },
  { id: 'nextjs', name: 'Next.js', icon: <NextjsIcon /> },
  { id: 'javascript', name: 'JavaScript', icon: <JavaScriptIcon /> },
  { id: 'nodejs', name: 'Node.js', icon: <NodejsIcon /> },
  { id: 'express', name: 'Express.js', icon: <ExpressIcon /> },
  { id: 'mongodb', name: 'MongoDB', icon: <MongoDbIcon /> },
  { id: 'laravel', name: 'Laravel', icon: <LaravelIcon /> },
  { id: 'php', name: 'PHP', icon: <PhpIcon /> },
  { id: 'mysql', name: 'MySQL', icon: <MysqlIcon /> },
  { id: 'git', name: 'Git', icon: <GitIcon /> },
  { id: 'github', name: 'GitHub', icon: <GithubIcon /> },
  { id: 'postman', name: 'Postman', icon: <PostmanIcon /> },
  { id: 'restapi', name: 'REST API', icon: <RestApiIcon /> },
  { id: 'docker', name: 'Docker', icon: <DockerIcon /> },
];

// Row 2: Linux, Digital Marketing, Networking & Design (14 skills)
export const ROW_2_SKILLS = [
  { id: 'linux', name: 'Linux', icon: <LinuxIcon /> },
  { id: 'meta-ads', name: 'Meta Ads', icon: <MetaAdsIcon /> },
  { id: 'google-ads', name: 'Google Ads', icon: <GoogleAdsIcon /> },
  { id: 'seo', name: 'SEO', icon: <SeoIcon /> },
  { id: 'google-analytics', name: 'Google Analytics', icon: <GoogleAnalyticsIcon /> },
  { id: 'social-media', name: 'Social Media', icon: <SocialMediaIcon /> },
  { id: 'whatsapp-marketing', name: 'WhatsApp Marketing', icon: <WhatsappIcon /> },
  { id: 'networking', name: 'Networking', icon: <NetworkingIcon /> },
  { id: 'it-support', name: 'IT Support', icon: <ItSupportIcon /> },
  { id: 'sysadmin', name: 'System Admin', icon: <SysAdminIcon /> },
  { id: 'cybersecurity', name: 'Cybersecurity', icon: <CybersecurityIcon /> },
  { id: 'canva', name: 'Canva', icon: <CanvaIcon /> },
  { id: 'graphic-design', name: 'Graphic Design', icon: <GraphicDesignIcon /> },
  { id: 'figma', name: 'Figma', icon: <FigmaIcon /> },
];

/* Individual Skill Card Component */
function SkillCard({ item }) {
  return (
    <div
      className="flex flex-col items-center justify-center p-3 sm:p-4 w-[150px] sm:w-[165px] h-[96px] sm:h-[104px] shrink-0 bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-blue-400 hover:bg-blue-50/25 hover:shadow-md transition-all duration-200 group cursor-pointer select-none"
    >
      <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center mb-2 shrink-0">
        {item.icon}
      </div>
      <span className="text-xs sm:text-sm font-semibold text-slate-700 group-hover:text-blue-600 text-center whitespace-nowrap tracking-tight transition-colors">
        {item.name}
      </span>
    </div>
  );
}

export default function ProfessionalSkillsMarquee() {
  // Quadruple the sets to guarantee seamless infinite continuity on 4K/ultra-wide screens
  const quadRow1 = [...ROW_1_SKILLS, ...ROW_1_SKILLS, ...ROW_1_SKILLS, ...ROW_1_SKILLS];
  const quadRow2 = [...ROW_2_SKILLS, ...ROW_2_SKILLS, ...ROW_2_SKILLS, ...ROW_2_SKILLS];

  return (
    <section
      className="py-14 sm:py-20 bg-[#F8FAFC] border-b border-slate-200/80 overflow-hidden relative"
      id="skills-marquee"
    >
      {/* Subtle Ambient Radial Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45rem] h-[22rem] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center relative z-10">
        {/* Small Label */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-[var(--brand-primary,#3B66D4)] text-[11px] font-extrabold tracking-widest uppercase mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[var(--brand-secondary,#F58220)]" />
          <span>MY PROFESSIONAL TOOLKIT</span>
        </div>

        {/* Section Heading */}
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2.5">
          Technologies &amp; Skills
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Tools, technologies and expertise that power my development, IT and digital marketing work.
        </p>
      </div>

      {/* Marquee Track Container with Left and Right Edge Fade Gradients */}
      <div className="relative w-full space-y-4 sm:space-y-6 overflow-hidden">
        {/* Left Edge Luxury Gradient Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-[#F8FAFC] via-[#F8FAFC]/90 to-transparent z-20 pointer-events-none" />

        {/* Right Edge Luxury Gradient Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-[#F8FAFC] via-[#F8FAFC]/90 to-transparent z-20 pointer-events-none" />

        {/* ================= ROW 1: RIGHT TO LEFT AUTO-SLIDE (Medium, Smooth 48s Loop) ================= */}
        <div className="overflow-hidden flex w-full">
          <motion.div
            className="flex items-center gap-4 sm:gap-6 py-2 px-2 w-max"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 48,
                ease: 'linear',
              },
            }}
          >
            {quadRow1.map((skill, idx) => (
              <SkillCard key={`row1-${skill.id}-${idx}`} item={skill} />
            ))}
          </motion.div>
        </div>

        {/* ================= ROW 2: LEFT TO RIGHT AUTO-SLIDE (Medium, Smooth 54s Loop) ================= */}
        <div className="overflow-hidden flex w-full">
          <motion.div
            className="flex items-center gap-4 sm:gap-6 py-2 px-2 w-max"
            animate={{ x: ['-50%', '0%'] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 54,
                ease: 'linear',
              },
            }}
          >
            {quadRow2.map((skill, idx) => (
              <SkillCard key={`row2-${skill.id}-${idx}`} item={skill} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

