import React from 'react';
import { resolveMediaUrl } from '../../lib/api';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Quote,
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
            className="py-16 text-center relative overflow-hidden bg-gradient-to-b from-blue-50/70 to-white rounded-3xl p-8 mb-12 border border-slate-200/80 shadow-sm"
          >
            <div className="max-w-3xl mx-auto">
              {block.subtitle && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[var(--brand-primary,#3B66D4)] text-xs font-bold uppercase mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{block.subtitle}</span>
                </div>
              )}
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-6">
                {block.title}
              </h2>
              {block.content && (
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
                  {block.content}
                </p>
              )}
              {block.buttonText && block.buttonLink && (
                <Link
                  to={block.buttonLink}
                  className="px-8 py-3.5 rounded-full bg-[var(--brand-primary,#3B66D4)] hover:bg-blue-700 text-white font-bold text-sm inline-flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-transform hover:scale-105"
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
          <section key={idx} className="my-10 max-w-none">
            {block.title && (
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
                {block.title}
              </h2>
            )}
            <div
              className="text-slate-700 leading-relaxed space-y-4 text-base"
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
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {block.title}
                </h2>
                {block.content && (
                  <p className="text-slate-600 text-sm mt-2">{block.content}</p>
                )}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featureItems.map((f, fIdx) => (
                <div key={fIdx} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[var(--brand-primary,#3B66D4)] flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.desc || f.content}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case 'cta':
        return (
          <section
            key={idx}
            className="my-14 bg-gradient-to-tr from-[var(--brand-primary,#3B66D4)] to-blue-600 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl"
          >
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              {block.title || 'Ready to Scale Your Digital Presence?'}
            </h2>
            <p className="text-base text-blue-100 max-w-2xl mx-auto mb-8">
              {block.content || 'Get a custom website or IT infrastructure solution built for your business today.'}
            </p>
            <Link
              to={block.buttonLink || '/contact'}
              className="px-8 py-3.5 rounded-full bg-white text-[var(--brand-primary,#3B66D4)] hover:bg-blue-50 font-bold text-sm inline-flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
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
              <div key={sIdx} className="bg-white rounded-2xl p-6 text-center border border-slate-200/80 shadow-sm">
                <div className="text-3xl font-extrabold text-[var(--brand-primary,#3B66D4)] mb-1">{st.value}</div>
                <div className="text-xs text-slate-600 font-medium">{st.label}</div>
              </div>
            ))}
          </section>
        );

      case 'testimonials':
        return (
          <section key={idx} className="my-14 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm text-center">
            <Quote className="w-10 h-10 text-blue-200 mx-auto mb-4" />
            <p className="text-lg text-slate-700 italic mb-4 max-w-2xl mx-auto">
              "{block.content || 'Outstanding engineering quality and lightning fast delivery.'}"
            </p>
            <div className="font-bold text-slate-900 text-sm">{block.title || 'Satisfied Enterprise Client'}</div>
          </section>
        );

      case 'faq':
        return (
          <section key={idx} className="my-14 space-y-4">
            {block.title && <h2 className="text-2xl font-bold text-slate-900 mb-6">{block.title}</h2>}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
              <div className="font-bold text-slate-900 mb-2">{block.title || 'FAQ Question'}</div>
              <div className="text-sm text-slate-600 leading-relaxed">{block.content}</div>
            </div>
          </section>
        );

      case 'image_gallery':
        const galleryImages = block.images || [];
        return (
          <section key={idx} className="my-14">
            {block.title && <h2 className="text-2xl font-bold text-slate-900 mb-6">{block.title}</h2>}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((img, iIdx) => (
                <div key={iIdx} className="aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
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
            <div className="sticky top-28 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Need This Solution?</h3>
              <p className="text-xs text-slate-600">
                Book a consultation or order this custom architecture for your business.
              </p>
              <Link
                to="/contact"
                className="w-full py-3 rounded-full bg-[var(--brand-primary,#3B66D4)] hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/25 transition-transform hover:scale-105"
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
