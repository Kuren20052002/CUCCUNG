import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import prisma from "@/lib/prisma";
import { User, MessageCircle, Globe, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đội ngũ tác giả - ngoanxinhyeu',
  description: 'Gặp gỡ đội ngũ chuyên gia và các tác giả tâm huyết tại ngoanxinhyeu.app - Những người mang đến kiến thức tin cậy cho Mẹ & Bé.',
};

export default async function AuthorsPage() {
  const authors = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: {
      id: true,
      name: true,
      avatar: true,
      bio: true,
    }
  });

  return (
    <div className="space-y-20 pb-20 font-sans mt-8 lg:mt-16">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-tight">
          Đội ngũ <span className="text-primary italic">tâm huyết</span>.
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
          Những chuyên gia và biên tập viên hàng đầu trong lĩnh vực Mẹ & Bé, cam kết mang đến giá trị thực thực nhất cho cộng đồng.
        </p>
      </section>

      {/* Authors Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {authors.map((author) => (
            <div key={author.id} className="bg-white rounded-[3rem] p-8 lg:p-12 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10 space-y-8">
                    <div className="relative w-32 h-32 mx-auto">
                        <div className="absolute inset-0 bg-primary/10 rounded-[2.5rem] rotate-6 group-hover:rotate-12 transition-transform scale-105" />
                        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl">
                            <Image 
                                src={author.avatar || 'https://i.pravatar.cc/300'} 
                                alt={author.name || 'Author'} 
                                fill 
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors">{author.name}</h2>
                        <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-4 py-1.5 rounded-full inline-block">Chuyên gia nội dung</div>
                    </div>

                    <p className="text-slate-500 text-sm leading-relaxed text-center font-medium line-clamp-4 italic">
                        "{author.bio || 'Chưa cập nhật tiểu sử cho tác giả này.'}"
                    </p>

                    <div className="flex justify-center gap-4 pt-4">
                        <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all"><Globe className="w-4 h-4" /></a>
                        <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-all"><MessageCircle className="w-4 h-4" /></a>
                    </div>

                    <Link href="#" className="flex items-center justify-center gap-2 text-xs font-black text-slate-900 border-t border-slate-50 pt-8 mt-4 group/btn hover:text-primary transition-colors uppercase tracking-widest">
                        Xem bài viết <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
          ))}
        </div>
      </section>

      {/* Join us CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-[3.5rem] p-12 lg:p-24 text-center space-y-8 border-b-8 border-emerald-500">
            <h3 className="text-3xl lg:text-5xl font-black text-white leading-tight underline decoration-emerald-500/20">Bạn muốn trở thành một phần của chúng tôi?</h3>
            <p className="text-slate-400 max-w-xl mx-auto text-sm font-medium leading-relaxed">ngoanxinhyeu luôn chào đón những tâm hồn nhiệt thiện và am hiểu về thế giới Mẹ & Bé.</p>
            <Link href="/contact" className="inline-block px-12 py-5 bg-primary text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-emerald-600 shadow-xl shadow-emerald-500/10 active:scale-95 transition-all">Gửi hồ sơ ngay</Link>
        </div>
      </section>
    </div>
  );
}
