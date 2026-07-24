'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Sparkles, ArrowUpRight, Bot, Code } from 'lucide-react';
import { blurPlaceholders } from '@/lib/blur-placeholders';
import { type PortfolioProject } from '@/lib/portfolio-data';

function ProjectCard({ project, index }: { project: PortfolioProject; index: number }) {
  const isSvg = project.screenshot.endsWith('.svg');
  const projectDir = project.screenshot.match(/\/projects\/([^/]+)\//)?.[1];
  const blurUrl = projectDir && !isSvg ? blurPlaceholders[projectDir] : undefined;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '200px 0px' }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, delay: index * 0.02, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative flex flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-surface-overlay shadow-[0_2px_4px_rgba(0,0,0,0.4),0_8px_32px_rgba(59,130,246,0.08),0_8px_32px_rgba(0,0,0,0.12)] transition-[transform,border-color,box-shadow] duration-500 ease-out hover:-translate-y-1.5 hover:border-accent/60 hover:shadow-[0_4px_12px_rgba(0,0,0,0.4),0_20px_56px_rgba(59,130,246,0.2),0_20px_56px_rgba(0,0,0,0.18),inset_0_0_0_1px_rgba(59,130,246,0.08)] h-full group will-change-transform"
    >
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent/50 via-accent/25 to-accent/5 transition-all duration-500 ease-out group-hover:w-[4px] group-hover:from-accent group-hover:via-accent/50 group-hover:to-accent/10 group-hover:shadow-[2px_0_12px_rgba(59,130,246,0.15)]" />

      {/* Clickable image area → detail page */}
      <Link href={`/projects/${project.id}`} className="block relative">
        <div className="relative h-[240px] sm:h-[280px] overflow-hidden bg-surface-base flex-shrink-0">
          {project.screenshot ? (
            <>
              <Image
                src={project.screenshot}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                placeholder={isSvg ? 'empty' : 'blur'}
                blurDataURL={blurUrl}
                priority={index < 3}
                className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface-overlay" />
            </>
          ) : (
            <div className="w-full h-full bg-accent-subtle flex items-center justify-center">
              <Bot className="w-8 h-8 text-accent/30" />
            </div>
          )}
          {/* View details overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white"
              style={{ background: 'rgba(59,130,246,0.85)', backdropFilter: 'blur(8px)' }}>
              View Details <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </Link>

      <div className="relative z-10 p-5 sm:p-6 flex flex-col flex-1 gap-3">
        <div>
          <Link href={`/projects/${project.id}`} className="group/title">
            <h3 className="text-[16px] font-bold text-white leading-snug group-hover/title:text-accent transition-colors duration-200">
              {project.title}
            </h3>
          </Link>
          {project.badge && (
            <span className="text-[11px] text-[var(--text-muted)] tracking-wide bg-white/[0.04] px-2 py-0.5 rounded-full">{project.badge}</span>
          )}
        </div>

        <p className="text-[15px] text-[var(--text-body)] leading-relaxed">
          {project.what}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[12px] text-[var(--text-muted)] border border-white/[0.1] bg-white/[0.06] px-2.5 py-1 rounded-md transition-colors duration-200 cursor-default hover:text-accent hover:border-accent/40 hover:bg-accent/10"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {/* View Details slug link */}
          <Link
            href={`/projects/${project.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-semibold rounded-lg border border-white/[0.1] text-[var(--text-body)] hover:text-white hover:border-accent/50 hover:bg-accent/[0.06] hover:-translate-y-0.5 transition-all duration-300 min-h-[44px]"
          >
            <ArrowUpRight className="w-3 h-3" />
            View Details
          </Link>
          {project.links.demo && project.links.demo !== '#' && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.demoLabel || 'Live Demo'} (opens in new tab)`}
              className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-semibold rounded-lg bg-accent/90 backdrop-blur-sm text-white shadow-[0_4px_20px_rgba(59,130,246,0.2)] transition-all duration-300 hover:bg-accent hover:shadow-[0_8px_32px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 active:scale-95 min-h-[44px] group"
            >
              <ExternalLink className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              {project.demoLabel || 'Live Demo'}
            </a>
          )}
          {project.links.github && project.links.github !== '#' && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub (opens in new tab)"
              className="inline-flex items-center gap-1 px-4 py-3 text-xs font-semibold rounded-lg border border-white/[0.1] text-[var(--text-body)] hover:text-accent hover:border-accent/50 hover:bg-accent/[0.04] hover:-translate-y-0.5 transition-all duration-300 min-h-[44px]"
            >
              <Github className="w-3 h-3" />
              GitHub
            </a>
          )}
          {project.architectureSvg && (
            <a
              href={project.architectureSvg}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View architecture diagram (opens in new tab)"
              className="inline-flex items-center gap-1 px-4 py-3 text-xs font-semibold rounded-lg border border-white/[0.1] text-[var(--text-body)] hover:text-accent hover:border-accent/50 hover:bg-accent/[0.04] hover:-translate-y-0.5 transition-all duration-300 min-h-[44px]"
            >
              <Code className="w-3 h-3" />
              Architecture
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-12 h-12 rounded-xl bg-accent-subtle flex items-center justify-center mb-4">
        <Sparkles className="w-5 h-5 text-accent/50" />
      </div>
      <p className="text-body text-[var(--text-body)]">No projects in this category yet.</p>
      <p className="text-body-sm text-[var(--text-muted)] mt-1">Check back soon.</p>
    </motion.div>
  );
}

