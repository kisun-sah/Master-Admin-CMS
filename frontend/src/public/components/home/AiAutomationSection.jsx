import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Bot,
  Cpu,
  Workflow,
  CheckCircle2,
  FileText,
  Calendar,
  Database,
} from 'lucide-react';
import { FadeUp, ScaleIn, StaggerContainer, StaggerItem } from '../common/ScrollReveal';

export default function AiAutomationSection() {
  const capabilities = [
    {
      title: 'Automated Document & Data Pipelines',
      desc: 'Process invoices, customer leads, and reports automatically with zero manual effort.',
      icon: FileText,
    },
    {
      title: 'Smart Scheduling & CRM Integration',
      desc: 'Sync calendar bookings, task management, and client notifications seamlessly in real time.',
      icon: Calendar,
    },
    {
      title: 'Conversational AI Chatbots & RAG',
      desc: 'Deploy 24/7 autonomous agents trained on your business data to convert visitors into clients.',
      icon: Bot,
    },
    {
      title: 'Database & Cloud Microservices',
      desc: 'Robust high-throughput APIs connecting your Master Admin CMS to external enterprise tools.',
      icon: Database,
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden border-b border-slate-200" id="ai-automation">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-cyan-100/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* ================= LEFT: 3D ROBOT WORKFLOW ILLUSTRATION ================= */}
          <ScaleIn delay={0.15} className="lg:col-span-6 order-2 lg:order-1 relative flex justify-center">
            <div className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
              <img
                src="/assets/illustrations/ai-robot-workflows.jpg"
                alt="AI Robot Automated Workflows"
                className="w-full h-[400px] sm:h-[440px] object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Floating Status Pill */}
              <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200/90 shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500 text-white flex items-center justify-center font-bold shadow-md shadow-cyan-500/25">
                    <Cpu className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Autonomous Intelligence Engine
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Live sync across documents, tasks &amp; databases
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Active 24/7</span>
                </div>
              </div>
            </div>
          </ScaleIn>

          {/* ================= RIGHT: HEADLINE & CAPABILITIES ================= */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6 text-left">
            <FadeUp delay={0.05}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold tracking-widest uppercase shadow-sm">
                <Bot className="w-3.5 h-3.5" />
                <span>AI SOLUTIONS &amp; BUSINESS AUTOMATION</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#172554] tracking-tight leading-tight mt-3">
                Make Your Business <span className="text-blue-600">Smarter with AI</span>
              </h2>

              <p className="text-base text-[#64748B] leading-relaxed mt-2">
                Transform repetitive tasks into intelligent, self-operating workflows. We engineer custom artificial intelligence integrations, n8n automations, and smart bots that save hours every day.
              </p>
            </FadeUp>

            <StaggerContainer staggerDelay={0.08} delayChildren={0.1} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {capabilities.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <StaggerItem
                    key={idx}
                    preset="card-reveal"
                    className="bg-[#F8FAFC] hover:bg-white p-4 rounded-2xl border border-slate-200/90 hover:border-blue-300 shadow-xs hover:shadow-md transition-all group hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-2.5 text-blue-600 font-bold text-sm mb-1.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="group-hover:text-blue-700 transition-colors">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      {item.desc}
                    </p>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>

            <FadeUp delay={0.2} className="pt-2 flex items-center gap-4">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-transform hover:scale-105 active:scale-95"
              >
                <span>Explore AI Automation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-all"
              >
                <span>Request a Demo</span>
              </Link>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
