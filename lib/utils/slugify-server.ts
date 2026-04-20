import prisma from '@/lib/prisma';
import { slugify } from './slugify';

/**
 * Generates a unique slug by checking the database.
 * If the slug already exists, it appends a counter (e.g., -1, -2).
 * This should ONLY be called from the server.
 */
export async function generateUniqueSlug(
  baseSlug: string,
  postId?: string
): Promise<string> {
  const normalizedBase = slugify(baseSlug);
  let slug = normalizedBase;
  let counter = 1;

  while (true) {
    const existing = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing || (postId && existing.id === postId)) {
      return slug;
    }

    slug = `${normalizedBase}-${counter}`;
    counter++;
  }
}
