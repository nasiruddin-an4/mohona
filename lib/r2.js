import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT_URL,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;
const PUBLIC_URL = process.env.R2_PUBLIC_URL;

// Keeps letters (incl. Bengali/Unicode) and digits, collapses everything else to a hyphen.
const slugifyFilename = (filename) => {
  if (!filename) return 'file';
  const dot = filename.lastIndexOf('.');
  const base = dot > 0 ? filename.slice(0, dot) : filename;
  const safe = base
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
  return safe || 'file';
};

const buildKey = (folder, filename, contentType) => {
  const cleanFolder = folder.replace(/^\/+|\/+$/g, '');
  const ext = filename && filename.includes('.')
    ? filename.split('.').pop().toLowerCase()
    : (contentType ? contentType.split('/').pop() : 'bin');
  return `${cleanFolder}/${Date.now()}-${slugifyFilename(filename)}.${ext}`;
};

/**
 * Server-side upload: reads a File/Blob or raw Buffer and puts it directly to R2.
 * Use this from trusted server code (API routes, scripts) that already has the bytes.
 * @param {File|Blob|Buffer} file
 * @param {String} folder
 * @param {{ contentType?: String, filename?: String }} [meta] - required when passing a raw Buffer
 * @returns {Promise<String>} public URL of the uploaded object
 */
export const uploadToR2 = async (file, folder = 'mohona_shop', meta = {}) => {
  const isBuffer = Buffer.isBuffer(file);
  const buffer = isBuffer ? file : Buffer.from(await file.arrayBuffer());
  const contentType = meta.contentType || file.type || 'application/octet-stream';
  const filename = meta.filename || file.name;
  const key = buildKey(folder, filename, contentType);

  await r2Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return `${PUBLIC_URL}/${key}`;
};

/**
 * Creates a short-lived presigned PUT URL so the browser can upload a file
 * directly to R2 without the file bytes ever passing through our server.
 * @param {{ folder: String, filename: String, contentType: String }} params
 * @returns {Promise<{ uploadUrl: String, publicUrl: String, key: String }>}
 */
export const createPresignedUploadUrl = async ({ folder = 'mohona_shop', filename, contentType }) => {
  const key = buildKey(folder, filename, contentType);

  const uploadUrl = await getSignedUrl(
    r2Client,
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType || 'application/octet-stream',
    }),
    { expiresIn: 300 }
  );

  return { uploadUrl, publicUrl: `${PUBLIC_URL}/${key}`, key };
};

/**
 * Deletes an object from R2 given its full public URL.
 * @param {String} url
 * @returns {Promise<void>}
 */
export const deleteFromR2 = async (url) => {
  try {
    if (!url || !PUBLIC_URL || !url.startsWith(`${PUBLIC_URL}/`)) return;

    const key = url.slice(PUBLIC_URL.length + 1);
    if (!key) return;

    await r2Client.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
  } catch (error) {
    console.error('R2 deletion error:', error);
  }
};
