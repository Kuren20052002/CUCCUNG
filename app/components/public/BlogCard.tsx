import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Post, Category } from "@prisma/client";

interface PostWithRelations extends Post {
  category: Category | null;
  author: { name: string | null; avatar: string | null };
}

interface BlogCardProps {
  post: PostWithRelations;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <article className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full border-t-0 border-l-0 border-r-0 border-b-0">
      {/* Dynamic Border Gradient on Hover */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <Link href={`/${post.category?.slug || 'uncategorized'}/${post.slug}`} className="relative block aspect-video overflow-hidden">
        <Image
          src={post.metaImage || '/placeholder-post.jpg'}
          alt={post.featuredImageAlt || post.title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Category Badge */}
        {post.category && (
          <div className="absolute top-5 left-5">
            <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.1em] px-4 py-2 rounded-xl shadow-lg">
              {post.category.name}
            </span>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/20 transition-colors duration-500 flex items-center justify-center">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 shadow-xl">
                 <ArrowRight className="w-5 h-5" />
             </div>
        </div>
      </Link>

      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center space-x-4 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           <div className="flex items-center space-x-1.5">
             <User className="w-3.5 h-3.5 text-emerald-500" />
             <span>{post.author.name || 'Admin'}</span>
           </div>
           <div className="flex items-center space-x-1.5">
             <Calendar className="w-3.5 h-3.5 text-secondary" />
             <span>{formatDate(post.createdAt)}</span>
           </div>
        </div>

        <Link href={`/${post.category?.slug || 'uncategorized'}/${post.slug}`}>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>
        
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
          {post.excerpt || 'Đang cập nhật nội dung cho bài viết này...'}
        </p>

        <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
           <Link 
            href={`/${post.category?.slug || 'uncategorized'}/${post.slug}`}
            className="text-xs font-black text-slate-800 uppercase tracking-widest hover:text-primary transition-colors flex items-center group/link"
           >
             Đọc bài viết 
             <ArrowRight className="w-4 h-4 ml-2 transform group-hover/link:translate-x-1 transition-transform" />
           </Link>
           
           <div className="text-[10px] font-bold text-slate-300">
             {post.readingTime || '5'} PHÚT ĐỌC
           </div>
        </div>
      </div>
    </article>
  );
};
