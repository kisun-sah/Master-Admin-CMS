import React, { useState } from 'react';
import { ChevronDown, Sparkles, HelpCircle } from 'lucide-react';

export default function HomeFaqAccordion({ faqs = [] }) {
  const [openIdx, setOpenIdx] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const defaultFaqs = [
    {
      question: 'Do I get an Admin Panel to edit my website content after delivery?',
      answer:
        'Yes, 100%! Every custom website we deliver is powered by our proprietary Master Admin CMS. You receive full superadmin access to manage pages, blocks, services, photo galleries, tech blogs, video hero reels, site settings, and SEO without writing a single line of code.',
      category: 'General',
    },
    {
      question: 'How long does it take to build and deploy a custom business website?',
      answer:
        'Starter and business template deployments take 3 to 7 business days. Complex custom portals (e-commerce with payment gateways, healthcare booking, hospital management, or university systems) take 2 to 4 weeks depending on the required integrations.',
      category: 'Services',
    },
    {
      question: 'Can you handle server hosting, domain DNS, and 24/7 IT maintenance?',
      answer:
        'Absolutely. As a dedicated IT Officer and Cloud Engineer, we offer fully managed cloud hosting (AWS, DigitalOcean, or private VPS) complete with SSL certificates, automated daily backups, firewall defense, and guaranteed 99.9% uptime SLAs.',
      category: 'Technical',
    },
    {
      question: 'What is included in your Monthly Digital Marketing & SEO packages?',
      answer:
        'Our packages include end-to-end Technical SEO optimization (100/100 Core Web Vitals, dynamic sitemaps, structured schema data), high-converting landing page optimization, Google Search Ads (PPC), Meta Ads funnels, and transparent monthly ROI reports.',
      category: 'Billing',
    },
  ];

  const items = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  const categories = ['All', ...new Set(items.map((f) => f.category || 'General'))];

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
    <section className="py-24 bg-[#070A10] border-t border-white/10 relative overflow-hidden" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Common Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Everything you need to know about ordering websites, CMS capabilities, and IT support.
          </p>
        </div>

        {/* Category Tabs if multiple */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setOpenIdx(0);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'btn-primary-glow text-white'
                    : 'glass-panel text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Accordion List */}
        <div className="space-y-4">
          {filtered.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl border border-white/10 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4"
                >
                  <span className="font-bold text-white text-base sm:text-lg">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full glass-panel border border-white/10 flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 bg-cyan-500/20 text-cyan-400' : 'text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-white/5 mt-2 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
