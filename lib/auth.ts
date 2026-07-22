import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { Pool } from '@neondatabase/serverless';

const SESSION_COOKIE_NAME = 'admin_session_token';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function getNeonPool(): Pool {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) throw new Error('DATABASE_URL is not set');
  return new Pool({ connectionString });
}

export async function verifyUserCredentials(email: string, pass: string) {
  const pool = getNeonPool();
  try {
    const result = await pool.query(
      'SELECT id, email, username, password FROM "User" WHERE email = $1',
      [email.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    const isValid = await comparePassword(pass, user.password);
    if (!isValid) {
      return null;
    }

    return {
      id: user.id as number,
      email: user.email as string,
      username: user.username as string,
    };
  } catch (error) {
    console.error('verifyUserCredentials error:', error);
    return null;
  } finally {
    await pool.end();
  }
}

export async function createSession(user: { id: number; email: string; username: string }) {
  try {
    const cookieStore = cookies();
    const sessionData = JSON.stringify({
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: Date.now(),
    });

    const token = Buffer.from(sessionData).toString('base64');

    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  } catch (error) {
    console.error('createSession error:', error);
  }
}

export async function getCurrentSession() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) return null;

    const raw = Buffer.from(token, 'base64').toString('utf-8');
    const data = JSON.parse(raw);
    if (!data || !data.id || !data.email) return null;
    return data as { id: number; email: string; username: string };
  } catch (error) {
    console.error('getCurrentSession error:', error);
    return null;
  }
}

export async function clearSession() {
  try {
    const cookieStore = cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (error) {
    console.error('clearSession error:', error);
  }
}
