import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEOHead from '../components/layout/SEOHead';
import ScrollReveal from '../components/common/ScrollReveal';
import { getBlogBySlug, getBlogs, resolveMediaUrl } from '../lib/api';
import { useCms } from '../context/CmsContext';
import {
  Calendar,
  Clock,
  User,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Share2,
  Copy,
  Check,
  ArrowLeft,
  ArrowRight,
  PhoneCall,
  MessageCircle,
  Sparkles,
} from 'lucide-react';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { settings } = useCms();
  const [post, setPost] = useState(null);
  const [latestPosts, setLatestPosts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getBlogBySlug(slug);
        setPost(data);

        // Fetch other blogs for sidebar widgets
        try {
          const allBlogs = await getBlogs();
          if (Array.isArray(allBlogs)) {
            // Latest posts (exclude current)
            const recent = allBlogs.filter((b) => b.slug !== slug).slice(0, 4);
            setLatestPosts(recent);

            // Dynamic categories
            const cats = Array.from(
              new Set(allBlogs.map((b) => b.category).filter(Boolean))
            );
            setAllCategories(cats);

            // Dynamic tags
            const tagsSet = new Set();
            allBlogs.forEach((b) => {
              if (Array.isArray(b.tags)) {
                b.tags.forEach((t) => tagsSet.add(t));
              }
            });
            setAllTags(Array.from(tagsSet));
          }
        } catch (e) {
          console.warn('Could not load latest posts for sidebar:', e);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center min-h-[60vh] flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--brand-primary,#3B66D4)] border-t-transparent" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pt-36 pb-24 text-center max-w-lg mx-auto px-4 min-h-[60vh] bg-[#F8FAFC]">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Article Not Found</h2>
        <p className="text-sm text-slate-600 mb-6">
          The requested article could not be located or has not been published yet.
        </p>
        <Link
          to="/blog"
          className="btn-primary-brand px-6 py-2.5 rounded-full text-white font-bold text-sm inline-block shadow-md"
        >
          &larr; Back to All Articles
        </Link>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const shareTitle = encodeURIComponent(post.title);

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = post.publishDate
    ? new Date(post.publishDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently Published';

  const seoTitle =
    post.seo?.title || `${post.title} — ${settings?.siteName || 'Tech & Insights'}`;
  const seoDescription = post.seo?.metaDescription || post.excerpt;
  const seoImage = resolveMediaUrl(post.seo?.ogImage || post.featuredImage);

  const displayCategories =
    allCategories.length > 0
      ? allCategories
      : ['Web Architecture', 'AI & Automation', 'Digital Marketing', 'IT Systems', 'Insights'];

  const displayTags =
    allTags.length > 0
      ? allTags
      : ['#webengineering', '#cloudscale', '#ai', '#cms', '#security'];

  const socials = settings?.socialLinks || {};
  const rawPhone = settings?.contactPhone || '01-4546038';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');

  return (
    <div className="pt-28 pb-24 bg-white min-h-screen">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        image={seoImage}
        seoData={post.seo}
        type="article"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <ScrollReveal preset="fade-in" duration={0.3}>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link to="/" className="hover:text-[var(--brand-primary,#3B66D4)]">
              Home
            </Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-[var(--brand-primary,#3B66D4)]">
              Blogs
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold truncate max-w-xs">{post.title}</span>
          </div>
        </ScrollReveal>

        {/* Top Header Meta & Title */}
        <ScrollReveal preset="fade-up" className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs sm:text-sm text-slate-500 mb-3">
            <div className="flex items-center gap-2">
              <span
                className="font-bold px-2.5 py-0.5 rounded-full text-white text-xs"
                style={{ backgroundColor: 'var(--brand-primary, #3B66D4)' }}
              >
                {post.category || 'Insights'}
              </span>
              <span>•</span>
              <span className="text-slate-500">{formattedDate}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-slate-700 font-bold text-[10px]">
                  {post.authorName ? post.authorName.charAt(0) : 'A'}
                </div>
                <span className="font-semibold text-slate-800">
                  {post.authorName || 'Alex Carter'}
                </span>
              </div>
              <span>•</span>
              <span className="text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readingTimeMinutes || 7} min read</span>
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>
        </ScrollReveal>

        {/* Full-Width Featured Banner Image */}
        {post.featuredImage && (
          <ScrollReveal preset="fade-up" delay={0.08} className="aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden mb-12 bg-slate-100 shadow-sm border border-slate-100">
            <img
              src={resolveMediaUrl(post.featuredImage)}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </ScrollReveal>
        )}

        {/* 2-Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            <div
              className="prose prose-slate max-w-none text-base sm:text-lg text-slate-700 leading-relaxed whitespace-pre-line space-y-6 font-normal"
              dangerouslySetInnerHTML={{
                __html: post.body || post.excerpt || '<p>Article body content coming soon.</p>',
              }}
            />

            {/* Author Bio Box */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4 mt-12">
              <div
                className="w-14 h-14 rounded-full text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md"
                style={{ backgroundColor: 'var(--brand-primary, #3B66D4)' }}
              >
                {post.authorName ? post.authorName.charAt(0) : 'A'}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{post.authorName || 'Editorial Specialist'}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Published by the technical research team. Writing on scalable web architectures, AI automation, and digital transformation.
                </p>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <Link
                to="/blog"
                className="text-xs font-bold text-[var(--brand-primary,#3B66D4)] hover:underline flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to All Articles</span>
              </Link>
            </div>
          </div>

          {/* Right Sidebar Widgets */}
          <aside className="lg:col-span-4 space-y-8 lg:pl-4">
            {/* Widget 1: Consultation Spotlight CTA */}
            <div
              className="rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, var(--brand-primary, #3B66D4) 0%, #0F172A 100%)',
              }}
            >
              <div
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.18)' }}
              >
                <Sparkles className="w-3 h-3 text-cyan-300" />
                <span>Expert Guidance</span>
              </div>
              <h4 className="font-extrabold text-base leading-snug text-white mb-2">
                Need Help Implementing These Solutions?
              </h4>
              <p className="text-xs text-blue-100 leading-relaxed mb-4">
                Schedule a direct consultation with our software architects to build custom web & AI systems.
              </p>
              <Link
                to="/contact"
                className="w-full btn-secondary-brand py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 shadow-md text-white text-center"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Get a Free Consultation</span>
              </Link>
            </div>

            {/* Widget 2: Latest Posts */}
            <div>
              <h3 className="text-base font-extrabold text-slate-900 mb-4 tracking-tight">
                Latest Articles
              </h3>

              <div className="space-y-4">
                {latestPosts.length > 0 ? (
                  latestPosts.map((rPost, idx) => {
                    const rDate = rPost.publishDate
                      ? new Date(rPost.publishDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'Recent';

                    return (
                      <Link
                        key={rPost._id || idx}
                        to={`/blog/${rPost.slug}`}
                        className="flex items-start gap-3.5 group"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                          <img
                            src={resolveMediaUrl(rPost.featuredImage)}
                            alt={rPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[var(--brand-primary,#3B66D4)] transition-colors line-clamp-2 leading-snug">
                            {rPost.title}
                          </h4>
                          <span className="block text-[11px] text-slate-400 mt-1">{rDate}</span>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400">No other recent posts.</p>
                )}
              </div>
            </div>

            {/* Widget 3: Categories */}
            <div>
              <h3 className="text-base font-extrabold text-slate-900 mb-3 tracking-tight">
                Categories
              </h3>

              <div className="flex flex-wrap gap-2">
                {displayCategories.map((cat, idx) => (
                  <Link
                    key={idx}
                    to={`/blog?category=${encodeURIComponent(cat)}`}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-[var(--brand-primary,#3B66D4)] hover:text-white transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            {/* Widget 4: Social Share */}
            <div>
              <h3 className="text-base font-extrabold text-slate-900 mb-3 tracking-tight">
                Share This Article
              </h3>

              <div className="flex items-center gap-2.5">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-xs hover:scale-110 transition-transform"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-4 h-4 fill-current" />
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center shadow-xs hover:scale-110 transition-transform"
                  aria-label="Share on Twitter / X"
                >
                  <Twitter className="w-4 h-4 fill-current" />
                </a>

                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${shareTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#0A66C2] text-white flex items-center justify-center shadow-xs hover:scale-110 transition-transform"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4 fill-current" />
                </a>

                <a
                  href={`https://wa.me/?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs hover:scale-110 transition-transform"
                  aria-label="Share on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                </a>

                <button
                  type="button"
                  onClick={copyLink}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center shadow-xs hover:scale-110 transition-transform"
                  title="Copy Article Link"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
