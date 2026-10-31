import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getGalleryAlbums, getGalleryImages, resolveMediaUrl } from '../lib/api';
import SEOHead from '../components/layout/SEOHead';
import DevicePreviewModal from '../components/gallery/DevicePreviewModal';
import LightboxModal from '../components/common/LightboxModal';
import {
  Sparkles,
  Layers,
  Image as ImageIcon,
  ExternalLink,
  Eye,
  ShoppingBag,
} from 'lucide-react';

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState('albums'); // 'albums' or 'masonry'
  const [albums, setAlbums] = useState([]);
  const [streamImages, setStreamImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalProject, setActiveModalProject] = useState(null);
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

  const defaultTemplates = [
    {
      title: 'Aura Premium E-Commerce Hub',
      slug: 'aura-ecommerce-hub',
      category: 'E-Commerce Websites',
      description:
        'A fully featured, high-performance online store with automated inventory, payment gateways, and a master admin panel.',
      coverImage:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
      techStack: ['Next.js 15', 'Tailwind', 'Node.js', 'PostgreSQL'],
    },
    {
      title: 'CareFirst Hospital CMS & Patient Portal',
      slug: 'carefirst-hospital-cms',
      category: 'Hospital & Clinic CMS',
      description:
        'Online doctor appointments, emergency bed capacity monitor, and HIPAA-ready administrative dashboard.',
      coverImage:
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop',
      techStack: ['React', 'Express', 'Node.js', 'MongoDB'],
    },
    {
      title: 'School & College Portals',
      slug: 'school-college-portals',
      category: 'School & College Portals',
      description:
        'Comprehensive institutional web presence with dynamic syllabus builder, faculty directory, and admission inquiry CRM.',
      coverImage:
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
      techStack: ['MERN Stack', 'Tailwind', 'Express.js', 'Vite'],
    },
    {
      title: 'Digital Marketing Results & Analytics',
      slug: 'digital-marketing-results',
      category: 'Digital Marketing Results',
      description:
        'Real-time traffic growth proof showcasing 4x lead acquisition across Google Ads and organic technical SEO.',
      coverImage:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
      techStack: ['Google Ads', 'SEO Engine', 'Meta Ads', 'GA4'],
    },
    {
      title: 'Apex Cloud & Server Infrastructure',
      slug: 'apex-cloud-server-infrastructure',
      category: 'IT & Networking Setup',
      description:
        'High-availability AWS VPC cluster setup with automated failover, DDoS mitigation, and daily encrypted snapshots.',
      coverImage:
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
      techStack: ['AWS', 'Docker', 'Linux', 'Security SLA'],
    },
    {
      title: 'Wanderlust Travel & Tour Booking',
      slug: 'wanderlust-travel-booking',
      category: 'Travel & Booking',
      description:
        'Tour packages catalog, interactive itineraries, dynamic currency converter, and Stripe payment gateway.',
      coverImage:
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop',
      techStack: ['Next.js', 'Node.js', 'Tailwind', 'Stripe'],
    },
  ];

  const activeAlbums =
    albums && albums.length > 0
      ? albums.map((a, i) => ({
          ...a,
          category: a.category || defaultTemplates[i % defaultTemplates.length].category,
          techStack: ['MERN Stack', 'Tailwind', 'Master Admin CMS'],
        }))
      : defaultTemplates;

  const categories = [
    'All',
    'E-Commerce Websites',
    'Hospital & Clinic CMS',
    'School & College Portals',
    'Travel & Booking',
    'Digital Marketing Results',
    'IT & Networking Setup',
  ];

  const filteredAlbums =
    selectedCategory === 'All'
      ? activeAlbums
      : activeAlbums.filter(
          (a) =>
            a.category?.toLowerCase() === selectedCategory.toLowerCase() ||
            a.title?.toLowerCase().includes(selectedCategory.toLowerCase())
        );

  const handleBuy = (project) => {
    navigate(`/contact?project=${encodeURIComponent(project.title)}`);
  };

  return (
    <div className="pt-28 pb-20 bg-[#070A10] min-h-screen">
      <SEOHead
        title="Deliverance & Templates Gallery — Portfolio & Ready Websites"
        description="Explore live website templates, client portals, and digital marketing results built with the Master Admin CMS. Multi-device live demo previews and instant deployments."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header (Matching Screenshot 1) */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visual Portfolio & Architecture Showcase</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Deliverance & Templates Gallery
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Explore our premium production-ready templates & successful client projects
          </p>
        </div>

        {/* Dual Mode Switcher: Albums vs All Visuals */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('albums')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'albums'
                ? 'btn-primary-glow shadow-neon-cyan text-white'
                : 'glass-panel text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categorized Project Albums</span>
          </button>

          <button
            onClick={() => setActiveTab('masonry')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'masonry'
                ? 'btn-primary-glow shadow-neon-cyan text-white'
                : 'glass-panel text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>All Portfolio Visuals Masonry</span>
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
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                    isSelected
                      ? 'btn-primary-glow shadow-neon-cyan text-white'
                      : 'glass-panel text-slate-300 hover:text-white hover:border-white/20'
                  }`}
                >
                  {cat === 'All' ? 'All Projects' : cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Tab 1: Albums Grid (Matching Screenshot 1) */}
        {activeTab === 'albums' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAlbums.map((item, idx) => {
              const imageSrc = resolveMediaUrl(
                item.coverImage ||
                  item.imageUrl ||
                  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'
              );

              return (
                <div
                  key={idx}
                  className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between group hover:border-cyan-500/40 transition-all duration-300 shadow-xl"
                >
                  <div>
                    <div
                      className="relative aspect-[16/10] overflow-hidden bg-slate-900 cursor-pointer"
                      onClick={() => setActiveModalProject(item)}
                    >
                      <img
                        src={imageSrc}
                        alt={item.title}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D1322] via-transparent to-transparent opacity-60" />

                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md glass-panel border border-white/20 text-[10px] font-bold text-white bg-black/60 shadow-lg">
                        Built with Master Admin CMS
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                        <div className="w-12 h-12 rounded-full glass-panel border border-cyan-400 text-cyan-400 flex items-center justify-center shadow-neon-cyan">
                          <Eye className="w-6 h-6" />
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {(item.techStack || ['Next.js', 'Tailwind', 'Node.js', 'MongoDB']).map(
                          (tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-300"
                            >
                              {tech}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-0 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setActiveModalProject(item)}
                      className="py-2.5 px-3 rounded-xl glass-panel border border-white/10 hover:border-cyan-400/50 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    </button>

                    <button
                      onClick={() => handleBuy(item)}
                      className="py-2.5 px-3 rounded-xl btn-primary-glow text-xs font-bold text-white shadow-neon-cyan flex items-center justify-center gap-1.5"
                    >
                      <span>Buy Website</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Masonry Stream of All Visuals */}
        {activeTab === 'masonry' && (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {(streamImages.length > 0 ? streamImages : defaultTemplates).map((img, idx) => {
              const src = resolveMediaUrl(
                img.imageUrl || img.coverImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'
              );
              return (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="break-inside-avoid glass-card rounded-2xl overflow-hidden border border-white/10 cursor-pointer group relative"
                >
                  <img
                    src={src}
                    alt={img.title || 'Portfolio Visual'}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-4 transition-opacity">
                    <div className="text-sm font-bold text-white">{img.title}</div>
                    <div className="text-xs text-cyan-400 font-semibold">{img.category || 'Visual Showcase'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Device Preview Modal (Matching Screenshot 1) */}
      {activeModalProject && (
        <DevicePreviewModal
          project={activeModalProject}
          onClose={() => setActiveModalProject(null)}
          onBuy={handleBuy}
        />
      )}

      {/* Lightbox for Masonry */}
      {lightboxIndex !== null && (
        <LightboxModal
          images={streamImages.length > 0 ? streamImages : defaultTemplates}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex((p) =>
              p === 0 ? (streamImages.length || defaultTemplates.length) - 1 : p - 1
            )
          }
          onNext={() =>
            setLightboxIndex((p) =>
              p === (streamImages.length || defaultTemplates.length) - 1 ? 0 : p + 1
            )
          }
        />
      )}
    </div>
  );
}
