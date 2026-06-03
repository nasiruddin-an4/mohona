/**
 * Upload a File to ImageKit via our auth endpoint.
 * Returns the ImageKit URL string on success.
 */
export async function uploadToImageKit(file, folder = '/products') {
  // 1. Get auth params from our server
  const authRes = await fetch('/api/imagekit-auth');
  if (!authRes.ok) throw new Error('Failed to get upload auth');
  const { token, expire, signature } = await authRes.json();

  // 2. Upload to ImageKit
  const formData = new FormData();
  formData.append('file', file);
  formData.append('publicKey', process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY);
  formData.append('signature', signature);
  formData.append('expire', expire);
  formData.append('token', token);
  formData.append('fileName', file.name);
  formData.append('folder', folder);

  const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    body: formData,
  });

  if (!uploadRes.ok) {
    const errData = await uploadRes.json();
    throw new Error(errData.message || 'Upload failed');
  }

  const data = await uploadRes.json();
  return data.url;
}
