import React from 'react';

export const BlogCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden flex flex-col sm:flex-row h-full animate-pulse">
      {/* Image Section Skeleton */}
      <div className="w-full sm:w-[35%] lg:w-[30%] aspect-video sm:aspect-auto bg-slate-200" />

      {/* Content Section Skeleton */}
      <div className="p-6 sm:p-8 flex flex-col flex-1 relative">
        <div className="w-16 h-6 bg-slate-100 rounded-lg mb-2.5" />
        
        <div className="flex items-center gap-2 space-y-0 mb-4">
          <div className="h-2 w-20 bg-slate-200 rounded" />
          <div className="h-2 w-2 bg-slate-200 rounded-full" />
          <div className="h-2 w-24 bg-slate-200 rounded" />
        </div>

        <div className="space-y-2">
          <div className="h-6 w-full bg-slate-200 rounded-lg" />
          <div className="h-6 w-4/5 bg-slate-200 rounded-lg" />
        </div>
        
        <div className="space-y-2 flex-grow">
          <div className="h-4 w-full bg-slate-100 rounded" />
          <div className="h-4 w-11/12 bg-slate-100 rounded" />
        </div>

        {/* Footer Area Skeleton */}
        <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
          <div className="h-3 w-24 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
};
