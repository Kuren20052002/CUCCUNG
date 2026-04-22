import 'server-only';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

/**
 * Cloudflare R2 client — S3-compatible object storage.
 * 
 * Required env vars:
 *   R2_ACCOUNT_ID      — Cloudflare account ID
 *   R2_ACCESS_KEY_ID   — R2 API token access key
 *   R2_SECRET_ACCESS_KEY — R2 API token secret key
 *   R2_BUCKET_NAME     — R2 bucket name (e.g. "ngoanxinhyeu-media")
 *   R2_PUBLIC_URL      — Public URL for the bucket (custom domain or r2.dev URL)
 */

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'ngoanxinhyeu-media';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!; // e.g. "https://media.ngoanxinhyeu.app" or "https://pub-xxx.r2.dev"

// Singleton S3 client for R2
let _r2Client: S3Client | null = null;

function getR2Client(): S3Client {
  if (_r2Client) return _r2Client;

  _r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

  return _r2Client;
}

/**
 * Uploads a buffer to R2 and returns the public URL.
 * 
 * @param key      — Object key (e.g. "media/abc123.webp")
 * @param body     — File buffer
 * @param contentType — MIME type (e.g. "image/webp")
 * @returns Public URL for the uploaded object
 */
export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string = 'image/webp'
): Promise<string> {
  const client = getR2Client();

  await client.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }));

  return `${R2_PUBLIC_URL}/${key}`;
}

/**
 * Deletes an object from R2.
 * 
 * @param key — Object key to delete
 */
export async function deleteFromR2(key: string): Promise<void> {
  const client = getR2Client();

  await client.send(new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  }));
}

/**
 * Checks if R2 is configured (all required env vars present).
 */
export function isR2Configured(): boolean {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_PUBLIC_URL
  );
}

/**
 * Extracts the R2 key from a full R2 public URL.
 * e.g. "https://media.ngoanxinhyeu.app/media/abc123.webp" → "media/abc123.webp"
 */
export function extractR2Key(url: string): string | null {
  if (!R2_PUBLIC_URL || !url.startsWith(R2_PUBLIC_URL)) return null;
  return url.slice(R2_PUBLIC_URL.length + 1); // +1 for the "/"
}
