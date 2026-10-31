import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCareers } from '../lib/api';
import SEOHead from '../components/layout/SEOHead';
import {
  Sparkles,
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  DollarSign,
  Calendar,
} from 'lucide-react';

export default function CareersPage() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [modeFilter, setModeFilter] = useState('All');

  useEffect(() => {
    async function load() {
      try {
        const data = await getCareers();
        setCareers(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Error loading careers:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const defaultOpenings = [
    {
      title: 'Senior Frontend Developer (React & Next.js)',
      slug: 'senior-frontend-developer',
      department: 'Engineering',
      employmentType: 'Full-time / Contract',
      workMode: 'Remote Worldwide',
      salaryRange: '$4,000 - $6,500 / mo',
      applicationDeadline: '2026-12-31',
      description:
        'Help us build high-performance public client web portals, dynamic CMS block renderers, and modern glassmorphic web apps.',
    },
    {
      title: 'Junior IT Systems & Cloud Assistant',
      slug: 'junior-it-systems-cloud-assistant',
      department: 'IT & Cloud',
      employmentType: 'Part-time / Internship',
      workMode: 'Remote',
      salaryRange: '$1,500 - $2,500 / mo',
      applicationDeadline: '2026-11-30',
      description:
        'Collaborate with our Lead IT Officer managing AWS deployments, monitoring system uptime, and configuring domain DNS and automated backups.',
    },
    {
      title: 'Digital Marketing & Content Specialist',
      slug: 'digital-marketing-content-specialist',
      department: 'Marketing',
      employmentType: 'Contract',
      workMode: 'Remote',
      salaryRange: '$2,000 - $3,500 / mo',
      applicationDeadline: '2026-12-15',
      description:
        'Craft SEO-optimized engineering blog posts, manage client PPC campaigns across Google and Meta, and run conversion funnels.',
    },
  ];

  const activeCareers = careers && careers.length > 0 ? careers : defaultOpenings;

  const departments = [
    'All',
    ...new Set(activeCareers.map((c) => c.department).filter(Boolean)),
  ];

  const filtered = activeCareers.filter((item) => {
    const matchDept =
      departmentFilter === 'All' ||
      item.department?.toLowerCase() === departmentFilter.toLowerCase();
    const matchMode =
      modeFilter === 'All' ||
      item.workMode?.toLowerCase().includes(modeFilter.toLowerCase());
    return matchDept && matchMode;
  });

  return (
    <div className="pt-28 pb-20 bg-[#090D16] min-h-screen">
      <SEOHead
        title="Careers & Freelance Collaborations — Join Our Studio"
        description="Explore open engineering, digital marketing, and IT officer opportunities. Work on cutting-edge MERN applications and high-impact digital products."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join Our Growth Engine</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Careers & Freelance Collaborations
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            We are actively looking for talented developers, designers, and marketing specialists to collaborate on bespoke client projects.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                departmentFilter === dept
                  ? 'btn-primary-glow shadow-neon-cyan text-white'
                  : 'glass-panel text-slate-300 hover:text-white'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Vacancies List */}
        <div className="max-w-4xl mx-auto space-y-6">
          {filtered.map((job, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 text-xs font-bold">
                  {job.department || 'Engineering'}
                </div>

                <h3 className="text-xl font-bold text-white">
                  {job.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 line-clamp-2">
                  {job.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{job.workMode || 'Remote'}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{job.employmentType || 'Contract / Full-time'}</span>
                  </span>
                  {job.salaryRange && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>{job.salaryRange}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>

              <Link
                to={`/careers/${job.slug}`}
                className="px-6 py-3 rounded-full btn-primary-glow font-bold text-xs sm:text-sm shrink-0 inline-flex items-center gap-2 shadow-neon-cyan"
              >
                <span>View Role & Apply</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400 glass-card rounded-2xl border border-white/5">
              No open roles found in this category right now. You can still reach out via our contact page!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
