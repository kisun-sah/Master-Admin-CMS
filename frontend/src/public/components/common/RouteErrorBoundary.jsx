import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * RouteErrorBoundary catches rendering exceptions and dynamic chunk loading failures
 * (e.g. when a new version of the frontend is deployed and old hashes 404).
 */
export class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, isChunkError: false };
  }

  static getDerivedStateFromError(error) {
    const isChunk =
      error?.name === 'ChunkLoadError' ||
      /Loading chunk|dynamically imported module|failed to fetch/i.test(error?.message || '');

    return {
      hasError: true,
      error,
      isChunkError: isChunk,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Route error boundary caught an exception:', error, errorInfo);

    // Auto-reload once if chunk load error occurred (likely post-deployment stale cache)
    if (this.state.isChunkError && typeof window !== 'undefined') {
      const reloadKey = 'kbr_chunk_reload_attempt';
      const lastAttempt = sessionStorage.getItem(reloadKey);
      if (!lastAttempt || Date.now() - Number(lastAttempt) > 10000) {
        sessionStorage.setItem(reloadKey, String(Date.now()));
        window.location.reload();
      }
    }
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      const isChunk = this.state.isChunkError;

      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50 border border-slate-200 rounded-3xl m-6">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 shadow-sm">
            <AlertCircle className="w-7 h-7" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
            {isChunk ? 'New Version Available' : 'Something went wrong loading this section'}
          </h2>

          <p className="text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
            {isChunk
              ? 'A newer version of the website is available. Please reload to view the latest updates.'
              : this.state.error?.message ||
                'An unexpected rendering error occurred. Please try refreshing.'}
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isChunk ? 'Update & Reload' : 'Refresh Page'}</span>
            </button>

            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-all"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Go to Home</span>
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
