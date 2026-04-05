import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return new Response('Image not found', { status: 404 });
    }

    // Return the image data with proper content type
    return new Response(media.data, {
      headers: {
        'Content-Type': media.type,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for a long time
      },
    });
  } catch (error) {
    console.error('Error fetching image from DB:', error);
    return new Response('Error fetching image', { status: 500 });
  }
}
