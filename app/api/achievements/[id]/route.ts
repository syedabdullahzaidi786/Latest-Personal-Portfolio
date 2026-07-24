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
      'SELECT id, image, title, description, url, "createdAt" FROM "Achievement" WHERE id = $1',
      [id]
    );
    if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ achievement: rows[0] });
  } catch (error: any) {
    console.error('[achievements/[id] GET]', error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  } finally {
    await pool.end();
  }
}
