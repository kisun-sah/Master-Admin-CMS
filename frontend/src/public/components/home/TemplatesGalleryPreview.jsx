import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { resolveMediaUrl } from '../../lib/api';
import LightboxModal from '../common/LightboxModal';
import { ArrowRight, Maximize2 } from 'lucide-react';

export default function TemplatesGalleryPreview({ albums = [], images = [] }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // 1. Filter published CMS albums and standalone images
  const adminAlbums = useMemo(() => {
    if (!Array.isArray(albums)) return [];
    return albums.filter((a) => !a.status || a.status === 'published');
  }, [albums]);

  const adminImages = useMemo(() => {
    if (!Array.isArray(images)) return [];
    return images.filter((img) => !img.status || img.status === 'published');
  }, [images]);

  const hasAdminCreatedGallery = adminAlbums.length > 0 || adminImages.length > 0;

  // 2. High-quality starter fallback items matching the exact reference style & captions
  const defaultMoments = useMemo(
    () => [
      {
        _id: 'def-1',
        title: 'Tea tasting',
        imageUrl:
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
        createdAt: '2026-11-16T10:00:00.000Z',
      },
      {
        _id: 'def-2',
        title: 'Plethora of books',
        imageUrl:
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
        createdAt: '2026-11-15T10:00:00.000Z',
      },
      {
        _id: 'def-3',
        title: 'Chrysanthemum farm',
        imageUrl:
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
        createdAt: '2026-11-14T10:00:00.000Z',
      },
      {
        _id: 'def-4',
        title: 'Agricultural workshops',
        imageUrl:
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80',
        createdAt: '2026-11-13T10:00:00.000Z',
      },
      {
        _id: 'def-5',
        title: 'Performances',
        imageUrl:
          'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
        createdAt: '2026-11-12T10:00:00.000Z',
      },
      {
        _id: 'def-6',
        title: 'A miniature village',
        imageUrl:
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
        createdAt: '2026-11-11T10:00:00.000Z',
      },
    ],
    []
  );

  // 3. Compile photos, sorted newest first
  const compiledPhotos = useMemo(() => {
    let list = [];
    if (hasAdminCreatedGallery) {
      adminAlbums.forEach((album) => {
        if (album.coverImage) {
          list.push({
            _id: album._id || `album-${album.slug}`,
            title: album.title,
            imageUrl: album.coverImage,
            createdAt: album.createdAt || album.eventDate || null,
          });
        }
        if (Array.isArray(album.images)) {
          album.images.forEach((img, idx) => {
            if (img.imageUrl) {
              list.push({
                _id: `${album._id || album.slug}-img-${idx}`,
                title: img.title || album.title,
                imageUrl: img.imageUrl,
                createdAt: img.createdAt || album.createdAt || null,
              });
            }
          });
        }
      });

      adminImages.forEach((img, idx) => {
        list.push({
          _id: img._id || `img-${idx}`,
          title: img.title || img.albumTitle || 'Gallery Photograph',
          imageUrl: img.imageUrl || img.url,
          createdAt: img.createdAt || null,
        });
      });
    } else {
      list = [...defaultMoments];
    }

    // Sort newest first
    list.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    // Fill remaining with defaults if fewer than 6
    if (list.length < 6) {
      list = [...list, ...defaultMoments.slice(list.length, 6)];
    }

    return list;
  }, [hasAdminCreatedGallery, adminAlbums, adminImages, defaultMoments]);

  // Exactly latest 6 photos
  const displayPhotos = useMemo(() => compiledPhotos.slice(0, 6), [compiledPhotos]);

  const lightboxList = displayPhotos.map((p) => ({
    imageUrl: resolveMediaUrl(p.imageUrl),
    title: p.title,
  }));

  // Column span configuration for the asymmetric 2-row layout:
  // Row 1: [col-span-3, col-span-6, col-span-3] = 12 cols
  // Row 2: [col-span-5, col-span-4, col-span-3] = 12 cols
  const colSpans = [
    'col-span-12 md:col-span-3',
    'col-span-12 md:col-span-6',
    'col-span-12 md:col-span-3',
    'col-span-12 md:col-span-5',
    'col-span-12 md:col-span-4',
    'col-span-12 md:col-span-3',
  ];

  return (
    <section className="py-20 sm:py-24 bg-[#FAFAF8] relative overflow-hidden" id="gallery">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        {/* ================= MINIMALIST HEADER: "— GALLERY" ================= */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-wider flex items-center gap-3 select-none">
            <span className="w-8 h-[2px] bg-slate-900 inline-block" />
            <span className="font-normal uppercase tracking-[0.2em]">GALLERY</span>
          </h2>

          <Link
            to="/gallery"
            className="mt-3 sm:mt-0 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 tracking-wider uppercase transition-colors inline-flex items-center gap-1.5 group"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* ================= ASYMMETRIC 6-PHOTO GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 lg:gap-5">
          {displayPhotos.map((photo, idx) => {
            const resolvedUrl = resolveMediaUrl(photo.imageUrl);
            const spanClass = colSpans[idx] || 'col-span-12 md:col-span-4';

            return (
              <div
                key={photo._id || idx}
                onClick={() => setLightboxIndex(idx)}
                className={`group relative overflow-hidden rounded-md bg-slate-200 cursor-pointer shadow-xs hover:shadow-lg transition-all duration-300 h-[240px] sm:h-[280px] lg:h-[320px] select-none ${spanClass}`}
                title={photo.title}
              >
                {/* Image */}
                <img
                  src={resolvedUrl}
                  alt={photo.title || 'Gallery photograph'}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultMoments[idx % defaultMoments.length].imageUrl;
                  }}
                />

                {/* Atmospheric Gradient for Crisp Title Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-300" />

                {/* Bottom Left Title Text */}
                <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 right-4 z-10">
                  <span className="text-white text-sm sm:text-base font-normal tracking-wide drop-shadow-md block truncate">
                    {photo.title}
                  </span>
                </div>

                {/* Subtle Maximize Icon on Hover */}
                <div className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md text-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && (
        <LightboxModal
          images={lightboxList}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex((prev) => (prev - 1 + lightboxList.length) % lightboxList.length)
          }
          onNext={() =>
            setLightboxIndex((prev) => (prev + 1) % lightboxList.length)
          }
        />
      )}
    </section>
  );
}
