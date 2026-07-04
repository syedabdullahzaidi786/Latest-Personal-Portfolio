'use client';

import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, useMotionValue, useTransform, useReducedMotion } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowUpRight, Download } from 'lucide-react';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const BackgroundScene = dynamic(
  () => import('@/components/3d/HeroScene3D').then((m) => ({ default: m.BackgroundScene })),
  { ssr: false, loading: () => <div className="w-full h-full bg-transparent" /> }
);

type MouseRef = { x: number; y: number; tx: number; ty: number };

const socialLinks = [
  { href: 'https://github.com/syedabdullahzaidi786', icon: Github, label: 'GitHub' },
  { href: 'https://linkedin.com/in/syed-abdullah-zaidi-4954a7395', icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:syedabdullahzaidi786@gmail.com', icon: Mail, label: 'Email' },
];

export function HeroSection() {
  const mouseRef = useRef<MouseRef>({ x: 0, y: 0, tx: 0, ty: 0 });
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const prefersReduced = useReducedMotion();
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const glowBg = useTransform([mouseX, mouseY], ([x, y]) =>
    `radial-gradient(600px at ${(x as number) * 100}% ${(y as number) * 100}%, rgba(59,130,246,0.12), transparent 60%)`
  );

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.x = x;
      mouseRef.current.y = y;
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', onMouse, { passive: true });
    return () => window.removeEventListener('mousemove', onMouse);
  }, [mouseX, mouseY]);

  return (
    <section id="home" className="relative h-dvh lg:h-screen overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ErrorBoundary>
          <BackgroundScene mouse={mouseRef.current} />
        </ErrorBoundary>
      </div>

      {!prefersReduced && (
        <motion.div
          className="fixed inset-0 z-[1] pointer-events-none"
          style={{ background: glowBg }}
        />
      )}

      {/* Fade gradient at bottom — smooth bridge to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-[#08080c] z-20 pointer-events-none" />

      {/* Desktop social rail — side floating */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, x: -20 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { delay: 0.9, staggerChildren: 0.06, when: 'beforeChildren' },
          },
        }}
        className="fixed left-3 xl:left-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-3"
      >
        <div className="w-[3px] h-8 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
        {socialLinks.map(({ href, icon: Icon, label }) => (
          <motion.div
            key={label}
            variants={{
              hidden: { opacity: 0, x: -10 },
              visible: { opacity: 1, x: 0 },
            }}
            className="relative"
          >
            <motion.a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredSocial(label)}
              onMouseLeave={() => setHoveredSocial(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-11 h-11 rounded-lg text-[var(--text-muted)] hover:text-accent hover:bg-accent-subtle hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-colors duration-300"
            >
              {Icon ? (
                <Icon className="w-[22px] h-[22px]" />
              ) : (
                <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              )}
            </motion.a>
            <div
              className={`absolute left-12 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg border border-white/[0.06] bg-surface-overlay/90 backdrop-blur-xl whitespace-nowrap transition-all duration-200 pointer-events-none ${
                hoveredSocial === label
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-1'
              }`}
            >
              <span className="text-[11px] font-medium text-white/70">{label}</span>
            </div>
          </motion.div>
        ))}
        <div className="w-[3px] h-8 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 h-full max-w-content-wide mx-auto px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24">
        <div className="flex flex-col justify-center h-full py-8 lg:pt-20 lg:pb-8">
          <div className="space-y-5 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: prefersReduced ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              {/* <span className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-accent/20 bg-accent-subtle transition-all duration-300 hover:border-accent/40 hover:shadow-[0_0_24px_rgba(59,130,246,0.15)]">
                <span className="relative w-2 h-2">
                  <span className="absolute inset-0 rounded-full bg-accent/80" />
                  <span className="absolute inset-0 rounded-full bg-accent/40 animate-ping" style={{ animationDuration: '2s' }} />
                </span>
                <span className="text-xs font-semibold tracking-wide text-accent/80">Open to Intern & Remote Roles</span>
              </span> */}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: prefersReduced ? 0 : 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="space-y-1"
            >
              <p className="text-base sm:text-lg text-[var(--text-muted)] font-medium tracking-wide">
                Hi, I&apos;m
              </p>
              <h1 className="text-[clamp(2rem,6vw,5rem)] font-extrabold text-white leading-[1.05] tracking-[-0.04em]">
                SYED ABDULLAH ZAIDI
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
            >
              <p className="text-[clamp(1.125rem,2.5vw,2.25rem)] font-bold text-[var(--text-primary)]">
                Full-Stack Developer{' '}
                <span className="text-[var(--text-muted)] font-light">&amp;</span>{' '}
                <span className="text-accent">Agentic AI</span>{' '}
                <span className="text-[var(--text-primary)]">Developer</span>
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.25 }}
              className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-xl"
            >
              Building <span className="text-accent font-semibold">autonomous AI systems</span> and scalable web applications from agent workflows to fullstack applications.
            </motion.p>

            {/* Tech pills */}
            <motion.div
              initial={{ opacity: 0, y: prefersReduced ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.3 }}
              className="flex flex-wrap gap-2.5"
            >
              {['Next.js','FastAPI','OpenAI Agents SDK','MCP','RAG'].map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: 0.35 + i * 0.05 }}
                  className="px-3.5 py-1.5 text-[12px] font-semibold tracking-wide rounded-lg border border-accent/20 bg-accent-subtle text-accent/90 hover:text-accent hover:border-accent/40 hover:bg-accent-soft hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 cursor-default"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <motion.a
                href="#work"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base sm:text-lg font-bold text-white tracking-wide transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent group"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  boxShadow: '0 8px 32px rgba(59,130,246,0.28), 0 0 60px rgba(59,130,246,0.12)',
                }}
              >
                Explore My Work
                <ArrowUpRight className="w-[22px] h-[22px] transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </motion.a>
              <motion.a
                href="/cv.pdf" target="_blank" rel="noopener noreferrer"
                whileHover={{ y: -1, scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-base sm:text-lg font-semibold text-white/80 hover:text-white transition-colors duration-300 group border border-accent/40 bg-accent-subtle hover:border-accent/70 hover:bg-accent-soft"
              >
                <Download className="w-[20px] h-[20px] transition-transform duration-300 group-hover:translate-y-0.5" />
                Resume
              </motion.a>
            </motion.div>
          </div>

          {/* Mobile social */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="flex items-center gap-5 pt-8 lg:hidden"
          >
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--text-muted)]">Social</span>
            <div className="w-8 h-px bg-white/10" />
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-11 h-11 rounded-lg text-[var(--text-muted)] hover:text-white/80 hover:bg-white/[0.06] hover:scale-105 transition-colors duration-300"
                aria-label={label}
              >
            {Icon ? <Icon className="w-[22px] h-[22px]" /> : (
              <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                )}
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden lg:flex flex-col items-center gap-3"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1.5"
        >
          <span className="w-[1.5px] h-6 bg-gradient-to-b from-white/40 to-transparent rounded-full" />
          <span className="w-3 h-3 rotate-45 border-r-[1.5px] border-b-[1.5px] border-white/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
