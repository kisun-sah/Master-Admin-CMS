import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTeam, resolveMediaUrl } from '../lib/api';
import { useCms } from '../context/CmsContext';
import SEOHead from '../components/layout/SEOHead';
import {
  Sparkles,
  Code2,
  Server,
  Cpu,
  TrendingUp,
  Award,
  CheckCircle2,
  ArrowRight,
  Github,
  Linkedin,
  Twitter,
  Mail,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

export default function AboutPage() {
  const { settings } = useCms();
  const [team, setTeam] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getTeam();
        setTeam(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Error loading team:', e);
      }
    }
    load();
  }, []);

  const lead = team && team.length > 0 ? team[0] : null;
  const leadName = lead?.name || 'Alex Carter';
  const leadRole = lead?.role || 'Lead Full-Stack Developer & IT Systems Architect';
  const leadImage = resolveMediaUrl(
    lead?.avatarUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop'
  );

  return (
    <div className="pt-28 pb-20 bg-[#090D16] min-h-screen">
      <SEOHead
        title="About & IT Pedigree — Personal Studio & Systems Architect"
        description="Learn about our full-stack engineering pedagogy, IT Officer credentials, cloud systems expertise, and digital marketing capabilities."
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: leadName,
          jobTitle: leadRole,
          url: window.location.origin,
          worksFor: {
            '@type': 'Organization',
            name: settings?.siteName || 'NEXUS DEVS',
          },
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pedigree & Technical Excellence</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            About Our Studio & IT Leadership
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            A fusion of modern full-stack web engineering, resilient enterprise IT systems administration, and data-driven marketing.
          </p>
        </div>

        {/* Founder Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-5 relative">
            <div className="glass-card rounded-3xl p-6 border border-white/15 shadow-2xl relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900 mb-6 relative">
                <img
                  src={leadImage}
                  alt={leadName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center">
                <div className="text-xl font-bold text-white">{leadName}</div>
                <div className="text-xs text-cyan-400 font-medium mb-4">{leadRole}</div>

                <div className="flex items-center justify-center gap-3">
                  {lead?.socialLinks?.github && (
                    <a
                      href={lead.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-cyan-500"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {lead?.socialLinks?.linkedin && (
                    <a
                      href={lead.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-cyan-500"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {lead?.socialLinks?.twitter && (
                    <a
                      href={lead.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-cyan-500"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl font-extrabold text-white">
              Bridging Complex Infrastructure with Consumer-Grade Elegance
            </h2>

            <p className="text-base text-slate-300 leading-relaxed">
              We started with a simple observation: modern businesses either hire web agencies that build slow, bloated websites, or IT consultants who understand server infrastructure but can't design converting user experiences.
            </p>

            <p className="text-base text-slate-300 leading-relaxed">
              Our studio bridges both disciplines. We engineer fast, clean MERN and Next.js applications equipped with the Master Admin CMS, while simultaneously ensuring that server architecture, disaster recovery, cloud security, and SEO rank tracking are executed to perfection.
            </p>

            {/* Core Values / Competencies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Code2 className="w-4 h-4" />
                  <span>100% Dynamic Autonomy</span>
                </div>
                <div className="text-xs text-slate-400 leading-relaxed">
                  Every site we deliver includes your own Master Admin CMS so you never need to pay for simple text, media, or price edits.
                </div>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Server className="w-4 h-4" />
                  <span>IT Officer Pedigree</span>
                </div>
                <div className="text-xs text-slate-400 leading-relaxed">
                  Proven cloud architecture experience across AWS, Linux terminal environments, VPN networks, and enterprise SLAs.
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-3.5 btn-primary-glow font-bold text-sm shadow-neon-cyan inline-flex items-center gap-2"
              >
                <span>Hire Studio for Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Collaborating Team Members if more than 1 */}
        {team.length > 1 && (
          <div className="pt-12 border-t border-white/10">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              Collaborators & Specialized Contributors
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.slice(1).map((member, idx) => (
                <div
                  key={idx}
                  className="glass-card rounded-2xl p-6 border border-white/10 flex items-center gap-4"
                >
                  <img
                    src={resolveMediaUrl(member.avatarUrl)}
                    alt={member.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-cyan-400/40"
                  />
                  <div>
                    <div className="text-base font-bold text-white">{member.name}</div>
                    <div className="text-xs text-cyan-400 font-medium">{member.role}</div>
                    <div className="text-xs text-slate-400 mt-1 line-clamp-2">{member.bio}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
