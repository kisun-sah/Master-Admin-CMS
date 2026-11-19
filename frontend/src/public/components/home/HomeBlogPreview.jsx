import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { resolveMediaUrl } from '../../lib/api';
import { FadeUp, StaggerContainer, StaggerItem } from '../common/ScrollReveal';

export default function HomeBlogPreview({ blogs = [] }) {
  // Default high-quality fallbacks if CMS database has fewer than 3 published blogs
  const defaultBlogs = [
    {
      _id: 'def-blog-1',
      title: 'NYC MUN 2026 | Model United Nations Conference in Sano Thimi Bhaktapur | Full Highlights',
      slug: 'nyc-mun-2026-full-highlights',
      excerpt:
        "NYC MUN 2026 — Full Event Recap & Highlights. When young voices rise to solve global challenges, history doesn't just happen — it echoes. From May 22nd to...",
      featuredImage:
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
    },
    {
      _id: 'def-blog-2',
      title: "PABSON's Scandinavia Exposure Visit 2025",
      slug: 'pabsons-scandinavia-exposure-visit-2025',
      excerpt: 'Introduction: Learning Beyond Borders in an international educational environment...',
      featuredImage:
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop',
    },
    {
      _id: 'def-blog-3',
      title: 'GHF MUN Vietnam 2025: A Successful Global Leadership Experience for Youth',
      slug: 'ghf-mun-vietnam-2025-leadership-experience',
      excerpt: 'GHF MUN Vietnam 2025: A Successful Global Leadership youth conference and training...',
      featuredImage:
        'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop',
    },
  ];

  // Strictly filter published blogs and avoid duplicate slugs/ids
  const displayItems = useMemo(() => {
    const published = Array.isArray(blogs)
      ? blogs.filter((b) => !b.status || b.status === 'published')
      : [];

    const existingSlugs = new Set(published.map((b) => b.slug));
    const merged = [...published];

    for (const def of defaultBlogs) {
      if (merged.length >= 3) break;
      if (!existingSlugs.has(def.slug)) {
        merged.push(def);
        existingSlugs.add(def.slug);
      }
    }

    return merged.slice(0, 3);
  }, [blogs]);

  const featured = displayItems[0];
  const sideItems = displayItems.slice(1, 3);

  const getImageUrl = (item, fallback) => {
    if (item?.featuredImage) return resolveMediaUrl(item.featuredImage);
    return fallback;
  };

  return (
    <section className="py-16 sm:py-20 bg-white relative overflow-hidden" id="blog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <FadeUp className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#234289] tracking-tight">
            Our News & Events
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            Stay updated with the latest activities, insights, and happenings from our foundation.
          </p>
        </FadeUp>

        {/* 2-Column Layout: 1 Featured Left + 2 Stacked Right */}
        <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Big Featured News Card */}
          <StaggerItem preset="card-reveal" className="lg:col-span-7 flex flex-col">
            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col h-full group">
              <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[420px] overflow-hidden bg-slate-900">
                <img
                  src={getImageUrl(featured, defaultBlogs[0].featuredImage)}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultBlogs[0].featuredImage;
                  }}
                />

                {/* Dark Gradient Overlay for Crisp Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none" />

                {/* Overlaid Title, Excerpt & Read More Button */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-col items-start text-left z-10">
                  <h3 className="text-white font-bold text-lg sm:text-xl lg:text-2xl leading-snug line-clamp-3 mb-2.5 drop-shadow-sm">
                    <Link
                      to={`/blog/${featured.slug}`}
                      className="hover:underline hover:text-blue-100 transition-colors"
                    >
                      {featured.title}
                    </Link>
                  </h3>

                  <p className="text-slate-200 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-5 drop-shadow-sm max-w-xl">
                    {featured.excerpt}
                  </p>

                  <Link
                    to={`/blog/${featured.slug}`}
                    className="inline-flex items-center justify-center bg-[#234289] hover:bg-[#1a336c] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-md shadow-md transition-all duration-200 hover:shadow-lg active:scale-95"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          </StaggerItem>

          {/* Right Column: 2 Stacked Cards + View All Button */}
          <div className="lg:col-span-5 flex flex-col justify-between py-1">
            <div className="space-y-6 sm:space-y-8">
              {sideItems.map((blog, idx) => {
                const img = getImageUrl(blog, defaultBlogs[idx + 1]?.featuredImage);

                return (
                  <StaggerItem
                    preset="card-reveal"
                    key={blog._id || idx}
                    className="flex flex-col sm:flex-row gap-4 items-start sm:items-center group"
                  >
                    {/* Thumbnail Image */}
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="w-full sm:w-44 md:w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 block shadow-sm border border-slate-100"
                    >
                      <img
                        src={img}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = defaultBlogs[idx + 1]?.featuredImage || defaultBlogs[0].featuredImage;
                        }}
                      />
                    </Link>

                    {/* Content */}
                    <div className="flex-1 min-w-0 text-left">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-[#234289] transition-colors mb-1.5">
                        <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2.5">
                        {blog.excerpt}
                      </p>

                      <Link
                        to={`/blog/${blog.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#234289] hover:text-[#1a336c] transition-colors"
                      >
                        <span>Continue Reading</span>
                        <span>&rarr;</span>
                      </Link>
                    </div>
                  </StaggerItem>
                );
              })}
            </div>

            {/* View All Button */}
            <div className="pt-6 sm:pt-4 text-left">
              <Link
                to="/blog"
                className="inline-flex items-center justify-center bg-[#234289] hover:bg-[#1a336c] text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-md shadow-md transition-all duration-200 hover:shadow-lg active:scale-95"
              >
                View All
              </Link>
            </div>
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}
