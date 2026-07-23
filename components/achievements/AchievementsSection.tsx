'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Trophy, ExternalLink, Star, Award, Medal } from 'lucide-react';

type Achievement = {
  id: number;
  image: string | null;
  title: string;
  description: string | null;
  url: string | null;
  createdAt: string;
};

/* ─── Decorative icon cycling ─── */
const ICONS = [Trophy, Award, Medal, Star];

/* ─── Single card ─── */
function AchievementCard({ item, index }: { item: Achievement; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
  const [hovered, setHovered] = useState(false);
  const Icon = ICONS[index % ICONS.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300"
      style={{
        background: hovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
        borderColor: hovered ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)',
        boxShadow: hovered
          ? '0 0 0 1px rgba(59,130,246,0.15) inset, 0 20px 60px rgba(0,0,0,0.3)'
          : '0 2px 16px rgba(0,0,0,0.2)',
      }}
    >
      {/* accent top line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
        animate={{
          background: hovered
            ? 'linear-gradient(90deg, #3b82f6, #7F77DD, #3b82f6)'
            : 'linear-gradient(90deg, rgba(59,130,246,0.3), rgba(127,119,221,0.2))',
        }}
        transition={{ duration: 0.3 }}
      />

      {/* image / placeholder */}
      <div className="relative h-44 overflow-hidden bg-[#0a0a12] flex-shrink-0">
        {item.image ? (
          <>
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-[#0a0a12]/20 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {/* animated grid bg */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />
            <motion.div
              animate={{ rotate: hovered ? 15 : 0, scale: hovered ? 1.15 : 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: 'rgba(59,130,246,0.12)',
                border: '1px solid rgba(59,130,246,0.25)',
                boxShadow: hovered ? '0 0 30px rgba(59,130,246,0.2)' : 'none',
              }}
            >
              <Icon className="w-7 h-7 text-blue-400" />
            </motion.div>
          </div>
        )}

        {/* floating badge */}
        <div className="absolute top-3 left-3 z-10">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            <Icon className="w-3 h-3 text-blue-400" />
            Achievement
          </div>
        </div>
      </div>

      {/* body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-100 transition-colors duration-200">
          {item.title}
        </h3>

        {item.description && (
          <p className="text-xs text-white/50 leading-relaxed line-clamp-3">
            {item.description}
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <span className="text-[10px] text-white/25 font-mono">
            #{String(item.id).padStart(3, '0')}
          </span>
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'rgba(59,130,246,0.1)',
                border: '1px solid rgba(59,130,246,0.25)',
                color: '#93c5fd',
              }}
            >
              View
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span
              className="text-[10px] px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.25)',
              }}
            >
              Earned
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Skeleton loader ─── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden animate-pulse">
      <div className="h-44 bg-white/[0.04]" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-white/[0.06] rounded w-3/4" />
        <div className="h-3 bg-white/[0.04] rounded w-full" />
        <div className="h-3 bg-white/[0.04] rounded w-2/3" />
        <div className="pt-3 border-t border-white/[0.04] flex justify-between">
          <div className="h-3 w-8 bg-white/[0.04] rounded" />
          <div className="h-6 w-16 bg-white/[0.06] rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/* ─── Counter animation ─── */
function CountUp({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 30);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}</span>;
}

/* ─── Main section ─── */
export function AchievementsSection() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [warn, setWarn] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '0px 0px -40px 0px' });

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetch('/api/achievements')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.achievements)) setItems(d.achievements);
        else setWarn('Achievements data unavailable.');
      })
      .catch(() => setWarn('Could not load achievements.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="achievements"
      className="relative py-20 md:py-28 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24 overflow-hidden border-t border-white/[0.04] scroll-mt-20"
    >
      {/* ambient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-20 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #facc15, transparent)' }}
        />
        <div
          className="absolute bottom-10 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }}
        />
      </div>

      {/* subtle dot-grid bg */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* header */}
        <div ref={headerRef} className="mb-12 md:mb-16">
          <motion.span
            className="section-label"
            initial={{ opacity: 0, x: -16 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.3 }}
          >
            Achievements
          </motion.span>

          <motion.h2
            className="section-title mt-3"
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35, delay: 0.08 }}
          >
            Milestones &amp; Recognition
          </motion.h2>

          <motion.p
            className="section-desc mt-3"
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35, delay: 0.14 }}
          >
            Certifications, awards, hackathon wins, and milestones I&apos;ve earned along the way.
          </motion.p>

          {/* stats row */}
          {!loading && items.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-6 mt-8"
              initial={{ opacity: 0, y: 12 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35, delay: 0.22 }}
            >
              {[
                { label: 'Total', value: items.length, icon: Trophy },
                { label: 'Linked', value: items.filter(i => i.url).length, icon: ExternalLink },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <Icon className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="text-lg font-black text-white leading-none">
                      <CountUp target={value} />
                    </p>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {warn && (
          <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            {warn}
          </div>
        )}

        {/* loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* empty state */}
        {!loading && items.length === 0 && !warn && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
            >
              <Trophy className="w-7 h-7 text-blue-400/50" />
            </div>
            <p className="text-sm text-white/40">No achievements added yet.</p>
          </motion.div>
        )}

        {/* grid */}
        {!loading && items.length > 0 && (
          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((item, i) => (
                <AchievementCard key={item.id} item={item} index={i} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
