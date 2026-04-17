import React from 'react';
import { BlogCardSkeleton } from "@/app/components/public/BlogCardSkeleton";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-16 pb-20">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Main Content Skeleton */}
        <div className="flex-1 space-y-12">
          {/* Header Skeleton */}
          <div className="space-y-4 border-b border-slate-100 pb-8">
            <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
            <div className="h-10 w-2/3 bg-slate-100 rounded-lg animate-pulse" />
          </div>

          {/* Blog Feed Skeleton */}
          <div className="flex flex-col gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Sidebar Skeleton Placeholder */}
        <div className="hidden lg:block lg:w-96 space-y-10">
          <div className="h-96 bg-slate-50 rounded-[2rem] animate-pulse" />
          <div className="h-64 bg-slate-50 rounded-[2rem] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
