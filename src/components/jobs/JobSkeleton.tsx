'use client';

import React from 'react';

export default function JobSkeleton() {
  return (
    <div className="bg-card border border-border p-5 rounded-xl shadow-sm animate-pulse">
      <div className="flex flex-col md:flex-row gap-5">
        {/* Company Logo Skeleton */}
        <div className="flex-shrink-0">
          <div className="w-14 h-14 rounded-xl bg-muted" />
        </div>

        {/* Content Skeleton */}
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="h-5 w-48 bg-muted rounded-md" />
              <div className="h-4 w-32 bg-muted rounded-md" />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-4 w-16 bg-muted rounded-md" />
              <div className="h-8 w-8 bg-muted rounded-full" />
            </div>
          </div>

          {/* Details Row Skeleton */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-6">
            <div className="h-4 w-24 bg-muted rounded-md" />
            <div className="h-4 w-24 bg-muted rounded-md" />
            <div className="h-4 w-36 bg-muted rounded-md" />
          </div>

          {/* Skills & Action Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-muted rounded-full" />
              <div className="h-6 w-16 bg-muted rounded-full" />
              <div className="h-6 w-16 bg-muted rounded-full" />
            </div>

            <div className="h-9 w-28 bg-muted rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
