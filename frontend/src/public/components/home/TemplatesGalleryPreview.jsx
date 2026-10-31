import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resolveMediaUrl } from '../../lib/api';
import DevicePreviewModal from '../gallery/DevicePreviewModal';
import {
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  ShoppingBag,
  Eye,
} from 'lucide-react';

export default function TemplatesGalleryPreview({ albums = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalProject, setActiveModalProject] = useState(null);
  const navigate = useNavigate();

  const categories = [
    'All Projects',
    'E-Commerce Websites',
    'Hospital & Clinic CMS',
    'School & College Portals',
    'Travel & Booking',
    'Digital Marketing Results',
  ];

  // Default templates matching Screenshot 1
  const defaultTemplates = [
    {
      title: 'Aura E-Commerce Hub',
      slug: 'aura-ecommerce-hub',
      category: 'E-Commerce Websites',
      description:
        'A fully featured, high-performance online store with automated inventory, payment gateways, and a master admin panel.',
      coverImage:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
      techStack: ['Next.js 15', 'Tailwind', 'Node.js', 'MongoDB'],
      demoUrl: '#',
    },
    {
      title: 'CareFirst Hospital CMS',
      slug: 'carefirst-hospital-cms',
      category: 'Hospital & Clinic CMS',
      description:
        'Comprehensive healthcare website and appointment portal with doctor schedules, emergency alerts, and dynamic department pages.',
      coverImage:
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop',
      techStack: ['React 18', 'Node.js', 'MongoDB', 'Tailwind'],
      demoUrl: '#',
    },
    {
      title: 'School & College Portals',
      slug: 'school-college-portals',
      category: 'School & College Portals',
      description:
        'Academic portal with admissions intake forms, faculty profiles, curriculum block builder, and digital exam notices.',
      coverImage:
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
      techStack: ['MERN Stack', 'Tailwind', 'Express.js', 'Vite'],
      demoUrl: '#',
    },
    {
      title: 'Digital Marketing Results',
      slug: 'digital-marketing-results',
      category: 'Digital Marketing Results',
      description:
        'Live analytics dashboard showcase presenting 400% ROI on Google Ads campaigns and technical SEO rank tracking.',
      coverImage:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
      techStack: ['Google Ads', 'GA4 Analytics', 'Technical SEO', 'Meta Ads'],
      demoUrl: '#',
    },
    {
      title: 'Wanderlust Travel & Booking',
      slug: 'wanderlust-travel-booking',
      category: 'Travel & Booking',
      description:
        'Tour packages catalog, dynamic itinerary block builder, hotel room booking engine, and interactive currency converter.',
      coverImage:
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop',
      techStack: ['Next.js', 'Stripe', 'Node.js', 'MongoDB'],
      demoUrl: '#',
    },
    {
      title: 'Apex Corporate Consulting',
      slug: 'apex-corporate-consulting',
      category: 'Custom Websites & CMS',
      description:
        'Sleek enterprise website featuring 35MB video background reels, dynamic career board, and client case study albums.',
      coverImage:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
      techStack: ['React', 'Express', 'Tailwind', 'CMS Engine'],
      demoUrl: '#',
    },
  ];

  const projectsToDisplay =
    albums && albums.length > 0
      ? albums.map((a, i) => ({
          ...a,
          category: a.category || defaultTemplates[i % defaultTemplates.length].category,
          techStack: ['MERN Stack', 'Tailwind', 'Master CMS', 'Production Ready'],
        }))
      : defaultTemplates;

  const filtered =
    selectedCategory === 'All Projects'
      ? projectsToDisplay
      : projectsToDisplay.filter(
          (p) =>
            p.category?.toLowerCase() === selectedCategory.toLowerCase() ||
            p.title?.toLowerCase().includes(selectedCategory.toLowerCase())
        );

  const handleBuy = (project) => {
    navigate(`/contact?project=${encodeURIComponent(project.title)}`);
  };

  return (
    <section className="py-24 bg-[#070A10] relative overflow-hidden" id="gallery">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header (Matching Screenshot 1) */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visual Portfolio & Ready-to-Buy Systems</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Deliverance & Templates Gallery
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Explore our premium production-ready templates & successful client projects
          </p>
        </div>

        {/* Filter Pills (Matching Screenshot 1) */}
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
                {cat}
              </button>
            );
          })}
        </div>

        {/* Templates Grid (Matching Screenshot 1 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item, idx) => {
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
                  {/* Image Screen with Built with Master Admin CMS Badge */}
                  <div
                    className="relative aspect-[16/10] overflow-hidden bg-slate-900 cursor-pointer"
                    onClick={() => setActiveModalProject(item)}
                  >
                    <img
                      src={imageSrc}
                      alt={item.title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1322] via-transparent to-transparent opacity-60" />

                    {/* Top Right Floating Badge (Matching Screenshot 1) */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md glass-panel border border-white/20 text-[10px] font-bold text-white bg-black/60 shadow-lg">
                      Built with Master Admin CMS
                    </div>

                    {/* Hover Zoom Eye */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <div className="w-12 h-12 rounded-full glass-panel border border-cyan-400 text-cyan-400 flex items-center justify-center shadow-neon-cyan">
                        <Eye className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </h3>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
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

                {/* 2 Buttons on Card Bottom (Matching Screenshot 1) */}
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

        {/* View All In Full Gallery Button */}
        <div className="text-center mt-14">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full glass-panel border border-white/20 text-white font-bold text-sm hover:border-cyan-400 hover:bg-white/5 transition-all group"
          >
            <span>Explore All 20+ Client Projects & Masonry Stream</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-cyan-400" />
          </Link>
        </div>
      </div>

      {/* Interactive Device Preview Modal (Matching Screenshot 1 Popup) */}
      {activeModalProject && (
        <DevicePreviewModal
          project={activeModalProject}
          onClose={() => setActiveModalProject(null)}
          onBuy={handleBuy}
        />
      )}
    </section>
  );
}
