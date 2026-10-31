import React from 'react';
import { Link } from 'react-router-dom';
import { resolveMediaUrl } from '../../lib/api';
import { Sparkles, ArrowRight, Clock, Calendar, User } from 'lucide-react';

export default function HomeBlogPreview({ blogs = [] }) {
  const defaultBlogs = [
    {
      title: 'Designing Decoupled CMS Architectures in 2026',
      slug: 'designing-decoupled-cms-architectures-2026',
      excerpt:
        'Why modern enterprises are separating admin control planes from diverse consumer client applications.',
      category: 'Architecture',
      readingTimeMinutes: 4,
      publishDate: '2026-10-28',
      authorName: 'Alex Carter',
      featuredImage:
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'Securing Server-Validated Cookies and Eliminating XSS',
      slug: 'securing-server-validated-cookies-and-eliminating-xss',
      excerpt:
        'A deep-dive into why opaque HttpOnly cookies outshine localStorage tokens for mission-critical web portals.',
      category: 'Security',
      readingTimeMinutes: 5,
      publishDate: '2026-10-25',
      authorName: 'Alex Carter',
      featuredImage:
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'How to Build and Sell Custom Websites with Master Admin CMS',
      slug: 'how-to-build-and-sell-custom-websites-with-master-admin-cms',
      excerpt:
        'A complete business blueprint for web agencies and freelance developers to deliver ready-to-launch portals.',
      category: 'Business Growth',
      readingTimeMinutes: 6,
      publishDate: '2026-10-20',
      authorName: 'Alex Carter',
      featuredImage:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    },
  ];

  const items = (blogs && blogs.length > 0 ? blogs : defaultBlogs).slice(0, 3);

  return (
    <section className="py-24 bg-[#090D16] relative overflow-hidden" id="blog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Engineering & Marketing Insights</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Latest Tech, AI & SEO Articles
            </h2>
          </div>

          <Link
            to="/blog"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-cyan-400 hover:text-cyan-300"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3-Column Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((post, idx) => (
            <Link
              key={idx}
              to={`/blog/${post.slug}`}
              className="glass-card rounded-2xl overflow-hidden border border-white/10 group flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden bg-slate-900 relative">
                  <img
                    src={resolveMediaUrl(
                      post.featuredImage ||
                        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop'
                    )}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md glass-panel border border-white/10 text-[11px] font-bold text-cyan-400 bg-black/60">
                    {post.category || 'Engineering'}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readingTimeMinutes || 5} min read</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      <span>{post.authorName || 'Alex Carter'}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 mb-3">
                    {post.title}
                  </h3>

                  <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0 flex items-center gap-1 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
