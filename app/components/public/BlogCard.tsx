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
  index?: number;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, index = 0 }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <article className="group bg-white rounded-[2rem] border border-slate-200 overflow-hidden transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col sm:flex-row h-full">
      {/* Image Section */}
      <div className="relative w-full sm:w-[35%] lg:w-[30%] aspect-video sm:aspect-auto overflow-hidden">
        <Link href={`/${post.category?.slug || 'uncategorized'}/${post.slug}`} className="block h-full">
          <Image
            src={post.metaImage || '/placeholder-post.jpg'}
            alt={post.featuredImageAlt || post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 400px"
            loading={index === 0 ? "eager" : "lazy"}
          />
        </Link>
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-5 flex flex-col flex-1 min-w-0 relative">
        {post.category && (
          <div className="mb-2.5">
            <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest bg-emerald-50 py-1.5 rounded-lg border border-emerald-100">
              {post.category.name}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
          <span className="text-slate-900">{post.author.name || 'Đội ngũ chuyên gia'}</span>
          <span aria-hidden="true">•</span>
          <span>{formatDate(post.updatedAt)}</span>
        </div>

        <Link href={`/${post.category?.slug || 'uncategorized'}/${post.slug}`}>
          <h2 className="text-xl lg:text-2xl font-extrabold text-slate-900 leading-tight mb-4 group-hover:text-emerald-600 transition-colors line-clamp-2 text-balance">
            {post.title}
          </h2>
        </Link>

        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-6 flex-grow break-words">
          {post.metaDescription || post.excerpt || 'Kiến thức và kinh nghiệm thực tế về chăm sóc mẹ và bé từ ngoanxinhyeu.'}
        </p>

        {/* Footer Area */}
        <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
          <Link
            href={`/${post.category?.slug || 'uncategorized'}/${post.slug}`}
            className="text-xs font-extrabold text-slate-900 hover:text-emerald-600 uppercase tracking-[0.2em] transition-colors flex items-center gap-2 group/btn"
          >
            Đọc tiếp
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
};
