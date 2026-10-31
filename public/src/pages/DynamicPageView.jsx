import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPageBySlug } from '../lib/api';
import BlockRenderer from '../components/blocks/BlockRenderer';
import SEOHead from '../components/layout/SEOHead';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function DynamicPageView() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getPageBySlug(slug);
        setPage(data);
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
      <div className="pt-32 pb-20 text-center text-slate-400 min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="pt-32 pb-20 text-center max-w-lg mx-auto px-4 min-h-[60vh]">
        <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">
          The requested page <code className="text-cyan-400 font-mono">/{slug}</code> could not be found or has not been published yet in the Master Admin CMS.
        </p>
        <Link to="/" className="px-6 py-2.5 btn-primary-glow font-bold text-sm inline-block">
          &larr; Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-[#090D16] min-h-screen">
      <SEOHead
        title={page.title}
        description={page.excerpt}
        seoData={page.seo}
      />

      {/* Header if not hidden */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          {page.title}
        </h1>
        {page.excerpt && (
          <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
            {page.excerpt}
          </p>
        )}
      </div>

      {/* 9-Block Engine with 4 Layouts */}
      <BlockRenderer blocks={page.blocks || []} layout={page.layout || 'default'} />
    </div>
  );
}