export function WorkSection() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [dbWarning, setDbWarning] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.projects)) {
          setProjects(data.projects);
          setDbWarning(null);
        } else {
          setProjects([]);
          setDbWarning('Database content is unavailable.');
        }
      })
      .catch(() => {
        setProjects([]);
        setDbWarning('Database content is unavailable.');
      });
  }, []);

  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  useEffect(() => {
    setShowAll(false);
  }, [activeFilter]);

  const initialCount = activeFilter === 'All' ? 9 : 6;
  const visibleProjects = showAll ? filteredProjects : filteredProjects.slice(0, initialCount);
  const hasMore = filteredProjects.length > initialCount;
  const hiddenCount = hasMore ? filteredProjects.length - initialCount : 0;

  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} id="work" className="section-alt-strong relative py-20 md:py-28 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24 overflow-hidden scroll-mt-20">
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#08080c] z-20 pointer-events-none" />

      <div className="max-w-content-wide mx-auto relative z-10">
        <motion.div
          className="mb-10 md:mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '300px 0px' }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.2, staggerChildren: 0.03 } },
          }}
        >
          <motion.span
            className="section-label"
            variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0, transition: { duration: 0.2 } } }}
          >
            Selected Work
          </motion.span>
          <motion.h2
            className="section-title mt-3"
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.2 } } }}
          >
            Projects that Define My Craft
          </motion.h2>
          <motion.p
            className="section-desc mt-3"
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.2 } } }}
          >
            From hackathon projects to production deployments — each project solves a real problem end to end.
          </motion.p>
        </motion.div>

        {dbWarning && (
          <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            {dbWarning}
          </div>
        )}

        <motion.div
          className="flex flex-wrap gap-x-6 gap-y-2 mb-8 md:mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '250px 0px' }}
          transition={{ delay: 0.05, duration: 0.2 }}
        >
          {['All', ...Array.from(new Set(projects.map((project) => project.category)))].map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              whileTap={{ scale: 0.97 }}
              className={`filter-tab ${activeFilter === cat ? 'active' : ''}`}
            >
              {cat === 'All' ? (
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  All
                </span>
              ) : (
                cat
              )}
            </motion.button>
          ))}
        </motion.div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.length === 0 ? (
            <EmptyState />
          ) : (
            <AnimatePresence mode="popLayout">
              {visibleProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        {filteredProjects.length > 0 && hasMore && !showAll && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-10"
          >
            <motion.button
              onClick={() => setShowAll(true)}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-3 px-7 py-4 rounded-xl border border-white/[0.1] bg-surface-overlay text-sm font-semibold text-[var(--text-body)] hover:text-white hover:border-accent/40 hover:bg-accent/[0.06] hover:shadow-[0_8px_32px_rgba(59,130,246,0.12)] transition-all duration-300 ease-out"
            >
              <Sparkles className="w-4 h-4 text-accent/60 transition-all duration-300 ease-out group-hover:text-accent group-hover:scale-110 group-hover:rotate-12" />
              Show All Projects
              <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-white/[0.04] text-[11px] font-bold text-[var(--text-muted)] group-hover:bg-accent/[0.12] group-hover:text-accent transition-colors duration-300">
                +{hiddenCount}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-muted)] transition-all duration-300 ease-out group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-110" />
            </motion.button>
          </motion.div>
        )}

        {filteredProjects.length > 0 && hasMore && showAll && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-10"
          >
            <motion.button
              onClick={() => setShowAll(false)}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-white/[0.08] bg-surface-overlay text-sm font-semibold text-[var(--text-body)] hover:text-accent hover:border-accent/30 hover:bg-accent/[0.06] transition-all duration-300 ease-out"
            >
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 ease-out group-hover:rotate-[135deg]" />
              Show Less
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
