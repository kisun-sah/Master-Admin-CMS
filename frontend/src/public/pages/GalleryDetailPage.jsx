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
      <div className="pt-32 pb-20 text-center text-slate-500 min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--brand-primary,#3B66D4)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="pt-32 pb-20 text-center max-w-lg mx-auto px-4 min-h-[60vh]">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Album Not Found</h2>
        <p className="text-sm text-slate-600 mb-6">
          The requested portfolio album could not be found.
        </p>
        <Link
          to="/gallery"
          className="px-6 py-2.5 rounded-full bg-[var(--brand-primary,#3B66D4)] hover:bg-blue-700 text-white font-bold text-sm inline-block shadow-md"
        >
          &larr; Back to Portfolio Gallery
        </Link>
      </div>
    );
  }

  const images = (album.images || []).sort(
    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
  );

  return (
    <div className="pt-28 pb-20 bg-[#F8FAFC] min-h-screen">
      <SEOHead
        title={`${album.title} — Portfolio Album`}
        description={album.description}
        image={album.coverImage}
        seoData={album.seo}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/gallery"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[var(--brand-primary,#3B66D4)] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Photo Memories & Albums</span>
        </Link>

        {/* Album Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-[var(--brand-primary,#3B66D4)] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{album.category || 'Memory Album'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            {album.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6">
            {album.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[var(--brand-primary,#3B66D4)]" />
              <span>{images.length} High-Res Photographs</span>
            </span>
            {album.eventDate && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[var(--brand-primary,#3B66D4)]" />
                  <span>{new Date(album.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
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
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 cursor-pointer group relative shadow-sm hover:shadow-md transition-all aspect-[16/10]"
            >
              <img
                src={resolveMediaUrl(img.imageUrl)}
                alt={img.altText || img.title || `Screenshot ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <div className="w-12 h-12 rounded-full bg-white text-[var(--brand-primary,#3B66D4)] flex items-center justify-center shadow-lg">
                  <Eye className="w-6 h-6" />
                </div>
              </div>

              {(img.title || img.caption) && (
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-900/80 to-transparent text-left">
                  {img.title && <div className="text-xs font-bold text-white truncate">{img.title}</div>}
                  {img.caption && <div className="text-[10px] text-slate-200 truncate">{img.caption}</div>}
                </div>
              )}
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="text-center py-16 text-slate-500 bg-white rounded-2xl border border-slate-200">
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
