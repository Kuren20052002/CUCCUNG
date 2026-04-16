import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import sharp from 'sharp';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const width = searchParams.get('w') ? parseInt(searchParams.get('w')!) : null;
    const quality = searchParams.get('q') ? parseInt(searchParams.get('q')!) : 80;

    const media = await (prisma as any).media.findUnique({
      where: { id },
    });

    if (!media) {
      return new Response('Image not found', { status: 404 });
    }

    const acceptHeader = req.headers.get('accept') || '';
    const supportsAvif = acceptHeader.includes('image/avif');

    // Build sharp pipeline from raw DB buffer
    let pipeline = sharp(media.data as Buffer);

    // Resize to the requested width — enables next/image to request
    // e.g. ?w=70 for a 70px logo slot instead of a full 1600px upload
    if (width) {
      pipeline = pipeline.resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside',
      });
    }

    // Serve AVIF when browser supports it, otherwise WebP
    let outputBuf: Buffer;
    let contentType: string;

    if (supportsAvif) {
      outputBuf = await pipeline.avif({ quality }).toBuffer();
      contentType = 'image/avif';
    } else {
      outputBuf = await pipeline.webp({ quality }).toBuffer();
      contentType = 'image/webp';
    }

    // Pass the buffer directly — Node.js Buffer IS a Uint8Array, valid BodyInit
    return new Response(outputBuf as unknown as BodyInit, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Vary': 'Accept',
      },
    });
  } catch (error) {
    console.error('Error fetching/processing image from DB:', error);
    return new Response('Error fetching image', { status: 500 });
  }
}
