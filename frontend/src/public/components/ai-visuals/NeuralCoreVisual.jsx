import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  Bot,
  Layers,
  Sparkles,
  Zap,
  Code2,
  Workflow,
  Globe,
  Database,
  ShieldCheck,
} from 'lucide-react';

export default function NeuralCoreVisual({
  activeServiceIndex = 0,
  interactive = true,
  className = '',
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Floating nodes representing AI, Development & Architecture
  const nodes = [
    {
      id: 'ai-core',
      title: 'Neural Engine',
      subtitle: 'LLMs & Automation',
      icon: Bot,
      color: '#06B6D4',
      position: { top: '12%', left: '16%' },
    },
    {
      id: 'web-dev',
      title: 'Full-Stack Engine',
      subtitle: 'React & Node Microservices',
      icon: Code2,
      color: '#3B82F6',
      position: { top: '15%', right: '14%' },
    },
    {
      id: 'cloud-infra',
      title: 'Distributed Cloud',
      subtitle: 'DevOps & 99.9% Uptime',
      icon: Layers,
      color: '#8B5CF6',
      position: { bottom: '16%', right: '12%' },
    },
    {
      id: 'growth-seo',
      title: 'Growth Analytics',
      subtitle: 'Technical SEO & Ads',
      icon: Globe,
      color: '#F59E0B',
      position: { bottom: '18%', left: '14%' },
    },
  ];

  // Particle Canvas Background for digital neural constellation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement.clientHeight || 500);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes definition
    const numParticles = 36;
    const particles = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1,
        color: i % 2 === 0 ? 'rgba(6, 182, 212, 0.7)' : 'rgba(59, 130, 246, 0.7)',
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particle connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.25 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full aspect-square max-w-[540px] mx-auto flex items-center justify-center select-none overflow-hidden ${className}`}
    >
      {/* 1. HTML5 Canvas Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* 2. Ambient Cyber Radial Glows */}
      <div className="absolute w-72 h-72 rounded-full bg-cyan-500/20 blur-[90px] pointer-events-none" />
      <div className="absolute w-64 h-64 rounded-full bg-blue-600/25 blur-[100px] pointer-events-none" />

      {/* 3. Concentric Orbital Rings with Smooth Continuous Rotation */}
      <div className="absolute inset-8 rounded-full border border-cyan-500/20 pointer-events-none animate-[spin_40s_linear_infinite]" />
      <div className="absolute inset-16 rounded-full border border-dashed border-blue-400/25 pointer-events-none animate-[spin_30s_linear_infinite_reverse]" />
      <div className="absolute inset-24 rounded-full border border-white/10 pointer-events-none" />

      {/* 4. Central Glowing AI Intelligence Core */}
      <motion.div
        animate={{
          x: mousePos.x,
          y: mousePos.y,
        }}
        transition={{ type: 'spring', damping: 18, stiffness: 90 }}
        className="relative z-10 flex flex-col items-center justify-center"
      >
        {/* Outer Halo */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-blue-600/40 via-cyan-500/30 to-indigo-600/40 p-[2px] shadow-[0_0_50px_rgba(6,182,212,0.45)] backdrop-blur-xl">
          {/* Inner Core Container */}
          <div className="w-full h-full rounded-full bg-[#0B1528]/90 border border-white/20 flex flex-col items-center justify-center p-3 text-center relative overflow-hidden group">
            {/* Holographic Scanline Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000" />

            {/* Glowing Icon */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/50 mb-1.5">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>

            <span className="text-[11px] font-extrabold tracking-widest text-cyan-300 uppercase">
              AI NEXUS
            </span>
            <span className="text-[9px] font-medium text-slate-300">
              Autonomous Core
            </span>
          </div>
        </div>

        {/* Live Processing Indicator Pill */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold tracking-wider backdrop-blur-md shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>SYNAPSE ACTIVE</span>
        </div>
      </motion.div>

      {/* 5. Four Surrounding Satellite Capability Nodes */}
      {nodes.map((node, index) => {
        const IconComponent = node.icon;
        const isHighlighted = activeServiceIndex === index;

        return (
          <motion.div
            key={node.id}
            style={node.position}
            animate={{
              x: mousePos.x * (index % 2 === 0 ? 0.7 : -0.7),
              y: mousePos.y * (index % 2 === 0 ? -0.7 : 0.7),
            }}
            transition={{ type: 'spring', damping: 20, stiffness: 80 }}
            className={`absolute z-20 flex items-center gap-2.5 p-2 sm:p-2.5 rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
              isHighlighted
                ? 'bg-[#132A5E]/95 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-105'
                : 'bg-[#0E1C38]/85 border-white/15 hover:border-white/30 shadow-lg'
            }`}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm flex-shrink-0"
              style={{ backgroundColor: node.color }}
            >
              <IconComponent className="w-4 h-4" />
            </div>

            <div className="text-left hidden sm:block pr-1">
              <div className="text-[11px] font-bold text-white tracking-tight leading-tight">
                {node.title}
              </div>
              <div className="text-[9px] text-slate-300 font-medium">
                {node.subtitle}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

