import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ngoanxinhyeu.vercel.app';

  // Fetch all categories
  const categories = await prisma.category.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  // Fetch all published posts
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      isIndexed: true,
    },
    select: {
      slug: true,
      updatedAt: true,
      category: {
        select: {
          slug: true,
        },
      },
    },
  });

  // Category URLs
  const categoryUrls = categories.map((cat) => ({
    url: `${baseUrl}/${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Post URLs
  const postUrls = posts
    .filter((post) => post.category?.slug) // Ensure it has a category slug
    .map((post) => ({
      url: `${baseUrl}/${post.category!.slug}/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
  ];

  return [...staticPages, ...categoryUrls, ...postUrls];
}
