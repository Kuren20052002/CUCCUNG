import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/login/', '/signup/'],
    },
    sitemap: 'https://ngoanxinhyeu.vercel.app/sitemap.xml',
    host: 'https://ngoanxinhyeu.vercel.app',
  };
}
