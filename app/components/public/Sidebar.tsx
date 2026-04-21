import React from "react";
import Link from "next/link";
import { Search, TrendingUp, Tags, Mail, ArrowRight } from "lucide-react";
import { SearchWidget } from "./SearchWidget";

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface PopularPost {
  id: string;
  title: string;
  slug: string;
  category: { slug: string } | null;
  createdAt: Date;
}

interface SidebarProps {
  tags: Tag[];
  popularPosts: PopularPost[];
  activeCategorySlug?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ tags, popularPosts, activeCategorySlug }) => {
  return (
    <aside className="space-y-12 h-fit pb-10 lg:sticky lg:top-24 lg:self-start sidebar-sticky">
      {/* Search Widget */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm shadow-slate-200/50">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <Search className="w-4 h-4 text-primary" />
          Tìm kiếm bài viết
        </h3>
        <SearchWidget categorySlug={activeCategorySlug} />
      </div>

      {/* Popular Posts Widget */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm shadow-slate-200/50">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-secondary" />
          Xem nhiều nhất
        </h3>
        <div className="space-y-6">
          {popularPosts.map((post, idx) => (
            <Link
              key={post.id}
              href={`/${post.category?.slug || 'uncategorized'}/${post.slug}`}
              className="flex items-start gap-4 group"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                0{idx + 1}
              </div>
              <div className="space-y-1 py-1">
                <h4 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  {post.createdAt.getFullYear()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter Widget */}
      {/* <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />

        <div className="relative z-10 space-y-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-lg group-hover:scale-110 transition-transform duration-500">
            <Mail className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-black text-slate-900 leading-tight">Mẹo nuôi con khỏe mạnh</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Đăng ký nhận cẩm nang chăm sóc trẻ từ chuyên gia mỗi tuần.</p>
          </div>
          <Link
            href="#newsletter"
            className="block w-full py-4 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-2xl text-center shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Đăng ký ngay <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div> */}

      {/* Tags Widget */}
      {/* <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm shadow-slate-200/50 sticky top-24">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
           <Tags className="w-4 h-4 text-emerald-500" />
           Từ khóa phổ biến
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="px-4 py-2 bg-slate-50 hover:bg-emerald-600 border border-slate-100 hover:border-emerald-600 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-sm"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      </div> */}
    </aside>
  );
};
