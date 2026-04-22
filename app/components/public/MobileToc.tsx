"use client";

import React, { useState } from 'react';
import { List, X } from 'lucide-react';
import Link from 'next/link';

import type { TocItem } from './TableOfContents';

export function MobileToc({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false);

  if (!items || items.length < 2) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-6 z-[70] bg-emerald-600 text-white p-3 rounded-2xl shadow-lg flex items-center gap-2 lg:hidden"
        aria-label="Mục lục"
      >
        <List className="w-4 h-4" />
        <span className="text-xs font-black uppercase">Nội dung</span>
      </button>

      <div
        className={`fixed inset-0 z-[80] lg:hidden transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />

        <aside className={`absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-6 transform transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black">Mục lục</h3>
            <button onClick={() => setOpen(false)} aria-label="Đóng" className="p-2 rounded-full hover:bg-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-3 overflow-y-auto max-h-[70vh]">
            {items.map((item) => (
              <Link key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)} className={`${item.level === 3 ? 'pl-6 text-sm' : 'text-base font-bold'}`}>
                {item.text}
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </>
  );
}

export default MobileToc;
