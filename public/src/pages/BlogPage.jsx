import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs, resolveMediaUrl } from '../lib/api';
import SEOHead from '../components/layout/SEOHead';
import {
  Sparkles,
  Search,
  Clock,
  User,
  Calendar,
  ArrowRight,
  Tag,
} from 'lucide-react';

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function load() {
      try {
        const data = await getBlogs();
        setBlogs(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Error loading blog articles:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
      tags: ['MERN', 'NodeJS', 'System Design', 'APIs'],
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
      tags: ['Security', 'OAuth', 'Cookies', 'OWASP'],
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
      tags: ['Freelance', 'CMS', 'React', 'Agency'],
    },
  ];

  const activeBlogs = blogs && blogs.length > 0 ? blogs : defaultBlogs;

  const categories = [
    'All',
    ...new Set(activeBlogs.map((b) => b.category).filter(Boolean)),
  ];

  const filtered = activeBlogs.filter((post) => {
    const matchesCat =
      selectedCategory === 'All' ||
      post.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const featuredPost = filtered[0];
  const gridPosts = filtered.slice(1);

  return (
    <div className="pt-28 pb-20 bg-[#090D16] min-h-screen">
      <SEOHead
        title="Tech, AI & Digital Marketing Blog — Tutorials & Insights"
        description="Engineering insights, Web Development tutorials, AI automation workflows, and data-driven SEO strategies from a senior full-stack architect."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tech & Digital Marketing Insights</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Engineering & Growth Articles
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Real-world guides on MERN architectures, AI chatbots, enterprise server security, and SEO.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="max-w-2xl mx-auto mb-12 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles by keyword or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full glass-panel border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'btn-primary-glow shadow-neon-cyan text-white'
                  : 'glass-panel text-slate-300 hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Big Banner Post if available */}
        {featuredPost && (
          <Link
            to={`/blog/${featuredPost.slug}`}
            className="block mb-12 glass-card rounded-3xl overflow-hidden border border-white/10 group hover:border-cyan-500/40 transition-all shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10">
              <div className="lg:col-span-7 aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900">
                <img
                  src={resolveMediaUrl(
                    featuredPost.featuredImage ||
                      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop'
                  )}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold">
                  {featuredPost.category || 'Featured Article'}
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-cyan-400 transition-colors">
                  {featuredPost.title}
                </h2>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{featuredPost.readingTimeMinutes || 5} min read</span>
                  </span>
                  <span>•</span>
                  <span>{featuredPost.authorName || 'Alex Carter'}</span>
                </div>

                <div className="pt-4 flex items-center gap-2 text-sm font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                  <span>Read Featured Story</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* 3-Column Grid for Remaining Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridPosts.map((post, idx) => (
            <Link
              key={idx}
              to={`/blog/${post.slug}`}
              className="glass-card rounded-2xl overflow-hidden border border-white/10 group flex flex-col justify-between hover:border-cyan-500/40 transition-all shadow-xl"
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
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md glass-panel border border-white/10 text-[10px] font-bold text-cyan-400 bg-black/60">
                    {post.category || 'Tech'}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readingTimeMinutes || 5} min read</span>
                    </span>
                    <span>•</span>
                    <span>{post.authorName || 'Alex Carter'}</span>
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
                <span>Read Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
