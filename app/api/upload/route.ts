import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';

const MAX_SIZE_MB = 2;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPG, PNG, WEBP, GIF' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File too large. Max size is ${MAX_SIZE_MB}MB` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({ url: dataUrl });
  } catch (error: any) {
    console.error('[upload POST]', error);
    return NextResponse.json({ error: error?.message || 'Upload failed' }, { status: 500 });
  }
}
