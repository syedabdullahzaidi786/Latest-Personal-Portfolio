'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, ExternalLink, Search, X, Calendar, ArrowUpRight } from 'lucide-react';

type Blog = {
  id: number;
  image: string | null;
  title: string;
  description: string | null;
  url: string | null;
  createdAt: string;
};

/* ─── format date ─── */
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/* ─── Featured hero card (first item) ─── */
function FeaturedCard({ item }: { item: Blog }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-2xl border transition-all duration-300 col-span-full"
      style={{
        background: hovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
        borderColor: hovered ? 'rgba(59,130,246,0.45)' : 'rgba(255,255,255,0.08)',
        boxShadow: hovered ? '0 0 60px rgba(59,130,246,0.12), 0 0 0 1px rgba(59,130,246,0.1) inset' : 'none',
      }}
    >
      <div className="flex flex-col md:flex-row">
        {/* image */}
        <div className="relative w-full md:w-[45%] h-56 md:h-72 flex-shrink-0 overflow-hidden bg-[#0a0a14]">
          {item.image ? (
            <>
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a14] hidden md:block" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a14] md:hidden" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                }}
              />
              <motion.div
                animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 5 : 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.2)',
                  boxShadow: hovered ? '0 0 40px rgba(59,130,246,0.2)' : 'none',
                }}
              >
                <BookOpen className="w-9 h-9 text-blue-400/60" />
              </motion.div>
            </div>
          )}
          {/* featured badge */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{ background: 'rgba(59,130,246,0.9)', color: '#fff', boxShadow: '0 0 16px rgba(59,130,246,0.4)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Featured
          </div>
        </div>

        {/* content */}
        <div className="flex flex-col justify-center p-6 md:p-8 flex-1 gap-4">
          <div className="flex items-center gap-2 text-[11px] text-white/40">
            <Calendar className="w-3 h-3" />
            {fmtDate(item.createdAt)}
          </div>

          <h2 className="text-xl md:text-2xl font-black text-white leading-snug">
            {item.title}
          </h2>

          {item.description && (
            <p className="text-sm text-white/55 leading-relaxed line-clamp-3">
              {item.description}
            </p>
          )}

          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(59,130,246,0.3)',
              }}
            >
              Read Article
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Regular card ─── */
function BlogCard({ item, index }: { item: Blog; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -50px 0px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 h-full"
      style={{
        background: hovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
        borderColor: hovered ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)',
        boxShadow: hovered ? '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(59,130,246,0.08) inset' : 'none',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      {/* top accent line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl origin-left"
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ background: 'linear-gradient(90deg, #3b82f6, #7F77DD)' }}
      />

      {/* image */}
      <div className="relative h-44 flex-shrink-0 overflow-hidden bg-[#0a0a14]">
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
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-[#0a0a14]/30 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
            <motion.div
              animate={{ scale: hovered ? 1.12 : 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(59,130,246,0.1)',
                border: '1px solid rgba(59,130,246,0.2)',
              }}
            >
              <BookOpen className="w-5 h-5 text-blue-400/60" />
            </motion.div>
          </div>
        )}
      </div>

      {/* body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-center gap-1.5 text-[10px] text-white/35">
          <Calendar className="w-3 h-3" />
          {fmtDate(item.createdAt)}
        </div>

        <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-100 transition-colors duration-200">
          {item.title}
        </h3>

        {item.description && (
          <p className="text-xs text-white/45 leading-relaxed line-clamp-3 flex-1">
            {item.description}
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-white/[0.06]">
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200 group/link"
            >
              Read more
              <ExternalLink className="w-3 h-3 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </a>
          ) : (
            <span className="text-[10px] text-white/20">No link available</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Skeleton ─── */
function SkeletonCard({ featured = false }: { featured?: boolean }) {
  if (featured) {
    return (
      <div className="col-span-full rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden animate-pulse flex flex-col md:flex-row">
        <div className="w-full md:w-[45%] h-56 md:h-72 bg-white/[0.04]" />
        <div className="flex-1 p-8 space-y-4">
          <div className="h-3 w-24 bg-white/[0.04] rounded" />
          <div className="h-7 w-3/4 bg-white/[0.07] rounded" />
          <div className="space-y-2">
            <div className="h-3 bg-white/[0.04] rounded w-full" />
            <div className="h-3 bg-white/[0.04] rounded w-5/6" />
          </div>
          <div className="h-9 w-28 bg-white/[0.06] rounded-xl" />
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden animate-pulse">
      <div className="h-44 bg-white/[0.04]" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 bg-white/[0.04] rounded" />
        <div className="h-4 bg-white/[0.07] rounded w-3/4" />
        <div className="space-y-1.5">
          <div className="h-3 bg-white/[0.04] rounded w-full" />
          <div className="h-3 bg-white/[0.04] rounded w-4/5" />
        </div>
        <div className="pt-3 border-t border-white/[0.04]">
          <div className="h-3 w-16 bg-white/[0.06] rounded" />
        </div>
      </div>
    </div>
  );
}

/* ─── Main client component ─── */
export function BlogsClient() {
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [warn, setWarn] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const fetchedRef = useRef(false);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetch('/api/blogs')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.blogs)) setAllBlogs(d.blogs);
        else setWarn('Blog data unavailable.');
      })
      .catch(() => setWarn('Could not load blogs.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = query.trim()
    ? allBlogs.filter(
        (b) =>
          b.title.toLowerCase().includes(query.toLowerCase()) ||
          b.description?.toLowerCase().includes(query.toLowerCase())
      )
    : allBlogs;

  const featured = filtered[0] ?? null;
  const rest = filtered.slice(1);

  return (
    <div className="min-h-[80vh] pt-28 pb-24 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24">
      {/* ambient bg */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/3 w-[600px] h-[400px] rounded-full blur-[120px] opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #7F77DD, transparent)' }} />
      </div>

      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* back link */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/40 hover:text-white transition-colors duration-200 mb-10 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back to Portfolio
          </Link>
        </motion.div>

        {/* header */}
        <div ref={headerRef} className="mb-12">
          <motion.span
            className="section-label"
            initial={{ opacity: 0, x: -16 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.3 }}
          >
            Writing
          </motion.span>
          <motion.h1
            className="section-title mt-3"
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35, delay: 0.07 }}
          >
            Blog &amp; Articles
          </motion.h1>
          <motion.p
            className="section-desc mt-3"
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35, delay: 0.13 }}
          >
            Thoughts on AI, fullstack engineering, and building things that matter.
          </motion.p>

          {/* search + count row */}
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-8"
            initial={{ opacity: 0, y: 12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35, delay: 0.2 }}
          >
            {/* search */}
            <div
              className="relative flex-1 max-w-sm"
            >
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
              <input
                type="text"
                placeholder="Search articles…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all duration-200 focus:ring-1"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  // @ts-ignore
                  '--tw-ring-color': 'rgba(59,130,246,0.4)',
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* count badge */}
            {!loading && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white/40"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <BookOpen className="w-3.5 h-3.5" />
                <span>
                  {filtered.length === allBlogs.length
                    ? `${allBlogs.length} article${allBlogs.length !== 1 ? 's' : ''}`
                    : `${filtered.length} of ${allBlogs.length}`}
                </span>
              </div>
            )}
          </motion.div>
        </div>

        {warn && (
          <div className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            {warn}
          </div>
        )}

        {/* loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <SkeletonCard featured />
            {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* no results */}
        {!loading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-28 text-center"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <BookOpen className="w-7 h-7 text-blue-400/40" />
            </div>
            <p className="text-sm text-white/40">
              {query ? `No articles matching "${query}"` : 'No articles published yet.'}
            </p>
            {query && (
              <button onClick={() => setQuery('')}
                className="mt-3 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                Clear search
              </button>
            )}
          </motion.div>
        )}

        {/* content */}
        {!loading && filtered.length > 0 && (
          <AnimatePresence mode="wait">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* featured */}
              {featured && <FeaturedCard item={featured} />}
              {/* rest */}
              {rest.map((blog, i) => (
                <BlogCard key={blog.id} item={blog} index={i} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
