import React from 'react';
import { resolveMediaUrl } from '../../lib/api';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Quote,
  Star,
  ExternalLink,
} from 'lucide-react';

export default function BlockRenderer({ blocks = [], layout = 'default' }) {
  if (!blocks || blocks.length === 0) return null;

  // Sort blocks by order property
  const sortedBlocks = [...blocks].sort((a, b) => (a.order || 0) - (b.order || 0));

  const renderBlock = (block, idx) => {
    switch (block.type) {
      case 'hero':
        return (
          <section
            key={idx}
            className="py-20 text-center relative overflow-hidden bg-gradient-to-b from-indigo-950/20 to-transparent rounded-3xl p-8 mb-12 border border-white/10"
          >
            <div className="max-w-3xl mx-auto">
              {block.subtitle && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{block.subtitle}</span>
                </div>
              )}
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">
                {block.title}
              </h2>
              {block.content && (
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
                  {block.content}
                </p>
              )}
              {block.buttonText && block.buttonLink && (
                <Link
                  to={block.buttonLink}
                  className="px-8 py-3.5 btn-primary-glow font-bold text-sm inline-flex items-center gap-2 shadow-neon-cyan"
                >
                  <span>{block.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </section>
        );

      case 'rich_text':
        return (
          <section key={idx} className="my-10 prose prose-invert max-w-none">
            {block.title && (
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                {block.title}
              </h2>
            )}
            <div
              className="text-slate-300 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: block.content || '' }}
            />
          </section>
        );

      case 'features':
        const featureItems = block.items || [
          { title: 'Full MERN Stack Engineering', desc: 'React 18, Node.js ES Modules, and MongoDB.' },
          { title: '100% Dynamic Master CMS', desc: 'Complete content and media autonomy.' },
          { title: 'Enterprise Security', desc: 'Secure HttpOnly session guards and CSRF defense.' },
        ];
        return (
          <section key={idx} className="my-14">
            {block.title && (
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {block.title}
                </h2>
                {block.content && (
                  <p className="text-slate-400 text-sm mt-2">{block.content}</p>
                )}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featureItems.map((f, fIdx) => (
                <div key={fIdx} className="glass-card rounded-2xl p-6 border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc || f.content}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case 'cta':
        return (
          <section
            key={idx}
            className="my-14 glass-panel rounded-3xl p-8 sm:p-12 border border-cyan-500/30 text-center relative overflow-hidden bg-gradient-to-tr from-cyan-950/30 to-indigo-950/30"
          >
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              {block.title || 'Ready to Scale Your Digital Presence?'}
            </h2>
            <p className="text-base text-slate-300 max-w-2xl mx-auto mb-8">
              {block.content || 'Get a custom website or IT infrastructure solution built for your business today.'}
            </p>
            <Link
              to={block.buttonLink || '/contact'}
              className="px-8 py-3.5 btn-primary-glow font-bold text-sm inline-flex items-center gap-2"
            >
              <span>{block.buttonText || 'Schedule Free Consultation'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        );

      case 'stats':
        const statsList = block.items || [
          { value: '50+', label: 'Delivered Sites' },
          { value: '99.9%', label: 'Uptime' },
          { value: '3.8x', label: 'ROI Growth' },
          { value: '24/7', label: 'SLA' },
        ];
        return (
          <section key={idx} className="my-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {statsList.map((st, sIdx) => (
              <div key={sIdx} className="glass-panel rounded-2xl p-6 text-center border border-white/10">
                <div className="text-3xl font-extrabold text-cyan-400 mb-1">{st.value}</div>
                <div className="text-xs text-slate-400">{st.label}</div>
              </div>
            ))}
          </section>
        );

      case 'testimonials':
        return (
          <section key={idx} className="my-14 glass-card rounded-3xl p-8 border border-white/10 text-center">
            <Quote className="w-10 h-10 text-cyan-400/30 mx-auto mb-4" />
            <p className="text-lg text-slate-200 italic mb-4 max-w-2xl mx-auto">
              "{block.content || 'Outstanding engineering quality and lightning fast delivery.'}"
            </p>
            <div className="font-bold text-white text-sm">{block.title || 'Satisfied Enterprise Client'}</div>
          </section>
        );

      case 'faq':
        return (
          <section key={idx} className="my-14 space-y-4">
            {block.title && <h2 className="text-2xl font-bold text-white mb-6">{block.title}</h2>}
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <div className="font-bold text-white mb-2">{block.title || 'FAQ Question'}</div>
              <div className="text-sm text-slate-300 leading-relaxed">{block.content}</div>
            </div>
          </section>
        );

      case 'image_gallery':
        const galleryImages = block.images || [];
        return (
          <section key={idx} className="my-14">
            {block.title && <h2 className="text-2xl font-bold text-white mb-6">{block.title}</h2>}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((img, iIdx) => (
                <div key={iIdx} className="aspect-video rounded-xl overflow-hidden bg-slate-900 border border-white/10">
                  <img
                    src={resolveMediaUrl(img.url || img)}
                    alt={img.altText || 'Gallery item'}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        );

      case 'spacer':
        return <div key={idx} style={{ height: `${block.height || 48}px` }} />;

      default:
        return null;
    }
  };

  // Layout presentation wrappers
  if (layout === 'sidebar') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">{sortedBlocks.map(renderBlock)}</div>
          <div className="lg:col-span-4">
            <div className="sticky top-28 glass-card rounded-3xl p-6 border border-white/10 space-y-4">
              <h3 className="text-lg font-bold text-white">Need This Solution?</h3>
              <p className="text-xs text-slate-400">
                Book a consultation or order this custom architecture for your business.
              </p>
              <Link
                to="/contact"
                className="w-full py-3 btn-primary-glow font-bold text-xs flex items-center justify-center gap-1.5 shadow-neon-cyan"
              >
                <span>Request Custom Quote &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'full_width') {
    return <div className="w-full py-8">{sortedBlocks.map(renderBlock)}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {sortedBlocks.map(renderBlock)}
    </div>
  );
}
