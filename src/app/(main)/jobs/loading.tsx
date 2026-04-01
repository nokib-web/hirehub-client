'use client';

import React from 'react';
import JobSkeleton from '@/components/jobs/JobSkeleton';

export default function JobsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters Skeleton */}
        <aside className="hidden lg:block w-[280px] sticky top-24 self-start">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-8 animate-pulse">
            <div className="space-y-4">
              <div className="h-6 w-32 bg-muted rounded-md" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded-md" />
                <div className="h-4 w-full bg-muted rounded-md" />
                <div className="h-4 w-3/4 bg-muted rounded-md" />
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="h-6 w-24 bg-muted rounded-md" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-10 bg-muted rounded-lg" />
                <div className="h-10 bg-muted rounded-lg" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area Skeleton */}
        <main className="flex-1 space-y-6">
          {/* Top Bar Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/50 p-4 rounded-xl border border-border animate-pulse">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-muted rounded-md" />
              <div className="h-4 w-32 bg-muted rounded-md" />
            </div>
            <div className="h-10 w-40 bg-muted rounded-lg" />
          </div>

          {/* Wakeup Message */}
          <div className="flex flex-col items-center justify-center py-10 text-center bg-primary/5 rounded-2xl border border-primary/10 mb-6 animate-pulse">
            <p className="text-primary font-bold text-lg mb-2">Waking up server, please wait a moment...</p>
            <p className="text-muted-foreground text-sm">Free tier servers sleep after inactivity. This may take 30-50 seconds.</p>
          </div>

          {/* Job List Skeletons */}
          <div className="grid grid-cols-1 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <JobSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
