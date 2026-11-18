import React from 'react';
import { resolveMediaUrl } from '../../lib/api';
import {
  X,
  ExternalLink,
  ShoppingBag,
  Star,
  Sparkles,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
          aria-label="Close Preview"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Multi-Device Responsive Frame */}
        <div className="lg:w-3/5 bg-slate-100 p-6 sm:p-10 flex items-center justify-center relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200">
          <div className="relative w-full max-w-lg">
            {/* Desktop iMac / Monitor Frame */}
            <div className="rounded-2xl border-4 border-slate-300 bg-white shadow-xl overflow-hidden">
              {/* Browser Bar */}
              <div className="h-6 bg-slate-200 flex items-center px-3 gap-1.5 border-b border-slate-300">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <div className="mx-auto text-[10px] text-slate-600 font-mono">
                  {project.slug || 'template-demo.app'}
                </div>
              </div>

              {/* Viewport with screenshot */}
              <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={imageSrc}
                  alt={project.title}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Mobile Phone Mockup (Floating on bottom right) */}
            <div className="absolute -bottom-6 -right-4 w-28 sm:w-36 rounded-2xl border-4 border-slate-800 bg-slate-900 shadow-2xl overflow-hidden hidden sm:block">
              <div className="h-3 bg-slate-800 flex items-center justify-center">
                <div className="w-8 h-1 rounded-full bg-slate-700" />
              </div>
              <div className="aspect-[9/16] overflow-hidden bg-slate-100">
                <img
                  src={imageSrc}
                  alt={`${project.title} Mobile`}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Details, Pricing, & Action Buttons */}
        <div className="lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-white">
          <div className="space-y-4">
            {/* Category / Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[var(--brand-primary,#3B66D4)] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Built with Master Admin CMS</span>
            </div>

            {/* Project Title */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-600 leading-relaxed">
              {project.description ||
                'A fully featured, high-performance online platform with automated inventory, dynamic CMS block management, fast checkout, and a master admin control panel.'}
            </p>

            {/* Tech Stack Pills */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-slate-500 mb-2">
                Technologies & Architecture:
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-center">
                <div className="text-[10px] text-slate-500 font-medium">Live Rating</div>
                <div className="text-sm font-bold text-amber-500 flex items-center justify-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>4.9/5</span>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-center">
                <div className="text-[10px] text-slate-500 font-medium">Page Load</div>
                <div className="text-sm font-bold text-[var(--brand-primary,#3B66D4)]">0.4s</div>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-center">
                <div className="text-[10px] text-slate-500 font-medium">CMS Control</div>
                <div className="text-sm font-bold text-emerald-600">100%</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <a
              href={project.demoUrl || `/gallery/${project.slug || ''}`}
              target={project.demoUrl ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-xl bg-[var(--brand-primary,#3B66D4)] hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 transition-transform hover:scale-[1.01]"
            >
              <span>Live Demo & Case Study</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => (onBuy ? onBuy(project) : window.location.assign('/contact'))}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-[var(--brand-primary,#3B66D4)]" />
              <span>Deploy / Buy Template ($149 or Custom Quote)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
