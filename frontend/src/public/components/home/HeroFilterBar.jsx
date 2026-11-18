import React, { useState } from 'react';
import { Search, Compass, DollarSign, Layers } from 'lucide-react';

export default function HeroFilterBar({ categories = [], onFilterSelect }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedScale, setSelectedScale] = useState('');

  const defaultCategories = [
    'All Services',
    'Web Development',
    'AI & Automation',
    'Digital Marketing',
    'IT & Cloud Support',
  ];

  const categoryList =
    categories.length > 0 ? ['All Services', ...categories] : defaultCategories;

  const handleSearch = () => {
    if (onFilterSelect) {
      onFilterSelect({
        category: selectedCategory,
        budget: selectedBudget,
        scale: selectedScale,
      });
    }
    const section = document.getElementById('services-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative z-30 max-w-4xl mx-auto -mt-10 px-4">
      <div className="bg-white rounded-2xl md:rounded-full shadow-2xl px-6 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-100">
        {/* Column 1: Service Category */}
        <div className="w-full md:w-1/3 flex items-center gap-3 border-b md:border-b-0 md:border-r border-slate-100 pb-3 md:pb-0 md:pr-4">
          <div className="w-9 h-9 rounded-full bg-blue-50 text-[var(--brand-primary,#3B66D4)] flex items-center justify-center flex-shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">
              Service Category
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              {categoryList.map((cat, idx) => (
                <option key={idx} value={cat === 'All Services' ? '' : cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Column 2: Budget / Package */}
        <div className="w-full md:w-1/3 flex items-center gap-3 border-b md:border-b-0 md:border-r border-slate-100 pb-3 md:pb-0 md:pr-4">
          <div className="w-9 h-9 rounded-full bg-blue-50 text-[var(--brand-primary,#3B66D4)] flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">
              Budget / Package
            </span>
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="">Any Price</option>
              <option value="starter">Starter Website ($499)</option>
              <option value="business">Business CMS ($1,299)</option>
              <option value="enterprise">Full Enterprise Portal ($2,999+)</option>
              <option value="marketing">Monthly SEO & Ads Retainer</option>
            </select>
          </div>
        </div>

        {/* Column 3: Project Scale / Timeline */}
        <div className="w-full md:w-1/3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-50 text-[var(--brand-primary,#3B66D4)] flex items-center justify-center flex-shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">
              Project Scale
            </span>
            <select
              value={selectedScale}
              onChange={(e) => setSelectedScale(e.target.value)}
              className="text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="">Any Size</option>
              <option value="quick">Quick Launch (1–2 Weeks)</option>
              <option value="custom">Custom Full-Stack Sprint</option>
              <option value="dedicated">Dedicated IT & DevOps Support</option>
            </select>
          </div>
        </div>

        {/* Column 4: Circular Royal Blue Search Button */}
        <button
          type="button"
          onClick={handleSearch}
          className="w-12 h-12 rounded-full bg-[var(--brand-primary,#3B66D4)] hover:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0 transition-transform hover:scale-105 active:scale-95"
          title="Search Matching Services"
          aria-label="Search Services"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

