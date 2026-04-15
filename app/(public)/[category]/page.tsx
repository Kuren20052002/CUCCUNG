import React from 'react';
import { notFound } from "next/navigation";
import { Metadata } from 'next';
import prisma from "@/lib/prisma";
import { BlogCard } from "@/app/components/public/BlogCard";
import { Sidebar } from "@/app/components/public/Sidebar";
import Link from 'next/link';
import { LayoutGrid, Folders, ChevronRight, LayoutList } from 'lucide-react';
import { cache } from 'react';

const getCategory = cache(async (slug: string) =>
  prisma.category.findUnique({ where: { slug } })
);

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await getCategory(categorySlug);

  if (!category) return { robots: { index: false, follow: false } };

  const title = category.seoTitle ||
    `${category.name} - Kiến thức chăm sóc mẹ và bé | ngoanxinhyeu`;
  const description = category.seoDescription ||
    `Khám phá các bài viết hữu ích về ${category.name} giúp mẹ chăm sóc bé đúng cách, khoa học và an toàn nhất.`;
  const canonicalUrl = `https://ngoanxinhyeu.app/${categorySlug}`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: canonicalUrl },
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

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;

  const category = await getCategory(categorySlug);

  if (!category) return notFound();

  const posts = await prisma.post.findMany({
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
  });

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
        <div className="bg-white p-12 lg:p-20 rounded-[3rem] border border-slate-100 shadow-sm shadow-slate-200/50 relative overflow-hidden group">
          {/* Decorative Background Icon */}
          <div className="absolute -bottom-10 -right-10 opacity-5 transform group-hover:scale-110 transition-transform duration-1000 rotate-12">
            <Folders className="w-64 h-64 text-emerald-900" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-6">
            <nav className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-emerald-50 pb-4 inline-flex">
              <Link href="/" className="hover:text-emerald-600 transition-colors">TRANG CHỦ</Link>
              <ChevronRight className="w-3 h-3 text-emerald-300" />
              <span className="text-emerald-600">CHỦ ĐỀ</span>
            </nav>

            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight">
              {category.name}.
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed font-medium">
              {category.description || `Khám phá các bài viết hữu ích về chủ đề ${category.name} giúp mẹ nuôi con thông minh và khỏe mạnh hơn mỗi ngày.`}
            </p>

            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{posts.length} bài viết đã xuất bản</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Grid Area */}
          <div className="flex-1 space-y-12">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
              <div className="flex items-center space-x-2">
                <LayoutGrid className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Tất cả bài viết</span>
              </div>

              <div className="flex items-center space-x-4">
                <button className="p-2 text-slate-300 hover:text-emerald-500 transition-colors active:scale-95"><LayoutGrid className="w-5 h-5" /></button>
                <button className="p-2 text-slate-300 hover:text-emerald-500 transition-colors active:scale-95"><LayoutList className="w-5 h-5" /></button>
              </div>
            </div>

            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 md:gap-y-12 lg:grid-cols-2 gap-8 lg:gap-10">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="p-20 bg-slate-50 rounded-[3rem] text-center space-y-4">
                <Folders className="w-16 h-16 text-slate-200 mx-auto" />
                <h2 className="text-xl font-black text-slate-400 tracking-tight">Chưa có bài viết nào trong danh mục này.</h2>
                <Link href="/" className="inline-block px-10 py-4 bg-white border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-600 transition-all">Quay lại trang chủ</Link>
              </div>
            )}

            {/* Simple Pagination */}
            {posts.length > 12 && (
              <div className="pt-10 border-t border-slate-100 flex justify-center">
                <button className="px-12 py-5 bg-white border-2 border-slate-100 hover:border-emerald-600 hover:text-emerald-600 text-sm font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-sm">Xem thêm bài viết</button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-96">
            <Sidebar tags={tags} popularPosts={popularPosts} />
          </div>
        </div>
      </div>
    </div>
  );
}
