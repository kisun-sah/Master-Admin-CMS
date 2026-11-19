import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { DEFAULT_CMS_FALLBACKS } from '../../config/defaultCmsFallbacks';
import { FadeUp, StaggerContainer, StaggerItem } from '../common/ScrollReveal';

export default function HomeFaqAccordion({ faqs = [] }) {
  const [openIdx, setOpenIdx] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const items = faqs && faqs.length > 0 ? faqs : DEFAULT_CMS_FALLBACKS.faqs;

  const categories = [
    'All',
    ...Array.from(new Set(items.map((f) => f.category || 'General'))),
  ];

  const filtered =
    selectedCategory === 'All'
      ? items
      : items.filter(
          (f) =>
            (f.category || 'General').toLowerCase() === selectedCategory.toLowerCase()
        );

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-24 bg-[#F8FAFC] border-t border-slate-200/80 relative overflow-hidden" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeUp className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-[var(--brand-primary,#3B66D4)] text-xs font-bold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Common Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Everything you need to know about ordering websites, CMS capabilities, and IT support.
          </p>
        </FadeUp>

        {/* Category Tabs if multiple */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setOpenIdx(0);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[var(--brand-primary,#3B66D4)] text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Numbered Accordion List */}
        <StaggerContainer staggerDelay={0.08} className="space-y-4">
          {filtered.map((faq, idx) => {
            const isOpen = openIdx === idx;
            const numberFormatted = String(idx + 1).padStart(2, '0');

            return (
              <StaggerItem
                preset="card-reveal"
                key={faq._id || idx}
                className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[var(--brand-primary,#3B66D4)] font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                      {numberFormatted}
                    </span>
                    <span className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 shrink-0 ${
                      isOpen
                        ? 'bg-[var(--brand-primary,#3B66D4)] text-white rotate-180'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
