import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import Script from 'next/script';
import Link from 'next/link';
import clsx from 'clsx';
import { cache } from 'react';
import { Sidebar } from "@/app/components/public/Sidebar";
import { BlogCard } from "@/app/components/public/BlogCard";
import { TableOfContents } from "@/app/components/public/TableOfContents";
import { parseMarkdown, extractToc } from '@/lib/markdown';
import { Calendar, User, Clock, Share2, MessageSquare, Folders, ChevronRight, Zap } from 'lucide-react';

// ISR: revalidate every 60s
export const revalidate = 60;

// ----------------------
// Cached DB query
// ----------------------
const getPost = cache(async (slug: string) => {
  return prisma.post.findUnique({
    where: { slug },
    include: {
      category: true,
      author: {
        select: { id: true, name: true, avatar: true, bio: true }
      },
      tags: true
    },
  });
});

// ----------------------
// Format date
// ----------------------
function formatDate(date: Date) {
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ----------------------
// Metadata (SEO)
// ----------------------
export async function generateMetadata(
  { params }: { params: Promise<{ category: string; slug: string }> }
): Promise<Metadata> {
  const { slug, category } = await params;
  const post = await getPost(slug);

  if (!post) return { robots: { index: false, follow: false } };

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt || undefined;
  const canonicalUrl = post.canonicalUrl || `https://ngoanxinhyeu.app/${category}/${slug}`;

  return {
    title,
    description,
    robots: {
      index: post.isIndexed,
      follow: true,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: description ?? undefined,
      type: 'article',
      url: canonicalUrl,
      siteName: 'ngoanxinhyeu',
      locale: 'vi_VN',
      images: post.metaImage
        ? [{ url: post.metaImage, alt: post.featuredImageAlt || title }]
        : [],
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: post.author?.name ? [post.author.name] : undefined,
    },
  };
}

// ----------------------
// Page
// ----------------------
export default async function ArticlePage(
  { params }: { params: Promise<{ category: string; slug: string }> }
) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post || !post.category || !post.author) return notFound();

  // Related posts (Silo content filter)
  const relatedPosts = await prisma.post.findMany({
    where: {
      categoryId: post.categoryId,
      slug: { not: post.slug },
      published: true,
    },
    include: {
      category: true,
      author: { select: { name: true, avatar: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  const popularPosts = await prisma.post.findMany({
    where: { published: true },
    select: { id: true, title: true, slug: true, category: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  const tagsList = await prisma.tag.findMany({
    take: 12
  });

  const tocItems = extractToc(post.content || '');
  const html = await parseMarkdown(post.content || '');

  const isImageInContent = (content: string, imageUrl: string | null) => {
    if (!imageUrl) return false;
    return content.includes(imageUrl);
  };

  const showFeaturedImage = post.metaImage && !isImageInContent(post.content || '', post.metaImage);

  return (
    <div className="pb-20 font-sans relative">
      {/* Scroll Progress Bar (Simplified client-side logic placeholder or pure CSS) */}
      <div className="fixed top-[72px] inset-x-0 h-1 bg-emerald-500/10 z-[60] origin-left scale-x-0" id="scroll-progress-bar" />

      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": post.metaDescription || post.excerpt || '',
            "image": post.metaImage || undefined,
            "author": {
              "@type": "Person",
              "name": post.author.name,
              "image": post.author.avatar || undefined,
              "description": post.author.bio || undefined
            },
            "publisher": {
              "@type": "Organization",
              "name": "ngoanxinhyeu",
              "url": "https://ngoanxinhyeu.app"
            },
            "datePublished": post.createdAt.toISOString(),
            "dateModified": post.updatedAt.toISOString(),
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://ngoanxinhyeu.app/${post.category.slug}/${post.slug}`
            }
          }),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-16">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Content Area */}
          <article className="flex-1 min-w-0 space-y-12 animate-fade-in">
            <header className="space-y-10">
              {/* Breadcrumbs */}
              <nav className="flex flex-wrap items-center gap-y-2 gap-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-6">
                <Link href="/" className="hover:text-emerald-600 transition-colors shrink-0">TRANG CHỦ</Link>
                <ChevronRight className="w-3 h-3 text-emerald-300 shrink-0" />
                <Link href={`/${post.category.slug}`} className="hover:text-emerald-600 transition-colors shrink-0 max-w-[100px] truncate">{post.category.name}</Link>
                <ChevronRight className="w-3 h-3 text-emerald-300 shrink-0" />
                <span className="text-emerald-600 truncate min-w-0 max-w-[140px] sm:max-w-xs">
                  {post.title}
                </span>
              </nav>

              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight mb-12">
                {post.title}
              </h1>

              {/* Author row */}
              <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-slate-100 mt-16 p-2 min-h-[5rem]">
                <div className="flex items-center space-x-4 pr-8 sm:border-r border-slate-100">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg border-2 border-white ring-1 ring-slate-100">
                    <Image src={post.author.avatar || 'https://i.pravatar.cc/100'} alt={post.author.name || ''} width={48} height={48} />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tác giả</div>
                    <div className="text-sm font-black text-slate-900">{post.author.name}</div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="flex flex-col space-y-0.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phát hành</span>
                    <span className="text-xs font-bold text-slate-600">{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Share to social media */}
              {/* <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1877F2] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:scale-105 transition-all">
                  <Share2 className="w-4 h-4 fill-current" /> Chia sẻ
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1DA1F2] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:scale-105 transition-all">
                  <Share2 className="w-4 h-4 fill-current" /> Tweet
                </button>
                <button className="w-10 h-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all group">
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div> */}
            </header>

            {/* Hero Image */}
            {/* {showFeaturedImage && post.metaImage && (
              <div className="relative aspect-[16/8] rounded-[3rem] overflow-hidden shadow-2xl border-x-0 border-y-0">
                <Image
                  src={post.metaImage}
                  alt={post.featuredImageAlt || post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1280px) 100vw, 1200px"
                />
              </div>
            )} */}

            <div className="flex flex-col lg:flex-row gap-12 relative">
              {/* Body Content */}
              <div className="w-full max-w-[750px] mx-auto lg:mx-0 min-w-0 overflow-hidden">
                <TableOfContents items={tocItems} />
                <div
                  className={clsx(
                    // overflow-wrap:normal + word-break:keep-all → wraps only at whitespace/hyphens
                    // prose-a:break-all → still allows long URLs to break so they don't overflow
                    '[overflow-wrap:normal] [word-break:keep-all] prose prose-sm lg:prose-base prose-emerald max-w-none prose-a:break-all prose-img:rounded-[2rem] prose-img:shadow-xl prose-img:my-10 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-emerald-50 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:text-emerald-900 prose-blockquote:not-italic prose-blockquote:font-bold prose-h2:text-xl lg:prose-h2:text-2xl prose-h2:font-black prose-h2:tracking-tight prose-h2:mb-4 prose-h2:scroll-mt-24 prose-h3:scroll-mt-24 prose-p:leading-[1.8] prose-strong:text-slate-900'
                  )}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
                {/* Post Footer/Tags */}
                <div className="mt-20 pt-10 border-t border-slate-100 space-y-10">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map(tag => (
                        <Link key={tag.id} href={`/tag/${tag.slug}`} className="px-4 py-1.5 bg-slate-50 text-[10px] font-bold text-slate-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all">
                          #{tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Author Bio Box */}
                  {/* <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                      <div className="w-24 h-24 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white transform group-hover:rotate-6 transition-transform">
                        <Image src={post.author.avatar || ''} alt={post.author.name || ''} width={96} height={96} />
                      </div>
                      <div className="flex-1 space-y-3 text-center md:text-left">
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Được kiểm chứng bởi</h4>
                        <h3 className="text-xl font-black text-slate-900">{post.author.name}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                          {post.author.bio || 'Chuyên gia tư vấn về chăm sóc mẹ và bé tại ngoanxinhyeu.app, nỗ lực mang lại kiến thức đúng đắn và an tâm cho gia đình bạn.'}
                        </p>
                      </div>
                    </div>
                  </div> */}
                </div>

                {/* Related Posts Row */}
                <section className="mt-8 space-y-12">
                  <div className="flex flex-col gap-3 border-b border-slate-100 pb-8">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 tracking-tight">Xem thêm cùng chủ đề<span className="text-primary">.</span></h2>
                    <Link href={`/${post.category.slug}`} className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5 group w-fit">
                      Tất cả <span className="truncate max-w-[160px]">{post.category.name}</span> <ChevronRight className="w-3.5 h-3.5 shrink-0 transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                  <div className="flex flex-col gap-6">
                    {relatedPosts.map((rp, index) => (
                      <BlogCard key={rp.id} post={rp as any} index={index} />
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </article>

          {/* Sidebar Area Desktop */}
          <div className="hidden lg:block lg:w-96">
            <div className="sticky top-24 self-start">
              <Sidebar tags={tagsList} popularPosts={popularPosts as any} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}