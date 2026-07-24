import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Tag, Calendar, Code2 } from 'lucide-react';

const siteUrl = 'https://syedabdullahzaidi.vercel.app';

/* ─── Types ─── */
type Project = {
  id: number;
  title: string;
  what: string;
  screenshot: string;
  tags: string[];
  links: { demo: string; github: string };
  createdAt: string;
};

/* ─── Data fetcher (runs on server) ─── */
async function getProject(id: string): Promise<Project | null> {
  try {
    const res = await fetch(`${siteUrl}/api/portfolio/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.project ?? null;
  } catch {
    return null;
  }
}

/* ─── Slug helper ─── */
function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/* ─── Dynamic metadata ─── */
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const project = await getProject(params.id);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: project.title,
    description: project.what || `View ${project.title} — a project by Syed Abdullah Zaidi.`,
    alternates: { canonical: `${siteUrl}/projects/${params.id}` },
    openGraph: {
      title: `${project.title} | Syed Abdullah Zaidi`,
      description: project.what || '',
      url: `${siteUrl}/projects/${params.id}`,
      images: project.screenshot ? [{ url: project.screenshot }] : [{ url: '/opengraph-image.png' }],
    },
  };
}

const Navbar = dynamic(() => import('@/components/ui/Navbar').then(m => ({ default: m.Navbar })));
const Footer = dynamic(() => import('@/components/ui/Footer').then(m => ({ default: m.Footer })));

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id);
  if (!project) notFound();

  const hasDemo   = project.links.demo && project.links.demo !== '#';
  const hasGithub = project.links.github && project.links.github !== '#';

  return (
    <main className="relative min-h-screen bg-[#000000]">
      <Navbar />

      {/* ambient bg */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/3 w-[500px] h-[400px] rounded-full blur-[120px] opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] rounded-full blur-[100px] opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #7F77DD, transparent)' }} />
      </div>

      <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6 md:px-8 pt-28 pb-24">

        {/* Back */}
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/40 hover:text-white transition-colors duration-200 mb-10 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to Projects
        </Link>

        {/* Hero image */}
        {project.screenshot && (
          <div className="relative w-full h-[260px] sm:h-[380px] md:h-[460px] rounded-2xl overflow-hidden border border-white/[0.08] mb-10">
            <Image
              src={project.screenshot}
              alt={project.title}
              fill
              priority
              unoptimized
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#000]/60 via-transparent to-transparent" />
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <span className="section-label mb-3 block">
            <Code2 className="w-3.5 h-3.5" />
            Project
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
            {project.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
            {project.createdAt && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {fmtDate(project.createdAt)}
              </span>
            )}
            {project.tags.length > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                {project.tags.length} technologies
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-blue-500/30 via-white/10 to-transparent mb-8 rounded-full" />

        {/* Description */}
        {project.what && (
          <div className="mb-10">
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-3">About this project</h2>
            <p className="text-base sm:text-lg text-white/75 leading-[1.8]">{project.what}</p>
          </div>
        )}

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-3">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold border"
                  style={{
                    background: 'rgba(59,130,246,0.08)',
                    borderColor: 'rgba(59,130,246,0.22)',
                    color: '#93c5fd',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA buttons */}
        {(hasDemo || hasGithub) && (
          <div className="flex flex-wrap gap-3 pt-2">
            {hasDemo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  boxShadow: '0 4px 24px rgba(59,130,246,0.3)',
                }}
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
            {hasGithub && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold border border-white/15 text-white/80 hover:text-white hover:border-white/30 hover:bg-white/[0.04] transition-all duration-200 hover:-translate-y-0.5"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub
              </a>
            )}
          </div>
        )}

        {/* Back bottom */}
        <div className="mt-16 pt-8 border-t border-white/[0.06]">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/40 hover:text-white transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back to all projects
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
