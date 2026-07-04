'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, Check, ArrowUpRight } from 'lucide-react';

export function ContactSection() {
  const [emailCopied, setEmailCopied] = useState(false);
  const emailTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('emaniqbal907@gmail.com');
      setEmailCopied(true);
      if (emailTimeoutRef.current) clearTimeout(emailTimeoutRef.current);
      emailTimeoutRef.current = setTimeout(() => setEmailCopied(false), 2000);
    } catch { /* fallback */ }
  };

  return (
    <section id="contact" className="section-alt relative py-20 md:py-28 px-4 sm:px-6 overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/[0.03] rounded-full blur-[150px]" />
      </div>

      <div className="max-w-lg mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '300px 0px' }}
          transition={{ duration: 0.35 }}
          className="space-y-4"
        >
          <span className="section-label justify-center">Contact</span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            Let&apos;s build{' '}
            <span className="gradient-text">something</span>
          </h2>

          <p className="text-body text-[var(--text-body)] max-w-sm mx-auto">
            Open for intern and remote opportunities. Reach out and let&apos;s create something impactful.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '300px 0px' }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mt-8 inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-accent/20 bg-accent-subtle"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-medium text-accent/80 tracking-wide">Open for opportunities</span>
        </motion.div>

        <motion.div
          className="mt-10 space-y-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '300px 0px' }}
          transition={{ delay: 0.15, duration: 0.35 }}
        >
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="card p-5 sm:p-6 text-left shadow-[0_4px_24px_rgba(0,0,0,0.4)] group"
              >
                <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-subtle text-accent flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-accent-soft group-hover:scale-105 group-hover:shadow-[0_0_16px_rgba(59,130,246,0.15)]">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-caption font-semibold text-[var(--text-muted)] tracking-wide uppercase mb-0.5">Email</p>
                <p className="text-body-sm font-medium text-white truncate">syedabdullahzaidi786@gmail.com</p>
              </div>
              <button
                onClick={handleCopyEmail}
                className={`flex-shrink-0 px-4 py-2 rounded-lg border text-xs font-semibold transition-all ${
                  emailCopied
                    ? 'border-accent/40 text-accent bg-accent-subtle'
                    : 'border-white/[0.12] text-[var(--text-muted)] hover:text-white hover:border-white/25'
                }`}
              >
                {emailCopied ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    Copied
                  </span>
                ) : 'Copy Email'}
              </button>
            </div>
            </motion.div>

          <motion.a
            href="https://www.linkedin.com/in/syed-abdullah-zaidi-a281552b5"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="card block p-5 sm:p-6 text-left hover:no-underline group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-subtle text-accent flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-accent-soft group-hover:scale-105 group-hover:shadow-[0_0_16px_rgba(59,130,246,0.15)]">
                <Linkedin className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-caption font-semibold text-[var(--text-muted)] tracking-wide uppercase mb-0.5">LinkedIn</p>
                <p className="text-body-sm font-medium text-white truncate">linkedin.com/in/syedabdullahzaidi</p>
              </div>
              <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/[0.12] text-xs font-semibold text-white/50 group-hover:text-white group-hover:border-white/25 transition-all">
                Open
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.a>

          <motion.a
            href="https://github.com/syedabdullahzaidi786"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="card block p-5 sm:p-6 text-left hover:no-underline group shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-subtle text-accent flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-accent-soft group-hover:scale-105 group-hover:shadow-[0_0_16px_rgba(59,130,246,0.15)]">
                <Github className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-caption font-semibold text-[var(--text-muted)] tracking-wide uppercase mb-0.5">GitHub</p>
                <p className="text-body-sm font-medium text-white truncate">github.com/syedabdullahzaidi786</p>
              </div>
              <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/[0.12] text-xs font-semibold text-white/50 group-hover:text-white group-hover:border-white/25 transition-all">
                Open
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
}
