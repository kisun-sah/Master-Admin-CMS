import React from 'react';
import { resolveMediaUrl } from '../../lib/api';
import {
  X,
  ExternalLink,
  ShoppingBag,
  Star,
  Activity,
  Layers,
  Sparkles,
  Check,
} from 'lucide-react';

export default function DevicePreviewModal({ project, onClose, onBuy }) {
  if (!project) return null;

  const imageSrc = resolveMediaUrl(
    project.coverImage ||
      project.imageUrl ||
      project.images?.[0]?.imageUrl ||
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop'
  );

  const techStack = project.techStack || [
    'Next.js 15',
    'Tailwind CSS',
    'Node.js',
    'MongoDB / Postgres',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl glass-panel rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          aria-label="Close Preview"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Multi-Device Responsive Frame (Desktop iMac + Mobile Phone) */}
        <div className="lg:w-3/5 bg-[#070A10] p-6 sm:p-10 flex items-center justify-center relative overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-transparent pointer-events-none" />

          <div className="relative w-full max-w-lg">
            {/* Desktop iMac / Monitor Frame */}
            <div className="rounded-2xl border-4 border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
              {/* Browser Bar */}
              <div className="h-6 bg-slate-800 flex items-center px-3 gap-1.5 border-b border-slate-700">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                <div className="mx-auto text-[10px] text-slate-400 font-mono">
                  {project.slug || 'template-demo.app'}
                </div>
              </div>

              {/* Website Screen */}
              <div className="aspect-[16/10] overflow-hidden bg-slate-950 relative">
                <img
                  src={imageSrc}
                  alt={project.title}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* iMac Stand */}
            <div className="w-24 h-4 bg-slate-700 mx-auto rounded-b-md" />
            <div className="w-36 h-2 bg-slate-800 mx-auto rounded-full mt-0.5 shadow-md" />

            {/* Mobile Smartphone Overlay (Bottom Left) */}
            <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-32 sm:w-36 rounded-2xl border-4 border-slate-800 bg-slate-950 shadow-2xl overflow-hidden ring-2 ring-white/10">
              <div className="h-3 bg-slate-900 flex justify-center items-center">
                <div className="w-8 h-1 bg-slate-700 rounded-full" />
              </div>
              <div className="aspect-[9/16] overflow-hidden">
                <img
                  src={imageSrc}
                  alt="Mobile view"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Details, Pricing, & Action Buttons */}
        <div className="lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            {/* Category / Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Built with Master Admin CMS</span>
            </div>

            {/* Project Title */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-300 leading-relaxed">
              {project.description ||
                'A fully featured, high-performance online platform with automated inventory, dynamic CMS block management, fast checkout, and a master admin control panel.'}
            </p>

            {/* Tech Stack Pills */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-slate-400 mb-2">
                Technologies & Architecture:
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10">
              <div className="glass-panel p-2.5 rounded-xl text-center">
                <div className="text-[10px] text-slate-400">Live Rating</div>
                <div className="text-sm font-bold text-amber-400 flex items-center justify-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>4.9/5</span>
                </div>
              </div>
              <div className="glass-panel p-2.5 rounded-xl text-center">
                <div className="text-[10px] text-slate-400">Page Load</div>
                <div className="text-sm font-bold text-cyan-400">0.4s</div>
              </div>
              <div className="glass-panel p-2.5 rounded-xl text-center">
                <div className="text-[10px] text-slate-400">CMS Control</div>
                <div className="text-sm font-bold text-emerald-400">100%</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-6 border-t border-white/10">
            <a
              href={project.demoUrl || `/gallery/${project.slug || ''}`}
              target={project.demoUrl ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="w-full py-3.5 btn-primary-glow font-bold text-sm flex items-center justify-center gap-2 shadow-neon-cyan"
            >
              <span>Live Demo & Case Study</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={() => (onBuy ? onBuy(project) : window.location.assign('/contact'))}
              className="w-full py-3 rounded-full glass-panel border border-white/20 text-white font-semibold text-sm hover:bg-white/10 hover:border-cyan-400/50 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              <span>Deploy / Buy Template ($149 or Custom Quote)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
