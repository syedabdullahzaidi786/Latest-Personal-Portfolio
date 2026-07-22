import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';
import { getCurrentSession } from '@/lib/auth';

const techColors = ['#7F77DD', '#1D9E75', '#378ADD', '#BA7517', '#D85A30', '#639922', '#D4537E', '#888780'];
const accentColors = ['magenta', 'teal', 'purple'] as const;

function getPool() {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) throw new Error('DATABASE_URL is not configured');
  return new Pool({ connectionString });
}

export async function GET() {
  const pool = getPool();
  try {
    const [projectsResult, techResult] = await Promise.all([
      pool.query('SELECT id, "projectImage", title, tags, description, "liveUrl" FROM "Project" ORDER BY id ASC'),
      pool.query('SELECT id, title, stacks FROM "TechStackGroup" ORDER BY id ASC'),
    ]);

    const projects = projectsResult.rows.map((p, i) => ({
      id: p.id,
      category: 'Fullstack',
      icon: 'Sparkles',
      title: p.title,
      badge: '',
      what: p.description ?? '',
      screenshot: p.projectImage ?? '',
      links: { demo: p.liveUrl ?? '#', github: '#' },
      tags: Array.isArray(p.tags) ? p.tags : [],
      accent: accentColors[i % accentColors.length],
    }));

    const techStack = techResult.rows.map((g, i) => ({
      id: g.id,
      name: g.title,
      color: techColors[i % techColors.length],
      techs: Array.isArray(g.stacks) ? g.stacks : [],
    }));

    return NextResponse.json({ projects, techStack, source: 'database' });
  } catch (error: any) {
    console.error('[portfolio GET]', error);
    return NextResponse.json(
      { projects: [], techStack: [], source: 'fallback', error: error?.message },
      { status: 200 }
    );
  } finally {
    await pool.end();
  }
}

export async function POST(request: Request) {
  const pool = getPool();
  try {
    const session = await getCurrentSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    if (body.type === 'project') {
      const { title, description, projectImage, liveUrl, tags } = body;
      if (!title?.trim()) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

      const tagsArray = Array.isArray(tags) ? tags : [];
      const { rows } = await pool.query(
        `INSERT INTO "Project" ("projectImage", title, tags, description, "liveUrl", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *`,
        [projectImage || null, title.trim(), tagsArray, description || null, liveUrl || null]
      );
      return NextResponse.json({ project: rows[0] }, { status: 201 });
    }

    if (body.type === 'techStack') {
      const { title, stacks } = body;
      if (!title?.trim()) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

      const stacksArray = Array.isArray(stacks) ? stacks : [];
      const { rows } = await pool.query(
        `INSERT INTO "TechStackGroup" (title, stacks, "createdAt", "updatedAt")
         VALUES ($1, $2, NOW(), NOW()) RETURNING *`,
        [title.trim(), stacksArray]
      );
      return NextResponse.json({ group: rows[0] }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid type. Use "project" or "techStack".' }, { status: 400 });
  } catch (error: any) {
    console.error('[portfolio POST]', error);
    return NextResponse.json({ error: error?.message || 'Failed to create record' }, { status: 500 });
  } finally {
    await pool.end();
  }
}

export async function PUT(request: Request) {
  const pool = getPool();
  try {
    const session = await getCurrentSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { type, id, title, description, projectImage, liveUrl, tags, stacks } = body;

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    if (!title?.trim()) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    if (type === 'project') {
      const tagsArray = Array.isArray(tags) ? tags : [];
      const { rows } = await pool.query(
        `UPDATE "Project"
         SET "projectImage"=$1, title=$2, tags=$3, description=$4, "liveUrl"=$5, "updatedAt"=NOW()
         WHERE id=$6 RETURNING *`,
        [projectImage ?? null, title.trim(), tagsArray, description ?? null, liveUrl ?? null, Number(id)]
      );
      if (rows.length === 0) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      return NextResponse.json({ project: rows[0] });
    }

    if (type === 'techStack') {
      const stacksArray = Array.isArray(stacks) ? stacks : [];
      const { rows } = await pool.query(
        `UPDATE "TechStackGroup"
         SET title=$1, stacks=$2, "updatedAt"=NOW()
         WHERE id=$3 RETURNING *`,
        [title.trim(), stacksArray, Number(id)]
      );
      if (rows.length === 0) return NextResponse.json({ error: 'Tech group not found' }, { status: 404 });
      return NextResponse.json({ group: rows[0] });
    }

    return NextResponse.json({ error: 'Invalid type. Use "project" or "techStack".' }, { status: 400 });
  } catch (error: any) {
    console.error('[portfolio PUT]', error);
    return NextResponse.json({ error: error?.message || 'Failed to update record' }, { status: 500 });
  } finally {
    await pool.end();
  }
}

export async function DELETE(request: Request) {
  const pool = getPool();
  try {
    const session = await getCurrentSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({ error: 'type and id query params are required' }, { status: 400 });
    }

    if (type === 'project') {
      const { rowCount } = await pool.query('DELETE FROM "Project" WHERE id=$1', [Number(id)]);
      if (rowCount === 0) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      return NextResponse.json({ success: true });
    }

    if (type === 'techStack') {
      const { rowCount } = await pool.query('DELETE FROM "TechStackGroup" WHERE id=$1', [Number(id)]);
      if (rowCount === 0) return NextResponse.json({ error: 'Tech group not found' }, { status: 404 });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid type. Use "project" or "techStack".' }, { status: 400 });
  } catch (error: any) {
    console.error('[portfolio DELETE]', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete record' }, { status: 500 });
  } finally {
    await pool.end();
  }
}
