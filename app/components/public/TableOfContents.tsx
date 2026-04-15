import Link from 'next/link';
import { List } from 'lucide-react';

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

  return (
    <div className="bg-gradient-to-br from-slate-50/90 to-emerald-50/30 backdrop-blur-md rounded-[2.5rem] p-8 lg:p-10 border border-slate-100 mb-12 shadow-sm ring-1 ring-slate-200/50 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
      
      <div className="flex items-center gap-4 mb-8 relative z-10">
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
        {items.map((item) => (
          <Link
            key={item.id}
            href={`#${item.id}`}
            className={`
              group flex items-start gap-3 py-1.5 transition-all duration-300
              hover:translate-x-1
              ${item.level === 3 
                ? 'ml-8 text-xs font-semibold text-slate-500 hover:text-emerald-500' 
                : 'text-sm font-bold text-slate-800 hover:text-emerald-600'
              }
            `}
          >
            <span className={`
              mt-1.5 w-1.5 h-1.5 rounded-full transition-all duration-300
              group-hover:scale-125
              ${item.level === 3 
                ? 'bg-slate-300 group-hover:bg-emerald-400' 
                : 'bg-emerald-500/30 group-hover:bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
              }
            `} />
            <span className="flex-1 leading-relaxed">{item.text}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
