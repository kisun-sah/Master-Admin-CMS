import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getGalleryAlbums, getGalleryImages, resolveMediaUrl } from '../lib/api';
import SEOHead from '../components/layout/SEOHead';
import LightboxModal from '../components/common/LightboxModal';
import {
  Sparkles,
  Layers,
  Image as ImageIcon,
  Calendar,
  Camera,
  ArrowRight,
  Eye,
  Heart,
  Share2,
} from 'lucide-react';

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState('albums'); // 'albums' or 'masonry'
  const [albums, setAlbums] = useState([]);
  const [streamImages, setStreamImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const [albumsData, imagesData] = await Promise.allSettled([
          getGalleryAlbums(),
          getGalleryImages(),
        ]);
        setAlbums(albumsData.status === 'fulfilled' && Array.isArray(albumsData.value) ? albumsData.value : []);
        setStreamImages(imagesData.status === 'fulfilled' && Array.isArray(imagesData.value) ? imagesData.value : []);
      } catch (e) {
        console.error('Error loading gallery:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Default Memory Albums when DB has not seeded custom records yet
  const defaultMemoryAlbums = [
    {
      _id: 'm-1',
      title: 'Annual Corporate Summit & Awards Gala',
      slug: 'annual-corporate-summit-awards-gala',
      category: 'Corporate Events',
      eventDate: '2026-10-15',
      description:
        'A night celebrating company achievements, key partnerships, and recognizing exceptional performance across our engineering and operations teams.',
      coverImage:
        'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
      photoCount: 36,
      images: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
          title: 'Opening Keynote Address',
          caption: 'Leadership outlining strategic technological roadmaps for 2027.',
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
          title: 'Audience & Attendees',
          caption: 'Distinguished guests and team members gathered for the event.',
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop',
          title: 'Excellence Trophy Presentation',
          caption: 'Honoring top innovators and contributors of the quarter.',
        },
      ],
    },
    {
      _id: 'm-2',
      title: 'Himalayan Foothills Team Expedition & Trek',
      slug: 'himalayan-foothills-team-expedition',
      category: 'Team Retreats',
      eventDate: '2026-09-22',
      description:
        '4-day outdoor expedition strengthening camaraderie, high-altitude hiking, team bonding, and campfire memories.',
      coverImage:
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
      photoCount: 42,
      images: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
          title: 'Summit Sunrise View',
          caption: 'First rays of daylight over the mountain ridgeline.',
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
          title: 'Lakeside Camp Base',
          caption: 'Setting up camp under clear open skies.',
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200&auto=format&fit=crop',
          title: 'Trail Exploration',
          caption: 'Hiking through pristine pine forests and valleys.',
        },
      ],
    },
    {
      _id: 'm-3',
      title: 'Global Service Foundation CSR & Outreach Day',
      slug: 'global-service-foundation-csr-outreach',
      category: 'Community & CSR',
      eventDate: '2026-08-14',
      description:
        'Volunteering in local education centers, delivering IT supplies, and conducting interactive computing workshops for young learners.',
      coverImage:
        'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1200&auto=format&fit=crop',
      photoCount: 28,
      images: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1200&auto=format&fit=crop',
          title: 'Community Gathering',
          caption: 'Bringing smiles and educational resources to students.',
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop',
          title: 'Digital Literacy Session',
          caption: 'Teaching fundamentals of web navigation and digital skills.',
        },
      ],
    },
    {
      _id: 'm-4',
      title: 'Tech Innovation Hackathon & Product Launch',
      slug: 'tech-innovation-hackathon-product-launch',
      category: 'Corporate Events',
      eventDate: '2026-07-08',
      description:
        '48-hour continuous coding sprint where our architects developed next-generation autonomous CMS agents and live AI tools.',
      coverImage:
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop',
      photoCount: 30,
      images: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop',
          title: 'Sprint Kickoff',
          caption: 'Brainstorming architectures and prototype goals.',
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
          title: 'Collaborative Engineering',
          caption: 'Developers fine-tuning live models and database pipelines.',
        },
      ],
    },
    {
      _id: 'm-5',
      title: 'Annual Cultural Festival & Festive Gathering',
      slug: 'annual-cultural-festival-festive-gathering',
      category: 'Celebrations',
      eventDate: '2026-05-19',
      description:
        'A vibrant celebration with traditional cuisine, musical performances, festive attire, and family gatherings.',
      coverImage:
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
      photoCount: 45,
      images: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
          title: 'Cultural Night Festivities',
          caption: 'Lights, music, and celebration with the entire team.',
        },
      ],
    },
    {
      _id: 'm-6',
      title: 'Client Appreciation & Partnership Dinner',
      slug: 'client-appreciation-partnership-dinner',
      category: 'Office Culture',
      eventDate: '2026-04-10',
      description:
        'An intimate networking evening thanking our long-standing enterprise clients, partners, and collaborators for shared milestones.',
      coverImage:
        'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200&auto=format&fit=crop',
      photoCount: 22,
      images: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200&auto=format&fit=crop',
          title: 'Toast to Shared Milestones',
          caption: 'Celebrating five years of successful joint ventures.',
        },
      ],
    },
  ];

  const activeAlbums = albums && albums.length > 0 ? albums : defaultMemoryAlbums;

  const categories = [
    'All',
    'Corporate Events',
    'Team Retreats',
    'Celebrations',
    'Office Culture',
    'Community & CSR',
  ];

  const filteredAlbums =
    selectedCategory === 'All'
      ? activeAlbums
      : activeAlbums.filter(
          (a) =>
            a.category?.toLowerCase() === selectedCategory.toLowerCase() ||
            a.title?.toLowerCase().includes(selectedCategory.toLowerCase())
        );

  // Extract all individual images for masonry photo wall
  const allMemoryPhotos = [];
  activeAlbums.forEach((alb) => {
    if (alb.images && Array.isArray(alb.images) && alb.images.length > 0) {
      alb.images.forEach((img) => {
        allMemoryPhotos.push({
          ...img,
          albumTitle: alb.title,
          category: alb.category,
        });
      });
    } else if (alb.coverImage) {
      allMemoryPhotos.push({
        imageUrl: alb.coverImage,
        title: alb.title,
        category: alb.category,
      });
    }
  });

  const displayStreamImages = streamImages.length > 0 ? streamImages : allMemoryPhotos;

  const openAlbumSlideshow = (album) => {
    const imgs = album.images && album.images.length > 0
      ? album.images
      : [{ imageUrl: album.coverImage, title: album.title, caption: album.description }];
    setLightboxImages(imgs);
    setLightboxIndex(0);
  };

  const openSingleImage = (index) => {
    setLightboxImages(displayStreamImages);
    setLightboxIndex(index);
  };

  return (
    <div className="pt-28 pb-20 bg-[#F8FAFC] min-h-screen">
      <SEOHead
        title="Moments & Photo Memories Gallery — Captured Events & Milestones"
        description="Browse our organization photo memories, corporate retreats, celebratory milestones, conferences, and community impact moments."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-[var(--brand-primary,#3B66D4)] text-xs font-bold uppercase tracking-wider mb-4">
            <Camera className="w-3.5 h-3.5" />
            <span>Memories & Captured Milestones</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Photo Memories & Moments Gallery
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            A visual retrospective of our journey, corporate summits, team retreats, festive celebrations, and memorable stories.
          </p>
        </div>

        {/* Dual Mode Switcher: Categorized Albums vs All Photos Wall */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('albums')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'albums'
                ? 'bg-[var(--brand-primary,#3B66D4)] text-white shadow-md shadow-blue-500/25'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Event & Memory Albums ({activeAlbums.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('masonry')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'masonry'
                ? 'bg-[var(--brand-primary,#3B66D4)] text-white shadow-md shadow-blue-500/25'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>All Photos Wall ({displayStreamImages.length})</span>
          </button>
        </div>

        {/* Categories Bar for Albums */}
        {activeTab === 'albums' && (
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-14">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                    isSelected
                      ? 'bg-[var(--brand-primary,#3B66D4)] text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat === 'All' ? 'All Memories' : cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Tab 1: Memory Albums Grid */}
        {activeTab === 'albums' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAlbums.map((item, idx) => {
              const imageSrc = resolveMediaUrl(
                item.coverImage ||
                  item.images?.[0]?.imageUrl ||
                  'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop'
              );

              const photoCount =
                item.photoCount ||
                (item.images && item.images.length > 0 ? item.images.length : 12);

              const formattedDate = item.eventDate
                ? new Date(item.eventDate).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Recent Memory';

              return (
                <div
                  key={item._id || idx}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 flex flex-col justify-between group hover:shadow-xl transition-all duration-300 shadow-sm"
                >
                  <div>
                    {/* Cover Image Container */}
                    <div
                      className="relative aspect-[16/10] overflow-hidden bg-slate-100 cursor-pointer"
                      onClick={() => openAlbumSlideshow(item)}
                    >
                      <img
                        src={imageSrc}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-60" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-[11px] font-bold text-slate-800 shadow-sm flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-[var(--brand-primary,#3B66D4)]" />
                        <span>{photoCount} Photos</span>
                      </div>

                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[var(--brand-primary,#3B66D4)] text-white text-[11px] font-bold shadow-sm">
                        {item.category || 'Memory'}
                      </div>

                      {/* Hover Overlay Icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/30">
                        <div className="w-12 h-12 rounded-full bg-white text-[var(--brand-primary,#3B66D4)] flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                          <Eye className="w-6 h-6" />
                        </div>
                      </div>
                    </div>

                    {/* Album Info */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[var(--brand-primary,#3B66D4)]" />
                        <span>{formattedDate}</span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[var(--brand-primary,#3B66D4)] transition-colors mb-2 leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-6 pb-6 pt-0 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => openAlbumSlideshow(item)}
                      className="py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-[var(--brand-primary,#3B66D4)]" />
                      <span>Quick View</span>
                    </button>

                    <Link
                      to={`/gallery/${item.slug}`}
                      className="py-2.5 px-3 rounded-xl bg-[var(--brand-primary,#3B66D4)] hover:bg-blue-700 text-xs font-bold text-white shadow-md shadow-blue-500/25 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>View Album</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Masonry Photo Wall (All Photographs) */}
        {activeTab === 'masonry' && (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {displayStreamImages.map((img, idx) => {
              const src = resolveMediaUrl(
                img.imageUrl || img.coverImage || 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop'
              );
              return (
                <div
                  key={idx}
                  onClick={() => openSingleImage(idx)}
                  className="break-inside-avoid bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm cursor-pointer group relative hover:shadow-xl transition-all"
                >
                  <img
                    src={src}
                    alt={img.title || 'Memory Photograph'}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 flex flex-col justify-end p-5 transition-opacity">
                    <div className="text-sm font-bold text-white">{img.title || 'Captured Moment'}</div>
                    {img.caption && (
                      <div className="text-xs text-slate-200 mt-1 line-clamp-2">{img.caption}</div>
                    )}
                    <div className="text-[10px] text-blue-200 font-semibold mt-2 uppercase tracking-wider">
                      {img.category || img.albumTitle || 'Photo Memory'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal for Fullscreen Memory Slideshow */}
      {lightboxIndex !== null && (
        <LightboxModal
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex((p) =>
              p === 0 ? lightboxImages.length - 1 : p - 1
            )
          }
          onNext={() =>
            setLightboxIndex((p) =>
              p === lightboxImages.length - 1 ? 0 : p + 1
            )
          }
        />
      )}
    </div>
  );
}
