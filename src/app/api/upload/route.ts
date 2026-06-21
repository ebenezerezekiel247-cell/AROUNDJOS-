import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { uploadToCloudinary, CLD_FOLDERS } from '@/lib/cloudinary';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files    = formData.getAll('files') as File[];
    const type     = (formData.get('type') as string) || 'listings';
    const entityId = (formData.get('entityId') as string) || user.id;

    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    if (files.length > 8) {
      return NextResponse.json({ error: 'Maximum 8 files at once' }, { status: 400 });
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    const ALLOWED  = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    for (const file of files) {
      if (!ALLOWED.includes(file.type)) {
        return NextResponse.json({ error: `Invalid type: ${file.type}` }, { status: 400 });
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: `${file.name} exceeds 5MB limit` }, { status: 400 });
      }
    }

    const folderMap: Record<string, string> = {
      listings: CLD_FOLDERS.listings(entityId),
      reviews:  CLD_FOLDERS.reviews(entityId),
      claims:   CLD_FOLDERS.claims(entityId),
      avatars:  CLD_FOLDERS.avatars(user.id),
      ads:      CLD_FOLDERS.ads,
    };
    const folder = folderMap[type] || CLD_FOLDERS.listings(entityId);

    const uploadPromises = files.map(async (file) => {
      const bytes  = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
      return uploadToCloudinary(base64, folder);
    });

    const results = await Promise.all(uploadPromises);
    const urls    = results.map((r) => r.url);

    return NextResponse.json({ urls, publicIds: results.map((r) => r.publicId) });
  } catch (error: any) {
    console.error('[upload] Error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
