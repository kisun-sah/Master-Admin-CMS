import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/layout/SEOHead';
import ScrollReveal, { StaggerContainer, StaggerItem } from '../components/common/ScrollReveal';
import { getBlogs, getPageBySlug, resolveMediaUrl } from '../lib/api';
import { useCms } from '../context/CmsContext';
import {
  Calendar,
  User,
  Search,
  Sparkles,
  Clock,
  ArrowRight,
  PhoneCall,
  Mail,
  CheckCircle2,
} from 'lucide-react';

export default function BlogPage() {
  const { settings, pages } = useCms();
  const [blogs, setBlogs] = useState([]);
  const [cmsPage, setCmsPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const defaultBlogs = [
    {
      _id: 'b-1',
      title: 'Architecting High-Throughput Modern Web Applications with MERN',
      slug: 'architecting-high-throughput-web-apps',
      excerpt:
        'A comprehensive guide to database indexing, redis caching, and server-side rendering for enterprise scale.',
      category: 'Engineering',
      authorName: 'Alex Carter',
      readingTimeMinutes: 6,
      publishDate: '2026-03-23',
      featuredImage:
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
    },
    {
      _id: 'b-2',
      title: 'How AI Automation & Chatbots Reduce Customer SLA by 70%',
      slug: 'ai-automation-and-chatbots-sla',
      excerpt:
        'Case studies and implementation patterns for deploying fine-tuned LLM agents into enterprise operations.',
      category: 'AI & Automation',
      authorName: 'Sarah Jenkins',
      readingTimeMinutes: 5,
      publishDate: '2026-03-10',
      featuredImage:
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
    },
    {
      _id: 'b-3',
      title: 'Core Web Vitals 2026: Achieving 95+ Scores on Enterprise Portals',
      slug: 'core-web-vitals-speed-optimization',
      excerpt:
        'Practical optimization techniques for reducing Interaction to Next Paint (INP) and Cumulative Layout Shift.',
      category: 'Performance',
      authorName: 'David Lee',
      readingTimeMinutes: 8,
      publishDate: '2026-02-22',
      featuredImage:
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    },
  ];

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        // 1. Fetch CMS Page info for 'blog-insights' or 'blogs' or 'blog'
        let pageData = null;
        try {
          const resPage = await getPageBySlug('blog-insights');
          if (resPage && (resPage.title || resPage._id)) {
            pageData = resPage;
          }
        } catch (e1) {
          try {
            const resPage2 = await getPageBySlug('blog');
            if (resPage2 && (resPage2.title || resPage2._id)) {
              pageData = resPage2;
            }
          } catch (e2) {
            if (Array.isArray(pages)) {
              const matched = pages.find(
                (p) =>
                  p.slug === 'blog-insights' ||
                  p.slug === 'blogs' ||
                  p.slug === 'blog'
              );
              if (matched) pageData = matched;
            }
          }
        }
        setCmsPage(pageData);

        // 2. Fetch published blogs from DB
        const resBlogs = await getBlogs();
        if (Array.isArray(resBlogs) && resBlogs.length > 0) {
          setBlogs(resBlogs.filter((b) => !b.status || b.status === 'published'));
        } else {
          setBlogs(defaultBlogs);
        }
      } catch (err) {
        setBlogs(defaultBlogs);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [pages]);

  // Extract dynamic categories from blogs
  const categories = [
    'All',
    ...Array.from(
      new Set(
        blogs
          .map((b) => b.category)
          .filter(Boolean)
          .map((c) => c.trim())
      )
    ),
  ];

  // Filtering by category & search query
  const filtered = blogs.filter((post) => {
    const matchesCat =
      selectedCategory === 'All' ||
      (post.category &&
        post.category.toLowerCase() === selectedCategory.toLowerCase());
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      post.title?.toLowerCase().includes(query) ||
      post.excerpt?.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  const featuredPost = filtered[0] || blogs[0];
  const gridPosts = filtered.length > 1 ? filtered.slice(1) : filtered;

  const pageTitle = cmsPage?.title || 'Blogs & Technical Insights';
  const pageSubtitle =
    cmsPage?.excerpt ||
    'Deep dives into software architecture, AI automation, cloud systems, and digital marketing strategies.';

  const seoTitle =
    cmsPage?.seo?.title ||
    `${pageTitle} — ${settings?.siteName || 'Tech & Engineering Insights'}`;
  const seoDescription = cmsPage?.seo?.metaDescription || pageSubtitle;
  const seoImage = resolveMediaUrl(
    cmsPage?.seo?.ogImage || cmsPage?.featuredImage || blogs[0]?.featuredImage
  );

  return (
    <div className="pt-28 pb-24 bg-white min-h-screen">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        image={seoImage}
        seoData={cmsPage?.seo}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <ScrollReveal preset="fade-in" duration={0.35}>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link to="/" className="hover:text-[var(--brand-primary,#3B66D4)] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Blogs & Insights</span>
          </div>
        </ScrollReveal>

        {/* Hero Section */}
        <ScrollReveal preset="fade-up" className="text-center max-w-3xl mx-auto mb-12">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 badge-secondary"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Articles & Thought Leadership</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            {pageTitle}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {pageSubtitle}
          </p>
        </ScrollReveal>

        {/* Search & Categories Filter Bar */}
        <ScrollReveal preset="fade-up" delay={0.08} className="max-w-2xl mx-auto mb-14 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles by title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-[var(--brand-primary,#3B66D4)] focus:bg-white shadow-xs transition-all"
            />
          </div>

          {categories.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                    selectedCategory === cat
                      ? 'bg-[var(--brand-primary,#3B66D4)] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </ScrollReveal>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-24 text-center">
            <div className="animate-spin w-10 h-10 border-4 border-[var(--brand-primary,#3B66D4)] border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-400">Loading articles...</p>
          </div>
        )}

        {/* ================= FEATURED ARTICLE SPOTLIGHT (When No Search Query) ================= */}
        {!loading && !searchQuery && selectedCategory === 'All' && featuredPost && (
          <ScrollReveal preset="fade-up" className="mb-14">
            <Link
              to={`/blog/${featuredPost.slug}`}
              className="group block bg-slate-50 rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 card-hover-lift"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto overflow-hidden bg-slate-100 relative">
                  <img
                    src={resolveMediaUrl(featuredPost.featuredImage)}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  {featuredPost.category && (
                    <span
                      className="absolute top-4 left-4 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md"
                      style={{ backgroundColor: 'var(--brand-primary, #3B66D4)' }}
                    >
                      {featuredPost.category}
                    </span>
                  )}
                </div>

                <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
                  <div>
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4 badge-secondary"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Featured Article</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-[var(--brand-primary,#3B66D4)] transition-colors leading-tight mb-4">
                      {featuredPost.title}
                    </h2>

                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-6">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-800">{featuredPost.authorName || 'Editorial Team'}</span>
                      <span>•</span>
                      <span>{featuredPost.publishDate ? new Date(featuredPost.publishDate).toLocaleDateString() : 'Recent'}</span>
                    </div>

                    <span
                      className="font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                      style={{ color: 'var(--brand-secondary, #06B6D4)' }}
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        )}

        {/* ================= ARTICLES CARDS GRID ================= */}
        {!loading && (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {gridPosts.map((post, idx) => {
              const formattedDate = post.publishDate
                ? new Date(post.publishDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recent';

              const imageSrc = resolveMediaUrl(
                post.featuredImage ||
                  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop'
              );

              return (
                <StaggerItem key={post._id || idx}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group block bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs card-hover-lift h-full flex flex-col"
                  >
                    {/* Thumbnail Image */}
                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 mb-4 relative shadow-xs">
                      <img
                        src={imageSrc}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                      {post.category && (
                        <span
                          className="absolute top-3 left-3 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs"
                          style={{ backgroundColor: 'var(--brand-primary, #3B66D4)' }}
                        >
                          {post.category}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[var(--brand-primary,#3B66D4)] transition-colors leading-snug line-clamp-2 mb-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-grow">
                      {post.excerpt}
                    </p>

                    {/* Meta Row */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-slate-700 truncate max-w-[110px]">
                          {post.authorName || 'Author'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formattedDate}</span>
                        </span>

                        <span
                          className="font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform"
                          style={{ color: 'var(--brand-secondary, #06B6D4)' }}
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}

        {/* Empty Search State */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-2">No matching articles found</h3>
            <p className="text-xs text-slate-500 mb-6">
              Try adjusting your search keywords or clear filters to see all articles.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="btn-primary-brand px-6 py-2.5 rounded-full text-xs font-bold text-white shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* ================= TECH NEWSLETTER SUBSCRIPTION BOX ================= */}
        <ScrollReveal preset="fade-up" className="rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, var(--brand-primary, #3B66D4) 100%)',
          }}
        >
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 badge-secondary"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Engineering Newsletter</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
              Stay Ahead of Enterprise Technology Trends
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed mb-6">
              Subscribe to get curated insights on full-stack web engineering, AI orchestration, cloud DevOps,
              and CMS optimization delivered monthly. Zero spam.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for subscribing to our engineering newsletter!');
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-lg"
            >
              <input
                type="email"
                required
                placeholder="Enter your corporate email..."
                className="flex-grow px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-blue-200 text-sm focus:outline-none focus:bg-white/20"
              />
              <button
                type="submit"
                className="btn-secondary-brand px-6 py-3 rounded-full text-sm font-bold text-white shadow-md hover:scale-105 transition-transform"
              >
                Subscribe
              </button>
            </form>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
