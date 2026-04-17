import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, baseUrl }) => {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    const url = new URL(baseUrl, 'https://ngoanxinhyeu.app');
    url.searchParams.set('page', page.toString());
    return url.pathname + url.search;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
      <Link
        href={currentPage > 1 ? getPageUrl(currentPage - 1) : '#'}
        className={clsx(
          "p-3 rounded-xl border border-slate-100 transition-all active:scale-95",
          currentPage > 1 ? "bg-white text-slate-900 hover:border-emerald-500 hover:text-emerald-600 shadow-sm" : "bg-slate-50 text-slate-300 pointer-events-none"
        )}
        aria-disabled={currentPage <= 1}
      >
        <ChevronLeft className="w-5 h-5" />
      </Link>

      <div className="flex items-center gap-1.5">
        {pages.map((page) => (
          <Link
            key={page}
            href={getPageUrl(page)}
            className={clsx(
              "w-11 h-11 flex items-center justify-center rounded-xl text-sm font-black transition-all active:scale-95",
              currentPage === page
                ? "bg-primary text-white shadow-lg shadow-emerald-500/20"
                : "bg-white text-slate-500 border border-slate-100 hover:border-emerald-500 hover:text-emerald-600 shadow-sm"
            )}
          >
            {page}
          </Link>
        ))}
      </div>

      <Link
        href={currentPage < totalPages ? getPageUrl(currentPage + 1) : '#'}
        className={clsx(
          "p-3 rounded-xl border border-slate-100 transition-all active:scale-95",
          currentPage < totalPages ? "bg-white text-slate-900 hover:border-emerald-500 hover:text-emerald-600 shadow-sm" : "bg-slate-50 text-slate-300 pointer-events-none"
        )}
        aria-disabled={currentPage >= totalPages}
      >
        <ChevronRight className="w-5 h-5" />
      </Link>
    </nav>
  );
};
