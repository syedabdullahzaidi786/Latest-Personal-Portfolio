import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

function getPool() {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) throw new Error('DATABASE_URL is not configured');
  return new Pool({ connectionString });
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const pool = getPool();
  try {
    const id = Number(params.id);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const { rows } = await pool.query(
      'SELECT id, "projectImage", title, tags, description, "liveUrl", "createdAt" FROM "Project" WHERE id = $1',
      [id]
    );
    if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const p = rows[0];
    return NextResponse.json({
      project: {
        id:         p.id,
        title:      p.title,
        what:       p.description ?? '',
        screenshot: p.projectImage ?? '',
        tags:       Array.isArray(p.tags) ? p.tags : [],
        links:      { demo: p.liveUrl ?? '#', github: '#' },
        createdAt:  p.createdAt,
      },
    });
  } catch (error: any) {
    console.error('[portfolio/[id] GET]', error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  } finally {
    await pool.end();
  }
}
