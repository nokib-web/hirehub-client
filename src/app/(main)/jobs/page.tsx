'use client';

import React, { useState } from 'react';
import { Filter, LayoutGrid, List, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import Filters from '@/components/jobs/Filters';
import JobCard from '@/components/jobs/JobCard';
import JobSkeleton from '@/components/jobs/JobSkeleton';
import { useJobs } from '@/hooks/useJobs';
import Button from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export default function JobsPage() {
  const { data, isLoading, isError } = useJobs();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const jobs = data?.jobs || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.page || 1;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
          <Inbox className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Error loading jobs</h3>
        <p className="text-muted-foreground mt-2 max-w-xs">
          Something went wrong while fetching job listings. Please try again later.
        </p>
        <Button onClick={() => window.location.reload()} className="mt-6">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-[280px] sticky top-24 self-start">
          <Filters />
        </aside>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between mb-4 bg-card p-3 rounded-xl border border-border shadow-sm">
          <Button 
            variant="outline" 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 h-10 w-full justify-center"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {isFilterOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFilterOpen(false)}
                className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-80 bg-background z-50 lg:hidden shadow-2xl p-6 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold">Filters</h3>
                  <Button variant="ghost" size="sm" onClick={() => setIsFilterOpen(false)}>
                    Close
                  </Button>
                </div>
                <Filters />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 space-y-6">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/50 p-4 rounded-xl border border-border backdrop-blur-sm">
            <div className="space-y-0.5">
              <h2 className="text-lg font-bold text-foreground">
                {isLoading ? 'Finding jobs...' : `Showing ${jobs.length} of ${total} jobs`}
              </h2>
              {jobs.length > 0 && !isLoading && (
                <p className="text-xs text-muted-foreground font-medium">
                  Matches based on your preferences
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="flex items-center bg-muted rounded-lg p-1 border border-border">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              <select className="bg-background border border-border rounded-lg text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-primary h-10 font-medium cursor-pointer min-w-[140px]">
                <option>Newest First</option>
                <option>Salary (High to Low)</option>
                <option>Most Applied</option>
                <option>Relevant</option>
              </select>
            </div>
          </div>

          {/* Job List/Grid */}
          <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <JobSkeleton key={i} />
              ))
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-2xl border border-dashed border-border/60 mt-4">
                <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-6">
                  <Inbox className="w-10 h-10 text-muted-foreground/40" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No jobs found</h3>
                <p className="text-muted-foreground max-w-sm mb-6">
                  We couldn&apos;t find any jobs matching your current filter criteria. Try adjusting your filters or clearing them.
                </p>
                <Button onClick={() => window.location.href='/jobs'} variant="outline" className="px-6">
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && !isLoading && (
            <div className="flex items-center justify-center gap-2 pt-10">
              <Button variant="outline" size="sm" className="w-10 h-10 p-0" disabled={currentPage === 1}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button 
                  key={i} 
                  variant={currentPage === i + 1 ? 'primary' : 'outline'}
                  size="sm"
                  className="w-10 h-10 p-0 font-medium"
                >
                  {i + 1}
                </Button>
              ))}
              <Button variant="outline" size="sm" className="w-10 h-10 p-0" disabled={currentPage === totalPages}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
