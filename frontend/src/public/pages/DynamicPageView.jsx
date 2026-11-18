import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPageBySlug } from '../lib/api';
import BlockRenderer from '../components/blocks/BlockRenderer';
import SEOHead from '../components/layout/SEOHead';

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
      <div className="pt-32 pb-20 text-center text-slate-500 min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--brand-primary,#3B66D4)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="pt-32 pb-20 text-center max-w-lg mx-auto px-4 min-h-[60vh]">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Page Not Found</h2>
        <p className="text-sm text-slate-600 mb-6">
          The requested page <code className="text-[var(--brand-primary,#3B66D4)] font-mono">/{slug}</code> could not be found or has not been published yet in the Master Admin CMS.
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 rounded-full bg-[var(--brand-primary,#3B66D4)] hover:bg-blue-700 text-white font-bold text-sm inline-block shadow-md"
        >
          &larr; Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-[#F8FAFC] min-h-screen">
      <SEOHead
        title={page.title}
        description={page.excerpt}
        seoData={page.seo}
      />

      {/* Header if not hidden */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          {page.title}
        </h1>
        {page.excerpt && (
          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
            {page.excerpt}
          </p>
        )}
      </div>

      {/* 9-Block Engine with 4 Layouts */}
      <BlockRenderer blocks={page.blocks || []} layout={page.layout || 'default'} />
    </div>
  );
}
