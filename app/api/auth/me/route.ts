import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentSession();
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    return NextResponse.json({ authenticated: true, user }, { status: 200 });
  } catch (error: any) {
    console.error('API /api/auth/me error:', error);
    return NextResponse.json(
      { authenticated: false, user: null, error: error?.message || 'Session error' },
      { status: 200 }
    );
  }
}
