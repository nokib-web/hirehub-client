'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { IJob } from '@/types/job';
import JobCard from '@/components/jobs/JobCard';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import { BookmarkMinus } from 'lucide-react';

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState<IJob[]>([]);

  useEffect(() => {
    // Read from localStorage initially
    const saved = localStorage.getItem('hirehub_saved_jobs');
    if (saved) {
      setSavedJobs(JSON.parse(saved));
    }
  }, []);

  const handleRemove = (id: string) => {
    const newSaved = savedJobs.filter(job => job._id !== id);
    setSavedJobs(newSaved);
    localStorage.setItem('hirehub_saved_jobs', JSON.stringify(newSaved));
  };

  return (
    <ProtectedRoute allowedRoles={['jobseeker']}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-foreground">Saved Jobs</h1>
          <p className="text-muted-foreground font-medium mt-1">
            Jobs you&apos;ve pinned to review later.
          </p>
        </div>

        {savedJobs.length === 0 ? (
          <div className="w-full p-16 bg-card border border-dashed border-border/60 rounded-3xl flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-6">
              <BookmarkMinus className="w-12 h-12 text-muted-foreground/40" />
            </div>
            <h3 className="text-2xl font-black text-foreground mb-2">No saved jobs</h3>
            <p className="text-muted-foreground max-w-sm mb-8 font-medium">
              You haven&apos;t saved any jobs yet. When you find a job you like, click the bookmark icon to save it here.
            </p>
            <Button onClick={() => window.location.href='/jobs'} className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
              Browse Jobs
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {savedJobs.map((job, idx) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative group"
                >
                  <JobCard job={job} />
                  <button 
                    onClick={(e) => { e.preventDefault(); handleRemove(job._id || ''); }}
                    className="absolute top-4 right-14 p-2 bg-rose-100 text-rose-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-200 shadow-sm z-20"
                    title="Remove from saved"
                  >
                    <BookmarkMinus className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
