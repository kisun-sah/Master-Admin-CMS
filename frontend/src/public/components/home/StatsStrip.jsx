import React from 'react';
import { Rocket, Smile, TrendingUp, Trophy } from 'lucide-react';

export default function StatsStrip({ stats = [] }) {
  const defaultStats = [
    { value: '100+', label: 'Projects Delivered', icon: Rocket, color: 'text-blue-600 bg-blue-50' },
    { value: '98%', label: 'Client Satisfaction', icon: Smile, color: 'text-emerald-600 bg-emerald-50' },
    { value: '5x', label: 'Average Growth', icon: TrendingUp, color: 'text-cyan-600 bg-cyan-50' },
    { value: '10+', label: 'Industry Awards', icon: Trophy, color: 'text-amber-600 bg-amber-50' },
  ];

  const items = stats.length > 0 ? stats : defaultStats;

  return (
    <section className="py-10 bg-white border-b border-slate-200/90 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {items.map((stat, idx) => {
            const Icon = stat.icon || Rocket;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 px-3 sm:px-6 py-2 justify-center group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${stat.color || 'text-blue-600 bg-blue-50'} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="text-left">
                  <div className="text-2xl sm:text-3xl font-black text-[#172554] tracking-tight leading-none mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-[#64748B] font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
