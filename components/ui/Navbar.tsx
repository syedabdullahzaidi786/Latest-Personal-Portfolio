'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import { navItems } from '@/lib/data';

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');
  const mobileRef = useRef<HTMLDivElement>(null);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = navItems.map(item => item.href.replace('#', ''));
    const elMap = new Map(ids.map(id => [id, document.getElementById(id)]));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );
    for (const el of elMap.values()) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const first = mobileRef.current?.querySelector<HTMLElement>('button');
        first?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobile();
      if (e.key === 'Tab' && mobileOpen && mobileRef.current) {
        const focusable = mobileRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeMobile, mobileOpen]);

  const scrollTo = (href: string) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      const nav = document.querySelector('nav');
      const navHeight = nav?.getBoundingClientRect().height ?? 80;
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      const distance = Math.abs(top - window.scrollY);
      const behavior: ScrollBehavior = distance > 2000 ? 'instant' : 'smooth';
      window.scrollTo({ top, behavior });
    }
    setMobileOpen(false);
  };

  return (
    <>
      <a
        href="#about"
        className="fixed -top-40 left-4 z-[100] px-4 py-2 rounded-lg bg-accent text-xs font-bold text-white uppercase tracking-wider transition-all focus:top-4 focus:outline-2 focus:outline-offset-2 focus:outline-accent"
      >
        Skip to content
      </a>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24 transition-all duration-500 ${
          scrolled ? 'pt-2' : 'pt-5'
        } ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
      >
        <div className="max-w-content-wide mx-auto">
          <div
            className={`relative flex items-center justify-between px-4 sm:px-5 transition-all duration-500 rounded-2xl border ${
              scrolled
                ? 'py-2 bg-surface-overlay/90 backdrop-blur-2xl border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.4)]'
                : 'py-2.5 bg-transparent border-transparent'
            }`}
          >
            <div className="flex items-center gap-3 relative z-10">
              <button onClick={() => scrollTo('#home')} className="flex flex-col items-start min-h-11 justify-center">
                <span className="text-lg sm:text-xl font-black tracking-tight text-white">
                  SYED ABDULLAH ZAIDI
                </span>
                <span className="text-[10px] tracking-[0.25em] text-[var(--text-muted)] font-medium uppercase leading-tight">
                  Full Stack Developer &bull; Agentic AI
                </span>
              </button>
            </div>

            <div className="hidden md:flex items-center gap-0.5 relative z-10">
              {navItems.map((item) =>
                item.external ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative px-3 xl:px-4 py-3 text-xs font-bold tracking-wider uppercase rounded-lg transition-all duration-300 text-[var(--text-body)] hover:text-white/80"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.href}
                    onClick={() => scrollTo(item.href)}
                    className={`relative px-3 xl:px-4 py-3 text-xs font-bold tracking-wider uppercase rounded-lg transition-all duration-300 ${
                      activeSection === item.href
                        ? 'text-white'
                        : 'text-[var(--text-body)] hover:text-white/80'
                    }`}
                  >
                    <span className="relative z-10">{item.label}</span>
                    {activeSection === item.href && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute bottom-[3px] left-2.5 right-2.5 h-0.5 rounded-full bg-accent"
                        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                      />
                    )}
                  </button>
                )
              )}
            </div>

            <div className="hidden md:flex items-center relative z-10">
              <motion.button
                onClick={() => scrollTo('#contact')}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-accent/30 bg-accent-subtle text-xs font-bold text-accent tracking-wider uppercase transition-all duration-300 hover:bg-accent-soft hover:border-accent/60 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
              >
                {"Let's Talk"}
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </motion.button>
            </div>

            <button
              className="md:hidden flex items-center justify-center w-11 h-11 text-[var(--text-muted)] hover:text-white transition-colors relative z-10 rounded-lg hover:bg-white/[0.04]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <span className={`absolute block h-[2px] w-5 bg-current rounded-full transition-all duration-300 ${
                  mobileOpen ? 'rotate-45' : '-translate-y-1.5'
                }`} />
                <span className={`absolute block h-[2px] w-5 bg-current rounded-full transition-all duration-300 ${
                  mobileOpen ? 'opacity-0' : 'opacity-100'
                }`} />
                <span className={`absolute block h-[2px] w-5 bg-current rounded-full transition-all duration-300 ${
                  mobileOpen ? '-rotate-45' : 'translate-y-1.5'
                }`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setMobileOpen(false)} />
            <div ref={mobileRef} className="absolute top-20 left-4 right-4">
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex flex-col gap-1 p-5 rounded-2xl border border-white/10 bg-surface-overlay/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
              >
                <div className="flex items-center justify-between pb-4 mb-2 border-b border-white/5">
                  <div>
                    <p className="text-sm font-black tracking-tight text-white">SYED ABDULLAH ZAIDI</p>
                    <p className="text-[9px] tracking-[0.25em] text-[var(--text-muted)] font-medium uppercase">Fullstack &bull; Agentic AI</p>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="w-11 h-11 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-white/[0.06] transition-all"
                    aria-label="Close menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {navItems.map((item, i) =>
                  item.external ? (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-left px-4 py-4 rounded-xl text-sm font-bold tracking-wider uppercase transition-all text-[var(--text-body)] hover:text-white hover:bg-white/5"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <motion.button
                      key={item.href}
                      onClick={() => scrollTo(item.href)}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i, duration: 0.25 }}
                      className={`text-left px-4 py-4 rounded-xl text-sm font-bold tracking-wider uppercase transition-all ${
                        activeSection === item.href
                          ? 'text-white bg-white/10'
                          : 'text-[var(--text-body)] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {item.label}
                    </motion.button>
                  )
                )}
                <div className="pt-3 mt-2 border-t border-white/5">
                  <motion.button
                    onClick={() => scrollTo('#contact')}
                    whileTap={{ scale: 0.97 }}
                    className="group flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-accent/30 bg-accent-subtle text-xs font-bold text-accent tracking-wider uppercase transition-all hover:bg-accent-soft"
                  >
                    {"Let's Talk"}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}