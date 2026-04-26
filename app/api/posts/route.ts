import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { slugify } from '@/lib/utils/slugify';
import { generateUniqueSlug } from '@/lib/utils/slugify-server';

const SITEMAP_URL = 'https://ngoanxinhyeu.app/sitemap.xml';

/** Ping Google to re-crawl the sitemap. Fire-and-forget. */
function pingSitemap() {
  fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`)
    .then(() => console.log('Sitemap ping sent to Google'))
    .catch((err) => console.warn('Sitemap ping failed (non-critical):', err.message));
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { 
      title, 
      slug: initialSlug, 
      content, 
      metaTitle, 
      metaDescription, 
      categoryId, 
      metaImage, 
      featuredImageAlt,
      images,
      published 
    } = data;

    // Validate required fields
    if (!title || !content || !metaTitle || !metaDescription || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let baseSlug = initialSlug ? slugify(initialSlug) : slugify(title);
    if (!baseSlug) {
      return NextResponse.json({ error: 'Invalid slug or title' }, { status: 400 });
    }
    
    // Check if regex matches
    if (!/^[a-z0-9-]+$/.test(baseSlug)) {
        return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 });
    }

    // Check if slug is unique and append -1, -2, etc. if not
    const slug = await generateUniqueSlug(baseSlug);

    // Create post
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        metaTitle,
        metaDescription,
        metaImage,
        featuredImageAlt,
        images,
        published: !!published,
        categoryId,
        authorId: session.user.id!,
      },
      include: {
        category: true,
      }
    });

    // Revalidate paths
    revalidatePath('/');
    revalidatePath('/posts');
    if (post.category?.slug) {
      revalidatePath(`/${post.category.slug}`);
    }

    // Notify Google of sitemap changes when a post is published
    if (post.published) {
      pingSitemap();
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error('CRITICAL: Error creating post:', error);
    return NextResponse.json({ 
      error: 'Failed to create post', 
      details: error.message || String(error)
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { 
      id,
      title, 
      slug: initialSlug, 
      content, 
      metaTitle, 
      metaDescription, 
      categoryId, 
      metaImage, 
      featuredImageAlt,
      images,
      published 
    } = data;

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: { category: true }
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    let finalSlug = existingPost.slug;

    // Lock after publish: if post.published = true -> prevent slug update
    if (!existingPost.published && initialSlug && initialSlug !== existingPost.slug) {
        let baseSlug = slugify(initialSlug);
        
        if (!/^[a-z0-9-]+$/.test(baseSlug)) {
            return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 });
        }
        
        finalSlug = await generateUniqueSlug(baseSlug, existingPost.id);
    } else if (!existingPost.published && !initialSlug && title !== existingPost.title) {
        let baseSlug = slugify(title);
        if (/^[a-z0-9-]+$/.test(baseSlug)) {
            finalSlug = await generateUniqueSlug(baseSlug, existingPost.id);
        }
    }

    // Update post
    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug: finalSlug,
        content,
        metaTitle,
        metaDescription,
        metaImage,
        featuredImageAlt,
        images,
        published: published !== undefined ? published : existingPost.published,
        categoryId,
        ...(finalSlug !== existingPost.slug && {
          slugHistory: {
            create: {
              oldSlug: existingPost.slug
            }
          }
        }),
      },
      include: {
        category: true,
      }
    });

    // Revalidate paths
    revalidatePath('/');
    revalidatePath('/posts');
    if (post.category?.slug) {
      revalidatePath(`/${post.category.slug}`);
      revalidatePath(`/${post.category.slug}/${post.slug}`);
    }

    // Notify Google of sitemap changes when a post is published
    if (post.published) {
      pingSitemap();
    }

    return NextResponse.json(post);
  } catch (error: any) {
    console.error('CRITICAL: Error updating post:', error);
    return NextResponse.json({ 
      error: 'Failed to update post',
      details: error.message || String(error)
    }, { status: 500 });
  }
}
