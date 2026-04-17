import React from 'react';
import { notFound } from "next/navigation";
import { Metadata } from 'next';
import prisma from "@/lib/prisma";
import { BlogCard } from "@/app/components/public/BlogCard";
import { Sidebar } from "@/app/components/public/Sidebar";
import { Pagination } from "@/app/components/public/Pagination";
import Link from 'next/link';
import { LayoutGrid, Folders, ChevronRight, LayoutList } from 'lucide-react';
import { cache } from 'react';

const getCategory = cache(async (slug: string) =>
  prisma.category.findUnique({ where: { slug } })
);

export async function generateMetadata(
  { params, searchParams }: {
    params: Promise<{ category: string }>;
    searchParams: Promise<{ page?: string }>;
  }
): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1', 10);
  const postsPerPage = 8;

  const category = await getCategory(categorySlug);
  if (!category) return { robots: { index: false, follow: false } };

  const totalPosts = await prisma.post.count({
    where: { categoryId: category.id, published: true }
  });
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const title = category.seoTitle || `${category.name} - Kiến thức chăm sóc mẹ và bé | ngoanxinhyeu`;
  const description = category.seoDescription || `Khám phá các bài viết hữu ích về ${category.name} giúp mẹ chăm sóc bé đúng cách.`;
  const canonicalUrl = `https://ngoanxinhyeu.app/${categorySlug}${currentPage > 1 ? `?page=${currentPage}` : ''}`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl,
    },
    other: getPaginatedMetadata(`/${categorySlug}`, currentPage, totalPages),
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'ngoanxinhyeu',
      locale: 'vi_VN',
    },
  };
}

// Helper to safely get page metadata for next/prev
function getPaginatedMetadata(baseUrl: string, currentPage: number, totalPages: number) {
  const meta: any = {};
  if (currentPage > 1) {
    meta['prev'] = `https://ngoanxinhyeu.app${baseUrl}?page=${currentPage - 1}`;
  }
  if (currentPage < totalPages) {
    meta['next'] = `https://ngoanxinhyeu.app${baseUrl}?page=${currentPage + 1}`;
  }
  return meta;
}

export const revalidate = 3600;

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { category: categorySlug } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1', 10);
  const postsPerPage = 8;

  const category = await getCategory(categorySlug);

  if (!category) return notFound();

  const [posts, totalPosts] = await Promise.all([
    prisma.post.findMany({
      where: {
        categoryId: category.id,
        published: true
      },
      include: {
        category: true,
        author: {
          select: { name: true, avatar: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * postsPerPage,
      take: postsPerPage,
    }),
    prisma.post.count({
      where: {
        categoryId: category.id,
        published: true
      }
    })
  ]);

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const popularPosts = await prisma.post.findMany({
    where: { published: true },
    select: { id: true, title: true, slug: true, category: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  const tags = await prisma.tag.findMany({
    take: 12
  });

  return (
    <div className="space-y-12 pb-20 font-sans mt-8 lg:mt-12">
      {/* Category Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 p-12 lg:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden group border-b-4 border-emerald-500">
          {/* Decorative Background Icon */}
          <div className="absolute -bottom-10 -right-10 opacity-5 transform group-hover:scale-110 transition-transform duration-1000 rotate-12">
            <Folders className="w-64 h-64 text-white" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-6">
            <nav className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-4 inline-flex">
              <Link href="/" className="hover:text-emerald-400 transition-colors">TRANG CHỦ</Link>
              <ChevronRight className="w-3 h-3 text-slate-700" />
              <span className="text-emerald-400">CHỦ ĐỀ</span>
            </nav>

            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight">
              {category.name}<span className="text-emerald-500">.</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed font-medium">
              {category.description || `Khám phá các bài viết hữu ích về chủ đề ${category.name} giúp mẹ nuôi con thông minh và khỏe mạnh hơn mỗi ngày.`}
            </p>

            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{totalPosts} bài viết đã xuất bản</span>
              </div>
            </div>
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
                <Folders className="w-16 h-16 text-slate-200 mx-auto" />
                <h2 className="text-xl font-black text-slate-400 tracking-tight">Chưa có bài viết nào trong danh mục này.</h2>
                <Link href="/" className="inline-block px-10 py-4 bg-white border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-600 transition-all">Quay lại trang chủ</Link>
              </div>
            )}

            {/* Reusable Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl={`/${categorySlug}`}
            />
          </div>

          {/* Sidebar Area */}
          <div className="lg:w-96">
            <div className="sticky top-24 self-start">
              <Sidebar tags={tags} popularPosts={popularPosts} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
