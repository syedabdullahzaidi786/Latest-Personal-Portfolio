import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';
import { getCurrentSession } from '@/lib/auth';

function getPool() {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) throw new Error('DATABASE_URL is not configured');
  return new Pool({ connectionString });
}

export async function GET() {
  const pool = getPool();
  try {
    const { rows } = await pool.query(
      'SELECT id, image, title, description, url, "createdAt" FROM "Achievement" ORDER BY "createdAt" DESC'
    );
    return NextResponse.json({ achievements: rows });
  } catch (error: any) {
    console.error('[achievements GET]', error);
    return NextResponse.json({ achievements: [], error: error?.message }, { status: 200 });
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
    const { image, title, description, url } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const { rows } = await pool.query(
      `INSERT INTO "Achievement" (image, title, description, url, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *`,
      [image || null, title.trim(), description || null, url || null]
    );
    return NextResponse.json({ achievement: rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('[achievements POST]', error);
    return NextResponse.json({ error: error?.message || 'Failed to create achievement' }, { status: 500 });
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
    const { id, image, title, description, url } = body;

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    if (!title?.trim()) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    const { rows } = await pool.query(
      `UPDATE "Achievement"
       SET image=$1, title=$2, description=$3, url=$4, "updatedAt"=NOW()
       WHERE id=$5 RETURNING *`,
      [image ?? null, title.trim(), description ?? null, url ?? null, Number(id)]
    );

    if (rows.length === 0) return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    return NextResponse.json({ achievement: rows[0] });
  } catch (error: any) {
    console.error('[achievements PUT]', error);
    return NextResponse.json({ error: error?.message || 'Failed to update achievement' }, { status: 500 });
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
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const { rowCount } = await pool.query('DELETE FROM "Achievement" WHERE id=$1', [Number(id)]);
    if (rowCount === 0) return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[achievements DELETE]', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete achievement' }, { status: 500 });
  } finally {
    await pool.end();
  }
}
