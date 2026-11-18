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

  const dynamicItems =
    partners && partners.length > 0 ? partners : defaultTechStack;

  const marqueeItems = [...dynamicItems, ...dynamicItems, ...dynamicItems];

  return (
    <section className="py-10 border-y border-slate-200/80 bg-[#F8FAFC] overflow-hidden relative">
      {/* Edge fade gradients for daylight */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
        <p className="text-xs font-extrabold tracking-widest uppercase text-slate-500">
          Trusted Technologies & Business Partners
        </p>
      </div>

      {/* Infinite scrolling track */}
      <div className="flex gap-6 items-center whitespace-nowrap animate-marquee">
        {marqueeItems.map((item, idx) => {
          const hasImage = Boolean(item.logoUrl);
          const IconComponent = item.icon || Layers;

          return (
            <div
              key={idx}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-default group"
            >
              {hasImage ? (
                <img
                  src={resolveMediaUrl(item.logoUrl)}
                  alt={item.name}
                  className="h-6 w-auto object-contain max-w-[100px]"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[var(--brand-primary,#3B66D4)] flex items-center justify-center">
                  <IconComponent className="w-4 h-4" />
                </div>
              )}
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 group-hover:text-[var(--brand-primary,#3B66D4)] transition-colors">
                  {item.name}
                </span>
                {item.subtitle && (
                  <span className="text-[10px] text-slate-500 font-medium">
                    {item.subtitle}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
