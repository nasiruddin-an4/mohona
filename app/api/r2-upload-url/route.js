import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { requireAuth } from '@/lib/rbac';
import { createPresignedUploadUrl } from '@/lib/r2';

// GET /api/r2-upload-url?folder=mohona_shop/products&filename=photo.jpg&contentType=image/jpeg
// Returns a short-lived presigned PUT URL so the browser can upload straight to R2.
export async function GET(request) {
  const session = getSessionFromRequest(request);
  const auth = requireAuth(session);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'mohona_shop';
    const filename = searchParams.get('filename') || '';
    const contentType = searchParams.get('contentType') || 'application/octet-stream';

    const { uploadUrl, publicUrl, key } = await createPresignedUploadUrl({ folder, filename, contentType });

    return NextResponse.json({ success: true, uploadUrl, publicUrl, key });
  } catch (error) {
    console.error('R2 presign error:', error);
    return NextResponse.json({ success: false, message: 'Failed to generate upload URL' }, { status: 500 });
  }
}
