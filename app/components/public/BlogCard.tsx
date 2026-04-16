import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
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

  // Safe reading time fallback
  const readingTime = post.readingTime || 5;

  return (
    <article className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
      
      {/* Tag & Image (Floating Overlay) */}
      <div className="relative aspect-video overflow-hidden">
        <Link href={`/${post.category?.slug || 'uncategorized'}/${post.slug}`} className="block h-full">
          <Image
            src={post.metaImage || '/placeholder-post.jpg'}
            alt={post.featuredImageAlt || post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        {post.category && (
           <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
              <span className="bg-emerald-600/90 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg backdrop-blur-md shadow-lg flex items-center">
                {post.category.name}
              </span>
           </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        {/* Visual Hierarchy: Metadata Row above Title */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 font-medium">
           <span className="text-slate-900">{post.author.name || 'Đội ngũ chuyên gia'}</span>
           <span className="text-slate-300">•</span>
           <span>{formatDate(post.createdAt)}</span>
        </div>

        <Link href={`/${post.category?.slug || 'uncategorized'}/${post.slug}`}>
          <h2 className="text-xl font-bold text-slate-900 leading-snug mb-3 group-hover:text-emerald-600 transition-colors line-clamp-3 text-balance">
            {post.title}
          </h2>
        </Link>
        
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-6 flex-grow">
          {post.metaDescription || post.excerpt || 'Kiến thức và kinh nghiệm thực tế về chăm sóc mẹ và bé từ ngoanxinhyeu.'}
        </p>

        {/* Footer Area */}
        <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
            <Link 
              href={`/${post.category?.slug || 'uncategorized'}/${post.slug}`}
              className="text-sm font-bold text-slate-900 hover:text-emerald-600 transition-colors flex items-center gap-2 group/btn"
            >
              Đọc bài viết 
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
            
            <div className="text-xs text-slate-400 font-medium">
              {readingTime} phút đọc
            </div>
        </div>
      </div>
    </article>
  );
};
