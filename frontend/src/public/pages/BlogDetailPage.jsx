import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogBySlug, resolveMediaUrl } from '../lib/api';
import { useCms } from '../context/CmsContext';
import SEOHead from '../components/layout/SEOHead';
import {
  Clock,
  User,
  Calendar,
  ArrowLeft,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Link as LinkIcon,
  Check,
  Sparkles,
} from 'lucide-react';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { settings } = useCms();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getBlogBySlug(slug);
        setPost(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  // Reading progress scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(currentProgress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center text-slate-400 min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pt-32 pb-20 text-center max-w-lg mx-auto px-4 min-h-[60vh]">
        <h2 className="text-2xl font-bold text-white mb-4">Article Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">
          The requested article could not be loaded or has been archived.
        </p>
        <Link to="/blog" className="px-6 py-2.5 btn-primary-glow font-bold text-sm inline-block">
          &larr; Back to Tech Blog
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

  return (
    <div className="pt-28 pb-20 bg-[#090D16] min-h-screen">
      {/* Top Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      <SEOHead
        title={`${post.title} — Tech & SEO Blog`}
        description={post.excerpt}
        image={post.featuredImage}
        seoData={post.seo}
        type="article"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          image: post.featuredImage ? resolveMediaUrl(post.featuredImage) : undefined,
          datePublished: post.publishDate,
          author: {
            '@type': 'Person',
            name: post.authorName || 'Alex Carter',
          },
          publisher: {
            '@type': 'Organization',
            name: settings?.siteName || 'NEXUS DEVS',
          },
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>

        {/* Article Header */}
        <div className="space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{post.category || 'Tech Insight'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-y border-white/10 py-4">
            <span className="flex items-center gap-1.5 text-white font-medium">
              <User className="w-4 h-4 text-cyan-400" />
              <span>{post.authorName || 'Alex Carter'}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{post.readingTimeMinutes || 5} min read</span>
            </span>
            {post.publishDate && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Featured Banner Image */}
        {post.featuredImage && (
          <div className="aspect-[16/9] rounded-3xl overflow-hidden mb-12 bg-slate-900 border border-white/10 shadow-2xl">
            <img
              src={resolveMediaUrl(post.featuredImage)}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Main Article Body */}
        <article className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 mb-12">
          <div
            className="text-slate-300 leading-relaxed text-base sm:text-lg space-y-6 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.body || '<p>Article body content coming soon.</p>' }}
          />

          {/* Tags Cloud */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-8 mt-8 border-t border-white/10 flex flex-wrap gap-2 items-center">
              <span className="text-xs font-semibold text-slate-400 mr-2">Tags:</span>
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-cyan-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Social Share Bar */}
          <div className="pt-6 mt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Share this article:</span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg glass-panel hover:bg-cyan-500 hover:text-black text-slate-300 transition-colors"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg glass-panel hover:bg-cyan-500 hover:text-black text-slate-300 transition-colors"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              <button
                onClick={copyLink}
                className="p-2 rounded-lg glass-panel hover:bg-cyan-500 hover:text-black text-slate-300 transition-colors flex items-center gap-1.5 text-xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <LinkIcon className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </article>

        {/* Bottom Conversion Box */}
        <div className="glass-panel rounded-3xl p-8 border border-cyan-500/30 bg-gradient-to-tr from-cyan-950/30 to-indigo-950/30 text-center space-y-4 shadow-neon-cyan">
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Need Help Implementing This for Your Business?
          </h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Get bespoke MERN development, automated AI workflows, or technical SEO optimization engineered by a dedicated technology specialist.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="px-8 py-3.5 btn-primary-glow font-bold text-sm inline-flex items-center gap-2 shadow-neon-cyan"
            >
              <span>Order Custom Solution / Hire Me</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
