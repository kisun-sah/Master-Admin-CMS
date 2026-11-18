import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';
import SEOHead from '../components/layout/SEOHead';

export default function NotFoundPage() {
  const location = useLocation();

  return (
    <>
      <SEOHead
        title="404 — Page Not Found | KBR Digital"
        description="The page you are looking for does not exist or has been moved."
      />
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-24 text-center bg-[#F8FAFC]">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-sm border border-blue-100">
          <Compass className="w-10 h-10 animate-pulse" />
        </div>

        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
          Error 404
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Page Not Found
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto mb-8 leading-relaxed">
          The requested path <code className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-xs">{location.pathname}</code> does not exist on this website or has been moved.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md shadow-blue-500/20"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </>
  );
}
