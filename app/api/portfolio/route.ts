import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma/client';
import type { PortfolioContent, PortfolioProject, PortfolioTechGroup } from '@/lib/portfolio-data';

const globalForPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient };

function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({} as any);
  }

  return globalForPrisma.prisma;
}

const techColors = ['#7F77DD', '#1D9E75', '#378ADD', '#BA7517', '#D85A30', '#639922', '#D4537E', '#888780'];

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    if (error.message.includes('DATABASE_URL')) {
      return error.message;
    }
    if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      return 'Unable to connect to Neon. Check DATABASE_URL and network access.';
    }
    return error.message;
  }

  return 'Unknown database error.';
}

function buildResponse(payload: PortfolioContent, source: 'database' | 'fallback', warning?: string, error?: string) {
  return {
    ...payload,
    source,
    ...(warning ? { warning } : {}),
    ...(error ? { error } : {}),
  };
}

function toProjectRecord(project: PortfolioProject, index: number) {
  return {
    id: project.id,
    projectImage: project.screenshot,
    title: project.title,
    tags: project.tags,
    description: project.what,
    liveUrl: project.links?.demo ?? null,
  };
}

function toTechGroupRecord(group: PortfolioTechGroup, index: number) {
  return {
    title: group.name,
    stacks: group.techs,
  };
}

function toPortfolioProject(project: { id: number; title: string; description: string | null; projectImage: string | null; liveUrl: string | null; tags: string[] }, index: number): PortfolioProject {
  return {
    id: project.id,
    category: 'Fullstack',
    icon: 'Sparkles',
    title: project.title,
    badge: '',
    what: project.description ?? 'Project details will appear here.',
    screenshot: project.projectImage ?? '/projects/default/screenshot.webp',
    links: { demo: project.liveUrl ?? '#', github: '#' },
    tags: project.tags ?? [],
    accent: ['magenta', 'teal', 'purple'][index % 3] as PortfolioProject['accent'],
  };
}

function toPortfolioTechGroup(group: { id: number; title: string; stacks: string[] }, index: number): PortfolioTechGroup {
  return {
    name: group.title,
    color: techColors[index % techColors.length],
    techs: group.stacks ?? [],
  };
}

export async function GET() {
  try {
    const prisma = getPrismaClient();
    const [projects, techStack] = await Promise.all([
      prisma.project.findMany({ orderBy: { id: 'asc' } }),
      prisma.techStackGroup.findMany({ orderBy: { id: 'asc' } }),
    ]);

    const portfolioProjects = projects.length > 0
      ? projects.map((project, index) => toPortfolioProject(project as any, index))
      : [];

    const portfolioTechStack = techStack.length > 0
      ? techStack.map((group, index) => toPortfolioTechGroup(group as any, index))
      : [];

    const warning = portfolioProjects.length === 0 && portfolioTechStack.length === 0
      ? 'No database content available yet.'
      : undefined;

    return NextResponse.json(buildResponse({ projects: portfolioProjects, techStack: portfolioTechStack }, 'database', warning));
  } catch (error) {
    console.error('portfolio api error', error);
    return NextResponse.json(
      buildResponse({ projects: [], techStack: [] }, 'fallback', 'Database unavailable.', getErrorMessage(error)),
      { status: 503 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = request.headers.get('authorization');
    const expected = process.env.ADMIN_TOKEN;
    if (!expected || auth !== `Bearer ${expected}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getPrismaClient();
    const body = (await request.json()) as Partial<PortfolioContent>;
    const projects = Array.isArray(body?.projects) ? body.projects : [];
    const techStack = Array.isArray(body?.techStack) ? body.techStack : [];

    await prisma.$transaction(async (tx) => {
      await tx.project.deleteMany();
      await tx.techStackGroup.deleteMany();

      if (projects.length > 0) {
        await tx.project.createMany({
          data: projects.map((project) => ({
            projectImage: project.screenshot ?? null,
            title: project.title ?? 'Untitled project',
            tags: project.tags ?? [],
            description: project.what ?? null,
            liveUrl: project.links?.demo ?? null,
          })),
        });
      }

      if (techStack.length > 0) {
        await tx.techStackGroup.createMany({
          data: techStack.map((group) => ({
            title: group.name ?? 'Untitled group',
            stacks: group.techs ?? [],
          })),
        });
      }
    });

    return NextResponse.json({ ok: true, source: 'database' });
  } catch (error) {
    console.error('portfolio update error', error);
    return NextResponse.json({ error: 'Failed to save content.', details: getErrorMessage(error) }, { status: 503 });
  }
}
