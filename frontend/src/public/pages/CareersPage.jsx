import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCareers } from '../lib/api';
import SEOHead from '../components/layout/SEOHead';
import {
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  DollarSign,
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
        'Help us build high-performance public client web portals, dynamic CMS block renderers, and modern responsive web apps.',
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
        'Collaborate with our Lead IT Officer managing cloud deployments, monitoring system uptime, and configuring domain DNS and automated backups.',
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
        'Produce technical case studies, drive client SEO strategy, manage multi-channel PPC campaigns, and optimize conversion rate metrics.',
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
    <div className="pt-28 pb-20 bg-[#F8FAFC] min-h-screen">
      <SEOHead
        title="Careers & Freelance Collaborations — Join Our Studio"
        description="Explore open engineering, digital marketing, and IT officer opportunities. Work on cutting-edge MERN applications and high-impact digital products."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-[var(--brand-primary,#3B66D4)] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join Our Growth Engine</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Careers & Freelance Collaborations
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            We are actively looking for talented developers, designers, and marketing specialists to collaborate on bespoke client projects.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {departments.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setDepartmentFilter(dept)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                departmentFilter === dept
                  ? 'bg-[var(--brand-primary,#3B66D4)] text-white shadow-md shadow-blue-500/25'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
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
              className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-blue-50 text-[var(--brand-primary,#3B66D4)] text-xs font-bold border border-blue-100">
                  {job.department || 'Engineering'}
                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  {job.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
                  {job.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[var(--brand-primary,#3B66D4)]" />
                    <span>{job.workMode || 'Remote'}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[var(--brand-primary,#3B66D4)]" />
                    <span>{job.employmentType || 'Contract / Full-time'}</span>
                  </span>
                  {job.salaryRange && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>{job.salaryRange}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>

              <Link
                to={`/careers/${job.slug}`}
                className="px-6 py-3 rounded-full bg-[var(--brand-primary,#3B66D4)] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shrink-0 inline-flex items-center gap-2 shadow-md shadow-blue-500/25 transition-transform hover:scale-105 active:scale-95"
              >
                <span>View Role & Apply</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500 bg-white rounded-2xl border border-slate-200">
              No open roles found in this category right now. You can still reach out via our contact page!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
