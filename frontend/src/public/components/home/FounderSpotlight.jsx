import React from 'react';
import { Link } from 'react-router-dom';
import { resolveMediaUrl } from '../../lib/api';
import {
  Code2,
  Server,
  Cpu,
  TrendingUp,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Award,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

export default function FounderSpotlight({ team = [] }) {
  // If team members are loaded from CMS, find lead or use first
  const founder = team && team.length > 0 ? team[0] : null;

  const founderName = founder?.name || 'Alex Carter';
  const founderRole =
    founder?.role || 'Lead Full-Stack Developer, IT Officer & Digital Marketer';
  const founderBio =
    founder?.bio ||
    'Multi-disciplinary technology architect with 7+ years of experience engineering high-throughput MERN platforms, enterprise CMS architectures, robust Linux & Cloud networking setups, and performance-driven digital marketing engines.';
  const founderImage = resolveMediaUrl(
    founder?.avatarUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop'
  );

  const skills = [
    { title: 'Full-Stack Web Engineering', desc: 'MERN, Next.js, Dynamic CMS Blocks, REST & GraphQL', icon: Code2 },
    { title: 'IT Officer & Cloud Systems', desc: 'AWS, Linux SysAdmin, VPNs, Disaster Backup, Security SLAs', icon: Server },
    { title: 'AI & Workflow Automation', desc: 'LLM Chatbots, OpenAI API, Custom Knowledge Bases', icon: Cpu },
    { title: 'Growth Marketing & SEO', desc: '100/100 Core Web Vitals, Google Ads, Meta Ads Funnels', icon: TrendingUp },
  ];

  return (
    <section className="py-24 bg-[#090D16] relative overflow-hidden" id="about-spotlight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Portrait Card with Credentials (5 cols) */}
          <div className="lg:col-span-5 relative">
            {/* Ambient Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 rounded-3xl blur-2xl pointer-events-none" />

            <div className="relative glass-card rounded-3xl overflow-hidden border border-white/15 p-6 shadow-2xl">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900 mb-6 relative">
                <img
                  src={founderImage}
                  alt={founderName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-transparent to-transparent opacity-80" />

                {/* Role Pill */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl glass-panel border border-white/10">
                  <div className="text-white font-extrabold text-base">{founderName}</div>
                  <div className="text-cyan-400 text-xs font-semibold">{founderRole}</div>
                </div>
              </div>

              {/* Social Links Bar */}
              <div className="flex items-center justify-center gap-3">
                {founder?.socialLinks?.github && (
                  <a
                    href={founder.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-cyan-500 hover:text-black text-slate-300 transition-all"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {founder?.socialLinks?.linkedin && (
                  <a
                    href={founder.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-cyan-500 hover:text-black text-slate-300 transition-all"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {founder?.socialLinks?.twitter && (
                  <a
                    href={founder.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-cyan-500 hover:text-black text-slate-300 transition-all"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                <Link
                  to="/contact"
                  className="px-4 py-2 rounded-xl btn-primary-glow text-xs font-bold inline-flex items-center gap-1.5 ml-auto"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Get in Touch</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Bio & Core Disciplines (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Founder & Technology Architect</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              A Complete Multi-Disciplinary Partner for Your Digital Growth
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {founderBio}
            </p>

            {/* 4 Pillars of Competence */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {skills.map((skill, idx) => {
                const Icon = skill.icon;
                return (
                  <div
                    key={idx}
                    className="glass-panel rounded-2xl p-4 border border-white/10 hover:border-cyan-500/30 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white mb-1">
                          {skill.title}
                        </div>
                        <div className="text-xs text-slate-400 leading-relaxed">
                          {skill.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA action */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/about"
                className="px-6 py-3 rounded-full btn-primary-glow text-sm font-bold shadow-neon-cyan inline-flex items-center gap-2"
              >
                <span>Read Full Biography & CV</span>
                <span>&rarr;</span>
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 rounded-full glass-panel border border-white/20 text-white text-sm font-semibold hover:bg-white/10"
              >
                Schedule 15-Min Discovery Call
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
