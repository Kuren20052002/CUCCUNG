'use client';

import React from 'react';

interface SEOLiveFeedbackProps {
  title: string;
  description: string;
}

export const SEOLiveFeedback: React.FC<SEOLiveFeedbackProps> = ({ title, description }) => {
  const titleLength = title.length;
  const descLength = description.length;

  const getTitleStatus = () => {
    if (titleLength === 0) return { label: 'Rỗng', color: 'text-zinc-400' };
    if (titleLength < 50) return { label: 'Quá ngắn', color: 'text-amber-500' };
    if (titleLength >= 50 && titleLength <= 60) return { label: 'Tối ưu', color: 'text-emerald-500' };
    return { label: 'Quá dài', color: 'text-rose-500' };
  };

  const getDescStatus = () => {
    if (descLength === 0) return { label: 'Rỗng', color: 'text-zinc-400' };
    if (descLength < 140) return { label: 'Quá ngắn', color: 'text-amber-500' };
    if (descLength >= 150 && descLength <= 160) return { label: 'Tối ưu', color: 'text-emerald-500' };
    return { label: 'Tốt', color: 'text-emerald-400' };
  };

  const titleStatus = getTitleStatus();
  const descStatus = getDescStatus();

  return (
    <div className="space-y-4 p-5 bg-emerald-50/30 rounded-2xl border border-emerald-100/50">
      <h3 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        Real-time SEO Analysis
      </h3>
      
      <div className="space-y-5">
        {/* Meta Title Feedback */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meta Title</span>
            <span className={`text-[10px] font-black tabular-nums ${titleStatus.color.replace('text-rose-500', 'text-rose-600').replace('text-emerald-500', 'text-emerald-600').replace('text-amber-500', 'text-amber-600')}`}>
              {titleLength} / 60
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                titleLength > 60 ? 'bg-rose-500' : 
                titleLength >= 50 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min((titleLength / 60) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Meta Description Feedback */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meta Description</span>
            <span className={`text-[10px] font-black tabular-nums ${descStatus.color.replace('text-rose-500', 'text-rose-600').replace('text-emerald-500', 'text-emerald-600').replace('text-amber-500', 'text-amber-600')}`}>
              {descLength} / 160
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                descLength > 160 ? 'bg-rose-500' : 
                descLength >= 150 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min((descLength / 160) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-emerald-100/50">
        <p className="text-[9px] text-emerald-700/70 font-medium leading-relaxed italic">
          * Đạt chỉ số "Tối ưu" giúp tăng tỷ lệ nhấp chuột (CTR) tự nhiên từ người dùng Google.
        </p>
      </div>
    </div>
  );
};
