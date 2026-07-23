'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { type PortfolioTechGroup } from '@/lib/portfolio-data';

/* ─── hex → rgb helper ─── */
function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
    : { r: 127, g: 119, b: 221 };
}

/* ─── Single tech pill ─── */
function TechPill({
  name,
  color,
  delay,
}: {
  name: string;
  color: string;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  const rgb = hexToRgb(color);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={
        hovered
          ? {
              background: `rgba(${rgb.r},${rgb.g},${rgb.b},0.18)`,
              borderColor: `rgba(${rgb.r},${rgb.g},${rgb.b},0.7)`,
              color: `rgb(${Math.min(255, rgb.r + 60)},${Math.min(255, rgb.g + 60)},${Math.min(255, rgb.b + 60)})`,
              boxShadow: `0 0 16px rgba(${rgb.r},${rgb.g},${rgb.b},0.35), inset 0 0 12px rgba(${rgb.r},${rgb.g},${rgb.b},0.08)`,
            }
          : {
              background: `rgba(${rgb.r},${rgb.g},${rgb.b},0.07)`,
              borderColor: `rgba(${rgb.r},${rgb.g},${rgb.b},0.25)`,
              color: `rgba(255,255,255,0.75)`,
              boxShadow: 'none',
            }
      }
      className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-default select-none transition-all duration-200 overflow-hidden"
    >
      {/* shimmer on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            key="shimmer"
            initial={{ x: '-110%', skewX: -18 }}
            animate={{ x: '110%', skewX: -18 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeInOut' }}
            className="pointer-events-none absolute inset-0 w-1/3 h-full"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(${rgb.r},${rgb.g},${rgb.b},0.25), transparent)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* dot */}
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-200"
        style={{
          background: hovered
            ? `rgb(${Math.min(255, rgb.r + 80)},${Math.min(255, rgb.g + 80)},${Math.min(255, rgb.b + 80)})`
            : color,
          boxShadow: hovered ? `0 0 6px ${color}` : 'none',
        }}
      />
      {name}
    </motion.div>
  );
}

/* ─── Category card ─── */
function CategoryCard({
  group,
  index,
}: {
  group: PortfolioTechGroup;
  index: number;
}) {
  const rgb = hexToRgb(group.color);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
  const [cardHovered, setCardHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setCardHovered(true)}
      onMouseLeave={() => setCardHovered(false)}
      className="relative rounded-2xl border p-5 overflow-hidden transition-all duration-300"
      style={{
        background: cardHovered
          ? `rgba(${rgb.r},${rgb.g},${rgb.b},0.06)`
          : 'rgba(255,255,255,0.02)',
        borderColor: cardHovered
          ? `rgba(${rgb.r},${rgb.g},${rgb.b},0.4)`
          : 'rgba(255,255,255,0.07)',
        boxShadow: cardHovered
          ? `0 0 32px rgba(${rgb.r},${rgb.g},${rgb.b},0.12), 0 0 0 1px rgba(${rgb.r},${rgb.g},${rgb.b},0.15) inset`
          : 'none',
      }}
    >
      {/* top-left ambient glow blob */}
      <div
        className="pointer-events-none absolute -top-8 -left-8 w-32 h-32 rounded-full blur-2xl transition-opacity duration-300"
        style={{
          background: `rgba(${rgb.r},${rgb.g},${rgb.b},0.15)`,
          opacity: cardHovered ? 1 : 0.4,
        }}
      />

      {/* header */}
      <div className="relative flex items-center gap-3 mb-4">
        {/* color accent bar */}
        <motion.div
          className="w-1 rounded-full shrink-0"
          animate={{ height: cardHovered ? 36 : 28 }}
          transition={{ duration: 0.25 }}
          style={{ background: `linear-gradient(to bottom, ${group.color}, rgba(${rgb.r},${rgb.g},${rgb.b},0.3))` }}
        />

        <div>
          <p
            className="text-[10px] font-bold tracking-[0.22em] uppercase mb-0.5"
            style={{ color: `rgba(${rgb.r},${rgb.g},${rgb.b},0.8)` }}
          >
            Category
          </p>
          <h3 className="text-sm font-bold text-white leading-none">{group.name}</h3>
        </div>

        {/* count badge */}
        <div
          className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border"
          style={{
            color: group.color,
            borderColor: `rgba(${rgb.r},${rgb.g},${rgb.b},0.3)`,
            background: `rgba(${rgb.r},${rgb.g},${rgb.b},0.1)`,
          }}
        >
          {group.techs.length}
        </div>
      </div>

      {/* divider */}
      <div
        className="h-px mb-4 rounded-full"
        style={{
          background: `linear-gradient(to right, rgba(${rgb.r},${rgb.g},${rgb.b},0.4), transparent)`,
        }}
      />

      {/* pills */}
      {inView && (
        <div className="flex flex-wrap gap-2">
          {group.techs.map((tech, ti) => (
            <TechPill
              key={tech}
              name={tech}
              color={group.color}
              delay={index * 0.07 + ti * 0.04 + 0.15}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ─── Floating particle background ─── */
function Particles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `rgba(${Math.floor(Math.random() * 100 + 100)},${Math.floor(Math.random() * 100 + 100)},${Math.floor(Math.random() * 200 + 50)},0.4)`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            delay: Math.random() * 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Main section ─── */
export function TechStackSection() {
  const [groups, setGroups] = useState<PortfolioTechGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [warn, setWarn] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '0px 0px -40px 0px' });

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetch('/api/portfolio')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.techStack) && d.techStack.length > 0) {
          setGroups(d.techStack);
        } else {
          setWarn('Tech stack data unavailable.');
        }
      })
      .catch(() => setWarn('Could not load tech stack.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="tech-stack"
      className="relative py-20 md:py-28 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24 overflow-hidden border-t border-white/[0.04] scroll-mt-20"
    >
      {/* background particles */}
      <Particles />

      {/* ambient gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #7F77DD, transparent)' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #1D9E75, transparent)' }} />
      </div>

      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* Header */}
        <div ref={headerRef} className="mb-12 md:mb-16">
          <motion.span
            className="section-label"
            initial={{ opacity: 0, x: -16 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.3 }}
          >
            Skills
          </motion.span>

          <motion.h2
            className="section-title mt-3"
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35, delay: 0.08 }}
          >
            My tech stack
          </motion.h2>

          <motion.p
            className="section-desc mt-3"
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35, delay: 0.14 }}
          >
            Technologies I use to build fast, scalable, and polished products.
          </motion.p>
        </div>

        {/* Warning */}
        {warn && (
          <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            {warn}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 animate-pulse"
              >
                <div className="h-4 w-24 bg-white/10 rounded mb-4" />
                <div className="h-px bg-white/[0.06] mb-4 rounded" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-7 w-16 bg-white/[0.06] rounded-lg" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cards grid */}
        {!loading && groups.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group, i) => (
              <CategoryCard key={group.name + i} group={group} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
