import React from 'react';
import { resolveMediaUrl } from '../../lib/api';
import {
  Code2,
  Database,
  Cpu,
  Layers,
  Sparkles,
  Server,
  Terminal,
  Globe,
} from 'lucide-react';

export default function PartnerMarquee({ partners = [] }) {
  // Built-in core tech stack matching Screenshot 3
  const defaultTechStack = [
    { name: 'React', subtitle: 'Frontend Framework', icon: Layers },
    { name: 'Node.js', subtitle: 'Runtime Engine', icon: Terminal },
    { name: 'MongoDB', subtitle: 'NoSQL Database', icon: Database },
    { name: 'Next.js', subtitle: 'Full-Stack SSR', icon: Code2 },
    { name: 'OpenAI', subtitle: 'AI & LLM Workflows', icon: Cpu },
    { name: 'Google Ads', subtitle: 'PPC & Growth', icon: Globe },
    { name: 'Python', subtitle: 'AI & Data Scripts', icon: Terminal },
    { name: 'Tailwind CSS', subtitle: 'Modern UI Engine', icon: Sparkles },
    { name: 'AWS Cloud', subtitle: 'Infra & Storage', icon: Server },
  ];

  // Combine dynamic CMS partners with tech stack
  const dynamicItems =
    partners && partners.length > 0
      ? partners
      : defaultTechStack;

  // Duplicate for seamless infinite loop
  const marqueeItems = [...dynamicItems, ...dynamicItems, ...dynamicItems];

  return (
    <section className="py-10 border-y border-white/10 bg-[#070A10]/70 overflow-hidden relative">
      {/* Subtle edge fade overlays */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#070A10] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#070A10] to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
        <p className="text-xs font-bold tracking-widest uppercase text-slate-400">
          Trusted Tech & Partners
        </p>
      </div>

      {/* Infinite scrolling track */}
      <div className="flex gap-8 items-center whitespace-nowrap animate-marquee">
        {marqueeItems.map((item, idx) => {
          const hasImage = Boolean(item.logoUrl);
          const IconComponent = item.icon || Layers;

          return (
            <div
              key={idx}
              className="inline-flex items-center gap-3 px-6 py-2.5 rounded-xl glass-card border border-white/5 hover:border-cyan-500/30 transition-all cursor-default group"
            >
              {hasImage ? (
                <img
                  src={resolveMediaUrl(item.logoUrl)}
                  alt={item.name}
                  className="h-6 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100"
                />
              ) : (
                <IconComponent className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              )}
              <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
