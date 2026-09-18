/**
 * Upload a File directly to Cloudflare R2 from the browser using a
 * short-lived presigned URL. The file bytes never pass through our server.
 * Returns the public R2 URL string on success.
 */
export async function uploadToR2(file, folder = 'mohona_shop') {
  const params = new URLSearchParams({
    folder,
    filename: file.name || '',
    contentType: file.type || 'application/octet-stream',
  });

  const presignRes = await fetch(`/api/r2-upload-url?${params}`);
  if (!presignRes.ok) throw new Error('Failed to get upload URL');
  const { uploadUrl, publicUrl } = await presignRes.json();

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
  });

  if (!uploadRes.ok) throw new Error('Upload failed');

  return publicUrl;
}
