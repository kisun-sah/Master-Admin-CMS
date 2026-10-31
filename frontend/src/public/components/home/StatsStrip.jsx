import React from 'react';
import { Award, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export default function StatsStrip({ stats = [] }) {
  const defaultStats = [
    { value: '50+', label: 'Websites & Portals Delivered', icon: CheckCircle },
    { value: '99.9%', label: 'System Uptime Managed', icon: Clock },
    { value: '3.8x', label: 'Average Client Lead Growth', icon: TrendingUp },
    { value: '24/7', label: 'Dedicated IT & SLA Support', icon: Award },
  ];

  const items = stats.length > 0 ? stats : defaultStats;

  return (
    <section className="py-14 bg-[#0B0F19] border-y border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {items.map((stat, idx) => {
            const Icon = stat.icon || CheckCircle;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl p-6 text-center border border-white/5 hover:border-cyan-500/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-400 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
