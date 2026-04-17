import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { 
      title, 
      slug, 
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
    if (!title || !slug || !content || !metaTitle || !metaDescription || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if slug is unique
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

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
      slug, 
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

    // Check slug uniqueness if changed
    if (slug !== existingPost.slug) {
      const slugPost = await prisma.post.findUnique({
        where: { slug },
      });
      if (slugPost) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
      }
    }

    // Update post
    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        metaTitle,
        metaDescription,
        metaImage,
        featuredImageAlt,
        images,
        published: published !== undefined ? published : existingPost.published,
        categoryId,
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

    return NextResponse.json(post);
  } catch (error: any) {
    console.error('CRITICAL: Error updating post:', error);
    return NextResponse.json({ 
      error: 'Failed to update post',
      details: error.message || String(error)
    }, { status: 500 });
  }
}
