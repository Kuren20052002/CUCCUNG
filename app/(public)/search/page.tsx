import React from 'react';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { BlogCard } from '@/app/components/public/BlogCard';
import { SearchX, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Sidebar } from '@/app/components/public/Sidebar';

export const metadata: Metadata = {
  title: 'Kết quả tìm kiếm',
  robots: 'noindex, follow',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { q, category } = await searchParams;
  const query = typeof q === 'string' ? q : '';
  const categorySlug = typeof category === 'string' ? category : undefined;

  // fetch active category details
  const activeCategory = categorySlug ? await prisma.category.findUnique({
    where: { slug: categorySlug }
  }) : null;

  // fetch posts with combined filters
  const where: any = {
    published: true,
  };

  if (query || categorySlug) {
    const and: any[] = [];
    
    if (query) {
      and.push({
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { excerpt: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ]
      });
    }

    if (categorySlug) {
      and.push({
        category: { slug: categorySlug }
      });
    }

    where.AND = and;
  }

  const posts = (query || categorySlug) ? await prisma.post.findMany({
    where,
    include: {
      category: true,
      author: { select: { name: true, avatar: true } }
    },
    orderBy: { updatedAt: 'desc' }
  }) : [];

  // fetch tags and popular posts for sidebar
  const tagsList = await prisma.tag.findMany({ take: 12 });
  const popularPosts = await prisma.post.findMany({
    where: { published: true },
    select: { id: true, title: true, slug: true, category: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
    take: 5
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans mt-8 lg:mt-12">
      <div className="flex flex-col lg:flex-row gap-16">
        <main className="flex-1 space-y-12 min-w-0">
          <div className="space-y-6 border-b border-slate-100 pb-8">
             <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 w-fit px-4 py-2 rounded-full">
                <Link href="/" className="hover:text-emerald-600 transition-colors">TRANG CHỦ</Link>
                <ChevronRight className="w-3 h-3 text-emerald-300" />
                <span className="text-emerald-600">TÌM KIẾM</span>
            </nav>
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {query ? (
                  <>Kết quả cho: <span className="text-emerald-600">&quot;{query}&quot;</span></>
                ) : categorySlug ? (
                  <>Các bài viết trong chủ đề: <span className="text-emerald-600">&quot;{activeCategory?.name}&quot;</span></>
                ) : (
                  <>Tìm kiếm bài viết</>
                )}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3">
                {activeCategory && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100 shadow-sm animate-fade-in">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Đang tìm trong: <span className="font-black underline">{activeCategory.name}</span>
                    <Link href={`/search?q=${query}`} className="ml-1 text-[10px] bg-emerald-200/50 hover:bg-emerald-200 px-1.5 py-0.5 rounded-md transition-colors" title="Bỏ lọc danh mục">
                      X
                    </Link>
                  </div>
                )}
                {(query || categorySlug) && (
                  <p className="text-sm text-slate-500 font-bold tracking-tight">Tìm thấy {posts.length} bài viết.</p>
                )}
              </div>
            </div>
          </div>

          {!query && !categorySlug ? (
             <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                  <SearchX className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">Vui lòng nhập từ khóa</h2>
                <p className="text-slate-500 font-medium max-w-md">Hãy nhập từ khóa vào ô tìm kiếm để tìm các bài viết phù hợp.</p>
             </div>
          ) : posts.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                  <SearchX className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">Không tìm thấy bài viết</h2>
                <p className="text-slate-500 font-medium max-w-md mb-6">Chúng tôi không thể tìm thấy bài viết nào phù hợp với yêu cầu của bạn.</p>
                {activeCategory && (
                  <Link href={`/search?q=${query}`} className="px-6 py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"> Thử tìm trong tất cả danh mục</Link>
                )}
             </div>
          ) : (
            <div className="flex flex-col gap-8">
              {posts.map((post, index) => (
                <BlogCard key={post.id} post={post as any} index={index} />
              ))}
            </div>
          )}
        </main>

        <aside className="lg:w-96 shrink-0">
          <div className="sticky top-24">
            <Sidebar tags={tagsList} popularPosts={popularPosts as any} activeCategorySlug={categorySlug} />
          </div>
        </aside>
      </div>
    </div>
  );
}
