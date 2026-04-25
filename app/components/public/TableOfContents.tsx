"use client";

import Link from 'next/link';
import { List } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length < 2) return null;

  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll('h2[id], h3[id]')) as HTMLElement[];
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    headings.forEach(h => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-emerald-50/50 md:backdrop-blur-md rounded-[2.5rem] p-6 lg:p-8 border border-slate-100 mb-12 shadow-sm ring-1 ring-slate-200/50 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />

      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center shadow-inner ring-1 ring-emerald-500/20">
          <List className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
            Mục lục nội dung
          </h2>
          <div className="h-0.5 w-8 bg-emerald-500/30 mt-1 rounded-full" />
        </div>
      </div>

      <nav className="flex flex-col gap-1 relative z-10">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <Link
              key={item.id}
              href={`#${item.id}`}
              className={`group flex items-start gap-3 py-1.5 transition-all duration-300 hover:translate-x-1 ${item.level === 3
                  ? 'ml-8 text-xs font-semibold text-slate-500 hover:text-emerald-500'
                  : 'text-sm font-bold text-slate-800 hover:text-emerald-600'
                }`}
              aria-current={isActive ? 'true' : undefined}
            >
              <span className={`mt-1.5 w-2 h-2 rounded-full transition-all duration-300 ${isActive
                  ? 'bg-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.25)] scale-110'
                  : item.level === 3
                    ? 'bg-slate-300 group-hover:bg-emerald-400'
                    : 'bg-emerald-500/30 group-hover:bg-emerald-500'
                }`} />
              <span className={`flex-1 leading-relaxed ${isActive ? 'text-emerald-600' : ''}`}>{item.text}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
