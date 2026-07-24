import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Calendar, Trophy, Award, Medal, Star } from 'lucide-react';

const siteUrl = 'https://syedabdullahzaidi.vercel.app';

/* ─── Types ─── */
type Achievement = {
  id: number;
  image: string | null;
  title: string;
  description: string | null;
  url: string | null;
  createdAt: string;
};

/* ─── Icon cycling ─── */
const ICONS = [Trophy, Award, Medal, Star];

/* ─── Data fetcher ─── */
async function getAchievement(id: string): Promise<Achievement | null> {
  try {
    const res = await fetch(`${siteUrl}/api/achievements/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.achievement ?? null;
  } catch {
    return null;
  }
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/* ─── Dynamic metadata ─── */
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const item = await getAchievement(params.id);
  if (!item) return { title: 'Achievement Not Found' };

  return {
    title: item.title,
    description: item.description || `View achievement: ${item.title} — by Syed Abdullah Zaidi.`,
    alternates: { canonical: `${siteUrl}/achievements/${params.id}` },
    openGraph: {
      title: `${item.title} | Syed Abdullah Zaidi`,
      description: item.description || '',
      url: `${siteUrl}/achievements/${params.id}`,
      images: item.image ? [{ url: item.image }] : [{ url: '/opengraph-image.png' }],
    },
  };
}

const Navbar  = dynamic(() => import('@/components/ui/Navbar').then(m => ({ default: m.Navbar })));
const Footer  = dynamic(() => import('@/components/ui/Footer').then(m => ({ default: m.Footer })));

export default async function AchievementDetailPage({ params }: { params: { id: string } }) {
  const item = await getAchievement(params.id);
  if (!item) notFound();

  const Icon = ICONS[(item.id - 1) % ICONS.length];

  return (
    <main className="relative min-h-screen bg-[#000000]">
      <Navbar />

      {/* ambient bg */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 right-1/3 w-[500px] h-[400px] rounded-full blur-[120px] opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #facc15, transparent)' }} />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[300px] rounded-full blur-[100px] opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
      </div>

      <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6 md:px-8 pt-28 pb-24">

        {/* Back */}
        <Link
          href="/#achievements"
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/40 hover:text-white transition-colors duration-200 mb-10 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to Achievements
        </Link>

        {/* Hero image or icon placeholder */}
        <div className="relative w-full h-[260px] sm:h-[380px] md:h-[440px] rounded-2xl overflow-hidden border border-white/[0.08] mb-10 bg-[#0a0a14]">
          {item.image ? (
            <>
              <Image
                src={item.image}
                alt={item.title}
                fill
                priority
                unoptimized
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000]/60 via-transparent to-transparent" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
              <div
                className="relative z-10 w-24 h-24 rounded-3xl flex items-center justify-center"
                style={{
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.25)',
                  boxShadow: '0 0 60px rgba(59,130,246,0.15)',
                }}
              >
                <Icon className="w-12 h-12 text-blue-400" />
              </div>
            </div>
          )}

          {/* badge overlay */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
            style={{
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.8)',
            }}>
            <Icon className="w-3.5 h-3.5 text-yellow-400" />
            Achievement
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <span className="section-label mb-3 block">
            <Trophy className="w-3.5 h-3.5" />
            Milestone
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
            {item.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
            {item.createdAt && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {fmtDate(item.createdAt)}
              </span>
            )}
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
              style={{
                background: 'rgba(250,204,21,0.1)',
                border: '1px solid rgba(250,204,21,0.2)',
                color: '#fde047',
              }}
            >
              <Icon className="w-3 h-3" />
              Earned
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-yellow-500/30 via-white/10 to-transparent mb-8 rounded-full" />

        {/* Description */}
        {item.description && (
          <div className="mb-10">
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-3">About this achievement</h2>
            <p className="text-base sm:text-lg text-white/75 leading-[1.8]">{item.description}</p>
          </div>
        )}

        {/* CTA */}
        {item.url && (
          <div className="pt-2">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                boxShadow: '0 4px 24px rgba(59,130,246,0.3)',
              }}
            >
              <ExternalLink className="w-4 h-4" />
              View Certificate / Proof
            </a>
          </div>
        )}

        {/* Back bottom */}
        <div className="mt-16 pt-8 border-t border-white/[0.06]">
          <Link
            href="/#achievements"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/40 hover:text-white transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back to all achievements
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
