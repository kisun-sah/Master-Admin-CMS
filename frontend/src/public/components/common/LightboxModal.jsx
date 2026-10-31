import React, { useEffect } from 'react';
import { resolveMediaUrl } from '../../lib/api';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

export default function LightboxModal({
  images = [],
  currentIndex = 0,
  onClose,
  onPrev,
  onNext,
}) {
  const currentImage = images[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext]);

  if (!currentImage) return null;

  const imageUrl = resolveMediaUrl(
    currentImage.imageUrl || currentImage.url || currentImage
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
      {/* Top Bar with Counter and Close Button */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20 max-w-7xl mx-auto">
        <div className="px-3 py-1.5 rounded-lg glass-panel text-xs text-slate-300 font-mono">
          {currentIndex + 1} / {images.length}
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full glass-panel border border-white/10 text-white hover:bg-white/20 transition-all"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full glass-panel border border-white/10 text-white hover:bg-white/20 transition-all"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main Image Container */}
      <div className="relative max-w-5xl max-h-[85vh] flex flex-col items-center">
        <img
          src={imageUrl}
          alt={currentImage.altText || currentImage.title || 'Portfolio Image'}
          className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
        />

        {/* Caption & Metadata */}
        {(currentImage.title || currentImage.caption) && (
          <div className="mt-4 text-center glass-panel px-6 py-2.5 rounded-xl border border-white/10 max-w-2xl">
            {currentImage.title && (
              <div className="text-sm font-bold text-white">{currentImage.title}</div>
            )}
            {currentImage.caption && (
              <div className="text-xs text-slate-400 mt-0.5">{currentImage.caption}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
