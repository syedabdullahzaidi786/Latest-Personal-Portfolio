import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';
import { getCurrentSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

function getPool() {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) throw new Error('DATABASE_URL is not configured');
  return new Pool({ connectionString });
}

export async function GET() {
  const pool = getPool();
  try {
    const { rows } = await pool.query(
      'SELECT id, email, username, "createdAt" FROM "User" ORDER BY id ASC'
    );
    return NextResponse.json({ users: rows });
  } catch (error: any) {
    console.error('[users GET]', error);
    return NextResponse.json({ users: [], error: error?.message }, { status: 200 });
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
    const { email, username, password } = body;

    if (!email?.trim()) return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    if (!username?.trim()) return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Check for duplicate email
    const { rows: existing } = await pool.query(
      'SELECT id FROM "User" WHERE email=$1',
      [email.trim().toLowerCase()]
    );
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO "User" (email, username, password, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id, email, username, "createdAt"`,
      [email.trim().toLowerCase(), username.trim(), hashedPassword]
    );
    return NextResponse.json({ user: rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('[users POST]', error);
    return NextResponse.json({ error: error?.message || 'Failed to create user' }, { status: 500 });
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
    const { id, email, username, password } = body;

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    if (!email?.trim()) return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    if (!username?.trim()) return NextResponse.json({ error: 'Username is required' }, { status: 400 });

    let rows;
    if (password && password.trim().length >= 6) {
      const hashedPassword = await bcrypt.hash(password, 10);
      ({ rows } = await pool.query(
        `UPDATE "User" SET email=$1, username=$2, password=$3, "updatedAt"=NOW()
         WHERE id=$4 RETURNING id, email, username, "createdAt"`,
        [email.trim().toLowerCase(), username.trim(), hashedPassword, Number(id)]
      ));
    } else {
      ({ rows } = await pool.query(
        `UPDATE "User" SET email=$1, username=$2, "updatedAt"=NOW()
         WHERE id=$3 RETURNING id, email, username, "createdAt"`,
        [email.trim().toLowerCase(), username.trim(), Number(id)]
      ));
    }

    if (rows.length === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ user: rows[0] });
  } catch (error: any) {
    console.error('[users PUT]', error);
    return NextResponse.json({ error: error?.message || 'Failed to update user' }, { status: 500 });
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

    const { rowCount } = await pool.query('DELETE FROM "User" WHERE id=$1', [Number(id)]);
    if (rowCount === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[users DELETE]', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete user' }, { status: 500 });
  } finally {
    await pool.end();
  }
}
