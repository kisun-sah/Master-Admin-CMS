import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGalleryAlbumBySlug, resolveMediaUrl } from '../lib/api';
import SEOHead from '../components/layout/SEOHead';
import LightboxModal from '../components/common/LightboxModal';
import { Sparkles, ArrowLeft, Eye, Calendar, Layers } from 'lucide-react';

export default function GalleryDetailPage() {
  const { slug } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getGalleryAlbumBySlug(slug);
        setAlbum(data);
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

  if (error || !album) {
    return (
      <div className="pt-32 pb-20 text-center max-w-lg mx-auto px-4 min-h-[60vh]">
        <h2 className="text-2xl font-bold text-white mb-4">Album Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">
          The requested portfolio album could not be found.
        </p>
        <Link to="/gallery" className="px-6 py-2.5 btn-primary-glow font-bold text-sm inline-block">
          &larr; Back to Portfolio Gallery
        </Link>
      </div>
    );
  }

  const images = (album.images || []).sort(
    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
  );

  return (
    <div className="pt-28 pb-20 bg-[#070A10] min-h-screen">
      <SEOHead
        title={`${album.title} — Portfolio Album`}
        description={album.description}
        image={album.coverImage}
        seoData={album.seo}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/gallery"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Templates & Albums</span>
        </Link>

        {/* Album Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{album.category || 'Portfolio Showcase'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            {album.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6">
            {album.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>{images.length} High-Res Screenshots</span>
            </span>
            {album.eventDate && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>{new Date(album.eventDate).toLocaleDateString()}</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* High-Res Screenshots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setLightboxIndex(idx)}
              className="glass-card rounded-2xl overflow-hidden border border-white/10 cursor-pointer group relative shadow-lg aspect-[16/10]"
            >
              <img
                src={resolveMediaUrl(img.imageUrl)}
                alt={img.altText || img.title || `Screenshot ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <div className="w-12 h-12 rounded-full glass-panel border border-cyan-400 text-cyan-400 flex items-center justify-center shadow-neon-cyan">
                  <Eye className="w-6 h-6" />
                </div>
              </div>

              {(img.title || img.caption) && (
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-left">
                  {img.title && <div className="text-xs font-bold text-white truncate">{img.title}</div>}
                  {img.caption && <div className="text-[10px] text-slate-300 truncate">{img.caption}</div>}
                </div>
              )}
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="text-center py-16 text-slate-500 glass-card rounded-2xl border border-white/5">
            No screenshots uploaded to this album yet.
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <LightboxModal
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((p) => (p === 0 ? images.length - 1 : p - 1))}
          onNext={() => setLightboxIndex((p) => (p === images.length - 1 ? 0 : p + 1))}
        />
      )}
    </div>
  );
}
