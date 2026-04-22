import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import sharp from 'sharp';

/**
 * Media API — serves legacy images stored in PostgreSQL.
 * 
 * New uploads go directly to R2 CDN and are served via the R2 public URL.
 * This endpoint only handles legacy DB-stored images.
 * 
 * Includes in-memory cache to avoid re-reading from DB on every request.
 */

// In-memory LRU cache for processed images (legacy DB images only)
const IMAGE_CACHE = new Map<string, { data: Buffer; contentType: string; timestamp: number }>();
const MAX_CACHE_SIZE = 100;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getCacheKey(id: string, width: number | null, quality: number, format: string): string {
  return `${id}_${width || 'full'}_q${quality}_${format}`;
}

function pruneCache() {
  if (IMAGE_CACHE.size <= MAX_CACHE_SIZE) return;
  const entries = [...IMAGE_CACHE.entries()]
    .sort((a, b) => a[1].timestamp - b[1].timestamp);
  const toRemove = entries.slice(0, entries.length - MAX_CACHE_SIZE);
  for (const [key] of toRemove) {
    IMAGE_CACHE.delete(key);
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const width = searchParams.get('w') ? parseInt(searchParams.get('w')!) : null;
    const quality = searchParams.get('q') ? parseInt(searchParams.get('q')!) : 80;

    const acceptHeader = req.headers.get('accept') || '';
    const supportsAvif = acceptHeader.includes('image/avif');
    const format = supportsAvif ? 'avif' : 'webp';

    // Check in-memory cache first
    const cacheKey = getCacheKey(id, width, quality, format);
    const cached = IMAGE_CACHE.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL_MS) {
      return new Response(cached.data as unknown as BodyInit, {
        headers: {
          'Content-Type': cached.contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Vary': 'Accept',
          'X-Cache': 'HIT',
        },
      });
    }

    // Read from DB (legacy storage)
    const media = await (prisma as any).media.findUnique({
      where: { id },
    });

    if (!media) {
      return new Response('Image not found', { status: 404 });
    }

    // Build sharp pipeline from raw DB buffer
    let pipeline = sharp(media.data as Buffer);

    if (width) {
      pipeline = pipeline.resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside',
      });
    }

    let outputBuf: Buffer;
    let contentType: string;

    if (supportsAvif) {
      outputBuf = await pipeline.avif({ quality }).toBuffer();
      contentType = 'image/avif';
    } else {
      outputBuf = await pipeline.webp({ quality }).toBuffer();
      contentType = 'image/webp';
    }

    // Store in cache
    IMAGE_CACHE.set(cacheKey, {
      data: outputBuf,
      contentType,
      timestamp: Date.now(),
    });
    pruneCache();

    return new Response(outputBuf as unknown as BodyInit, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Vary': 'Accept',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('Error fetching/processing image from DB:', error);
    return new Response('Error fetching image', { status: 500 });
  }
}
