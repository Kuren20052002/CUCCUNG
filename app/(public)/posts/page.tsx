import React from 'react';
import prisma from "@/lib/prisma";
import { BlogCard } from "@/app/components/public/BlogCard";
import { Sidebar } from "@/app/components/public/Sidebar";
import Link from 'next/link';
import { LayoutGrid, ScrollText, ChevronRight } from 'lucide-react';

export default async function PostsPage() {
  // Fetch all posts
  const posts = await prisma.post.findMany({
    where: { published: true },
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
      {/* Archive Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 p-12 lg:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden group border-b-4 border-emerald-500">
           {/* Decorative Background Icon */}
           <div className="absolute -bottom-10 -right-10 opacity-5 transform group-hover:scale-110 transition-transform duration-1000 rotate-12">
              <ScrollText className="w-64 h-64 text-white" />
           </div>

           <div className="relative z-10 max-w-2xl space-y-6">
              <nav className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-4 inline-flex">
                 <Link href="/" className="hover:text-emerald-400 transition-colors">TRANG CHỦ</Link>
                 <ChevronRight className="w-3 h-3 text-slate-700" />
                 <span className="text-emerald-400">TẤT CẢ BÀI VIẾT</span>
              </nav>

              <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight">
                Kho lưu trữ<span className="text-emerald-500">.</span>
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed font-medium">
                Duyệt qua tất cả các bài viết của chúng tôi về chủ đề làm mẹ, nuôi dạy con cái và các bài đánh giá sản phẩm hữu ích.
              </p>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {posts.map((post: any) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {posts.length === 0 && (
                <div className="p-20 bg-slate-50 rounded-[3rem] text-center space-y-4">
                    <ScrollText className="w-16 h-16 text-slate-200 mx-auto" />
                    <h2 className="text-xl font-black text-slate-400 tracking-tight">Chưa có bài viết nào được xuất bản.</h2>
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