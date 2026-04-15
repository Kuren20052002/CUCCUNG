'use client';

import { Search, ArrowUpDown, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export function PostFilters({ 
  initialQuery = "", 
  initialSort = "desc",
  initialStatus = "all"
}: { 
  initialQuery?: string; 
  initialSort?: string;
  initialStatus?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    params.set("page", "1");
    
    startTransition(() => {
      router.push(`/admin/posts?${params.toString()}`);
    });
  };

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", newSort);
    params.set("page", "1");
    
    startTransition(() => {
      router.push(`/admin/posts?${params.toString()}`);
    });
  };

  const handleStatusChange = (newStatus: string) => {
    const params = new URLSearchParams(searchParams);
    if (newStatus === "all") {
      params.delete("status");
    } else {
      params.set("status", newStatus);
    }
    params.set("page", "1");
    
    startTransition(() => {
      router.push(`/admin/posts?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setQuery("");
    router.push('/admin/posts');
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
      <form onSubmit={handleSearch} className="relative flex-1 w-full group">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isPending ? 'text-pink-300' : 'text-slate-400 group-focus-within:text-pink-500'}`} />
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm bài viết theo tiêu đề..."
          className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-none rounded-2xl text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-pink-500/20 focus:bg-white transition-all outline-none"
        />
        {query && (
          <button 
            type="button"
            onClick={() => { setQuery(""); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="flex-1 md:flex-none relative">
          <select 
            value={initialStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full md:w-40 appearance-none pl-10 pr-10 py-3.5 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold focus:ring-2 focus:ring-pink-500/20 focus:bg-white transition-all outline-none cursor-pointer"
          >
            <option value="all">Tất cả bài</option>
            <option value="published">Công khai</option>
            <option value="draft">Bản nháp</option>
          </select>
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none">
            <div className={`w-2 h-2 rounded-full ${initialStatus === 'published' ? 'bg-emerald-500' : initialStatus === 'draft' ? 'bg-amber-500' : 'bg-slate-300'}`} />
          </div>
        </div>

        <div className="flex-1 md:flex-none relative">
          <select 
            value={initialSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full md:w-48 appearance-none pl-10 pr-10 py-3.5 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold focus:ring-2 focus:ring-pink-500/20 focus:bg-white transition-all outline-none cursor-pointer"
          >
            <option value="desc">Mới nhất trước</option>
            <option value="asc">Cũ nhất trước</option>
          </select>
          <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        
        {(initialQuery || initialSort !== 'desc') && (
           <button 
           onClick={clearFilters}
           className="px-4 py-3.5 text-slate-400 hover:text-pink-500 hover:bg-pink-50 rounded-2xl transition-all"
           title="Xóa bộ lọc"
         >
           <X className="w-5 h-5" />
         </button>
        )}
      </div>
    </div>
  );
}
