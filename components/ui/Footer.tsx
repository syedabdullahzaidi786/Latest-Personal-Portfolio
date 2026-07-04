'use client';

import { motion } from 'framer-motion';
import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { navItems } from '@/lib/data';

export function Footer() {
  const scrollTo = (href: string) => {
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    scrollTo('#home');
  };

  return (
    <footer className="relative border-t border-white/[0.05] overflow-hidden bg-[#060608]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent/[0.04] rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/[0.04] rounded-full blur-[150px]" />
      </div>

      <div className="absolute top-0 left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent" />

      <div className="relative z-10 max-w-content-wide mx-auto px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">

          <div className="space-y-4 md:pr-6 md:border-r border-white/[0.04]">
            <span className="text-xl font-black tracking-tight text-white inline-flex items-center gap-2">
              SYED ABDULLAH ZAIDI
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" style={{ animationDuration: '3s' }} />
            </span>
            <p className="text-sm text-white/70 leading-relaxed max-w-xs">
              Building autonomous AI systems and fullstack applications that bridge Sociology with technology.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {[
                { href: 'https://github.com/syedabdullahzaidi786', icon: Github, label: 'GitHub' },
                { href: 'https://linkedin.com/in/syed-abdullah-zaidi-4954a7395', icon: Linkedin, label: 'LinkedIn' },
                { href: 'mailto:syedabdullahzaidi786@gmail.com', icon: Mail, label: 'Email' },
              ].map(({ href, icon: Icon, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-11 h-11 rounded-lg border border-white/[0.06] flex items-center justify-center text-white/50 hover:text-accent hover:border-accent/30 hover:bg-accent-subtle hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-colors duration-300"
                >
                  <Icon className="w-[22px] h-[22px]" />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="space-y-4 md:pl-2">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Navigation</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {navItems.map((item) => (
                <motion.button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  whileTap={{ scale: 0.97 }}
                  className="text-left text-sm text-white/60 hover:text-accent transition-colors duration-200 hover:translate-x-0.5"
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-4 md:pl-6 md:border-l border-white/[0.04]">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Get in Touch</p>
            <p className="text-sm text-white/70 leading-relaxed">
              Let&apos;s build something together.
            </p>
            <motion.button
              onClick={() => scrollTo('#contact')}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white tracking-wider uppercase transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                boxShadow: '0 4px 16px rgba(59,130,246,0.28)',
              }}
            >
              {"Let's Talk"}
            </motion.button>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/40">
            <span className="inline-block w-1 h-1 rounded-full bg-accent/60 align-middle mr-2" />
            &copy; {new Date().getFullYear()} Syed Abdullah Zaidi. All rights reserved.
          </p>
          <motion.button
            onClick={scrollToTop}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-1.5 text-[11px] text-white/40 hover:text-accent px-3 py-1.5 rounded-md transition-colors duration-300 group"
          >
            Back to top
            <ArrowUp className="w-3 h-3 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
