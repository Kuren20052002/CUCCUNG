import React from 'react';
import { notFound } from "next/navigation";
import { Metadata } from 'next';
import prisma from "@/lib/prisma";
import { BlogCard } from "@/app/components/public/BlogCard";
import { Sidebar } from "@/app/components/public/Sidebar";
import { Pagination } from "@/app/components/public/Pagination";
import Link from 'next/link';
import { LayoutGrid, Tags, ChevronRight } from 'lucide-react';
import { cache } from 'react';

const getTag = cache(async (slug: string) =>
  prisma.tag.findUnique({ where: { slug } })
);

export async function generateMetadata(
  { params, searchParams }: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
  }
): Promise<Metadata> {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1', 10);
  const postsPerPage = 8;

  const tag = await getTag(slug);
  if (!tag) return { robots: { index: false, follow: false } };

  const totalPosts = await prisma.post.count({
    where: {
      published: true,
      tags: { some: { id: tag.id } }
    }
  });
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const title = `Bài viết về #${tag.name} - Trang ${currentPage} | Ngoan Xinh Yêu`;
  const description = `Danh sách bài viết được gắn thẻ #${tag.name} chia sẻ các cẩm nang, mẹo hay và kiến thức hữu ích cho Mẹ & Bé.`;
  const canonicalUrl = `https://ngoanxinhyeu.app/tag/${slug}${currentPage > 1 ? `?page=${currentPage}` : ''}`;

  const otherMeta: any = {};
  if (currentPage > 1) {
    otherMeta['prev'] = `https://ngoanxinhyeu.app/tag/${slug}?page=${currentPage - 1}`;
  }
  if (currentPage < totalPages) {
    otherMeta['next'] = `https://ngoanxinhyeu.app/tag/${slug}?page=${currentPage + 1}`;
  }

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl,
    },
    other: otherMeta,
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'Ngoan Xinh Yêu',
      locale: 'vi_VN',
      images: [
        {
          url: 'https://ngoanxinhyeu.app/ngoanxinhyeu_logo.webp',
          width: 1200,
          height: 630,
          alt: `Thẻ #${tag.name} - Ngoan Xinh Yêu`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export const revalidate = 3600;

export default async function TagPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1', 10);
  const postsPerPage = 8;

  const tag = await getTag(slug);
  if (!tag) return notFound();

  // Run database queries in parallel for better performance
  const [posts, totalPosts, popularPosts, tags] = await Promise.all([
    prisma.post.findMany({
      where: {
        published: true,
        tags: { some: { id: tag.id } }
      },
      include: {
        category: true,
        author: {
          select: { name: true, avatar: true }
        }
      },
      orderBy: { updatedAt: 'desc' },
      skip: (currentPage - 1) * postsPerPage,
      take: postsPerPage,
    }),
    prisma.post.count({
      where: {
        published: true,
        tags: { some: { id: tag.id } }
      }
    }),
    prisma.post.findMany({
      where: { published: true },
      select: { id: true, title: true, slug: true, category: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 5
    }),
    prisma.tag.findMany({
      take: 12
    }),
  ]);

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <div className="space-y-12 pb-20 font-sans mt-8 lg:mt-12">
      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Trang chủ",
                "item": "https://ngoanxinhyeu.app"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": `Thẻ: #${tag.name}`,
                "item": `https://ngoanxinhyeu.app/tag/${slug}`
              }
            ]
          }),
        }}
      />
      {/* CollectionPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `Thẻ #${tag.name}`,
            "description": `Khám phá các bài viết hữu ích được gắn thẻ #${tag.name}`,
            "url": `https://ngoanxinhyeu.app/tag/${slug}`,
            "isPartOf": {
              "@type": "WebSite",
              "name": "Ngoan Xinh Yêu",
              "url": "https://ngoanxinhyeu.app"
            },
            "inLanguage": "vi",
            "numberOfItems": totalPosts
          }),
        }}
      />

      {/* Tag Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 p-12 lg:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden group border-b-4 border-emerald-500">
          {/* Decorative Background Icon */}
          <div className="absolute -bottom-10 -right-10 opacity-5 transform group-hover:scale-110 transition-transform duration-1000 rotate-12">
            <Tags className="w-64 h-64 text-white" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-6">
            <nav className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-4 inline-flex">
              <Link href="/" className="hover:text-emerald-400 transition-colors">TRANG CHỦ</Link>
              <ChevronRight className="w-3 h-3 text-slate-700" />
              <span className="text-emerald-400">TỪ KHÓA</span>
            </nav>

            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight">
              #{tag.name}<span className="text-emerald-500">.</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed font-medium">
              Tìm thấy {totalPosts} bài viết chất lượng liên quan đến từ khóa #{tag.name} chia sẻ các kiến thức và cẩm nang bổ ích.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* List Area */}
          <div className="flex-1 space-y-12">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
              <div className="flex items-center space-x-2">
                <LayoutGrid className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Danh sách bài viết</span>
              </div>
            </div>

            {posts.length > 0 ? (
              <div className="flex flex-col gap-8">
                {posts.map((post, index) => (
                  <BlogCard key={post.id} post={post} index={index} />
                ))}
              </div>
            ) : (
              <div className="p-20 bg-slate-50 rounded-[3rem] text-center space-y-4">
                <Tags className="w-16 h-16 text-slate-200 mx-auto" />
                <h2 className="text-xl font-black text-slate-400 tracking-tight">Chưa có bài viết nào được gắn từ khóa này.</h2>
                <Link href="/" className="inline-block px-10 py-4 bg-white border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-600 transition-all">Quay lại trang chủ</Link>
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl={`/tag/${slug}`}
            />
          </div>

          {/* Sidebar Area */}
          <div className="lg:w-96">
            <Sidebar tags={tags} popularPosts={popularPosts} />
          </div>
        </div>
      </div>
    </div>
  );
}
