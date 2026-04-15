import React from 'react';
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { BlogCard } from "@/app/components/public/BlogCard";
import { Sidebar } from "@/app/components/public/Sidebar";
import { ArrowRight, Sparkles, Zap, ShieldCheck } from "lucide-react";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: {
      category: true,
      author: {
        select: { name: true, avatar: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 9
  });

  const popularPosts = await prisma.post.findMany({
    where: { published: true },
    select: { id: true, title: true, slug: true, category: true, createdAt: true },
    orderBy: { createdAt: 'desc' }, // Should use views in real app
    take: 5
  });

  const tags = await prisma.tag.findMany({
    take: 12
  });

  return (
    <div className="space-y-20 pb-20 font-sans">
      {/* Hero Section */}
      <section className="relative pt-10 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in-down">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100/50">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest leading-none">Cộng đồng Mẹ & Bé thông thái</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight">
                Hành trình <span className="text-primary relative inline-block">nuôi con<span className="absolute bottom-2 left-0 w-full h-3 bg-emerald-500/20 -z-10" /></span> tuyệt vời bắt đầu từ đây.
              </h1>

              <p className="text-lg text-slate-500 leading-relaxed max-w-xl font-medium">
                Khám phá kho kiến thức khoa học về Thai kỳ, Sinh con, Ăn dặm và Nuôi dạy con được chia sẻ bởi các chuyên gia hàng đầu.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href="/posts"
                  className="w-full sm:w-auto px-10 py-5 bg-primary hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-widest rounded-[2rem] transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-3 active:scale-95 group"
                >
                  Khám phá bài viết <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-md">
                      <Image src={`https://i.pravatar.cc/150?u=mom${i}`} alt="Avatar" width={48} height={48} />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-primary flex items-center justify-center text-xs font-black text-white shadow-xl">
                    +2k
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Nội dung đã kiểm duyệt</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-secondary" />
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Cập nhật hàng ngày</span>
                </div>
              </div>
            </div>

            <div className="relative group animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-secondary/10 rounded-[3rem] blur-3xl group-hover:scale-110 transition-transform duration-1000" />
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group-hover:rotate-1 transition-all duration-700">
                <Image
                  src="/hero-mom-baby.png"
                  alt="Mother and Baby"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  priority
                />
              </div>
              {/* Floating Card - Có thể thêm nếu có bài viết*/}
              {/* <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-50 space-y-3 max-w-[240px] animate-bounce-slow">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-slate-900 leading-tight">Mẹo ăn dặm khoa học cho bé từ 6 tháng</h3>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đọc trong 3 phút</div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Blog Feed */}
          <section className="flex-1 space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
              <div className="space-y-2">
                <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Cẩm nang mới nhất</h2>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">Dành riêng cho bạn và bé.</h3>
              </div>
              <Link href="/posts" className="text-sm font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest flex items-center gap-2 group transition-all">
                Tất cả bài viết <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1" />
              </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {/* CTA Mid-page */}
            <div className="bg-slate-900 rounded-[3rem] p-10 lg:p-16 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-6">
                  <h3 className="text-3xl lg:text-4xl font-black text-white leading-tight underline decoration-emerald-500/30">Bạn đã sẵn sàng chuẩn bị cho thiên thần nhỏ?</h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">Tải xuống ngay bộ checklist chuẩn bị đồ đi sinh đầy đủ & chi tiết nhất hoàn toàn miễn phí từ ngoanxinhyeu.</p>
                  <button className="px-8 py-4 bg-white text-slate-900 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-xl active:scale-95">Tải về ngay</button>
                </div>
                <div className="hidden lg:block relative aspect-video rounded-3xl overflow-hidden border-4 border-slate-800 rotate-2">
                  <Image src="/checklist-mockup.webp" alt="Checklist Mockup" fill className="object-cover" sizes="(max-width: 768px) 100vw, 800px" />
                </div>
              </div>
            </div>
          </section>

          {/* Sidebar Area */}
          <div className="lg:w-96">
            <Sidebar tags={tags} popularPosts={popularPosts} />
          </div>
        </div>
      </div>
    </div>
  );
}
