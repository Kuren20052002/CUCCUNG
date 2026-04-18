"use client";

import React, { Suspense } from 'react';
import { Search } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

interface SearchInputProps {
  categorySlug?: string;
}

function SearchInput({ categorySlug }: SearchInputProps) {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('q')?.toString().trim();
    const category = formData.get('category')?.toString().trim();

    let url = `/search?q=${encodeURIComponent(query || '')}`;
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }
    router.push(url);
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <input
        type="text"
        name="q"
        defaultValue={q}
        placeholder={categorySlug ? `Tìm trong danh mục...` : "Bạn đang tìm gì..."}
        className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all placeholder:text-slate-400 text-slate-900 group-hover:border-slate-200"
      />
      {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
      <button type="submit" aria-label="Tìm kiếm bài viết" className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-xl shadow-lg active:scale-90 transition-transform">
        <Search className="w-4 h-4" />
      </button>
    </form>
  );
}

export function SearchWidget({ categorySlug }: { categorySlug?: string }) {
  return (
    <Suspense fallback={
      <div className="relative group">
        <input
          type="text"
          disabled
          placeholder="Đang tải..."
          className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all placeholder:text-slate-400 text-slate-900 group-hover:border-slate-200"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-slate-300 text-white rounded-xl shadow-lg">
          <Search className="w-4 h-4" />
        </div>
      </div>
    }>
      <SearchInput categorySlug={categorySlug} />
    </Suspense>
  );
}
