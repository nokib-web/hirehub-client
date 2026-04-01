'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import DataWrapper from '@/components/dashboard/DataWrapper';
import api from '@/lib/axios';
import { IJob } from '@/types';
import JobCard from '@/components/jobs/JobCard';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import { BookmarkMinus, Sparkles, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState<IJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSavedJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const savedIdsString = localStorage.getItem('hirehub_saved_jobs');
      if (!savedIdsString) {
        setSavedJobs([]);
        setIsLoading(false);
        return;
      }

      let savedIds;
      try {
        savedIds = JSON.parse(savedIdsString);
      } catch (e) {
        savedIds = [];
      }

      const ids: string[] = Array.isArray(savedIds) 
        ? savedIds.map((item: string | { _id?: string, id?: string }) => 
            (typeof item === 'string' ? item : item._id || item.id) as string
          ).filter(id => !!id)
        : [];

      if (ids.length === 0) {
        setSavedJobs([]);
        setIsLoading(false);
        return;
      }

      // Fetch each job
      const jobPromises = ids.map(id => 
        api.get(`/jobs/${id}`)
          .then(res => res.data.data)
          .catch(err => {
            console.warn(`Failed to fetch job ${id}`, err);
            return null;
          })
      );
      
      const results = await Promise.all(jobPromises);
      const validJobs: IJob[] = results.filter((job): job is IJob => job !== null);
      
      setSavedJobs(validJobs);
      
      // Sync back only valid IDs to localStorage to keep it clean
      const validIds = validJobs.map(j => j._id || j.id);
      localStorage.setItem('hirehub_saved_jobs', JSON.stringify(validIds));
      
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  const handleRemove = (id: string | undefined) => {
    if (!id) return;
    const newSaved = savedJobs.filter(job => (job._id || job.id) !== id);
    setSavedJobs(newSaved);
    const newIds = newSaved.map(j => j._id || j.id);
    localStorage.setItem('hirehub_saved_jobs', JSON.stringify(newIds));
    toast.success('Opportunity removed from wishlist', {
      icon: '🗑️',
      style: { borderRadius: '1rem', fontWeight: 'bold' }
    });
  };

  return (
    <ProtectedRoute allowedRoles={['jobseeker']}>
       <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-amber-500/20">
                <Sparkles className="w-3 h-3" /> Career Wishlist
              </div>
              <h1 className="text-5xl font-black text-foreground tracking-tight leading-none italic">Saved Opportunities</h1>
              <p className="text-muted-foreground font-medium max-w-lg text-lg">
                Curate your dream career. Keep track of the positions that caught your eye and apply whenever you&apos;re ready.
              </p>
            </div>
            
            <Link href="/jobs">
               <Button className="h-16 px-12 rounded-[2rem] font-black text-sm shadow-2xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all bg-primary hover:bg-primary/90 text-white border-none">
                  Discover More Jobs
               </Button>
            </Link>
          </div>

          <DataWrapper 
            isLoading={isLoading} 
            error={error} 
            retry={fetchSavedJobs}
            loadingMessage="Opening your career vault..."
          >
             {savedJobs.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="w-full p-24 bg-card border border-dashed border-primary/20 rounded-[4rem] flex flex-col items-center justify-center text-center shadow-[0_32px_64px_-12px_rgba(0,0,0,0.05)]"
                >
                  <div className="w-28 h-28 bg-amber-100 dark:bg-amber-950/30 rounded-[2.5rem] flex items-center justify-center mb-10 relative">
                     <div className="absolute inset-0 bg-amber-400/20 rounded-[2.5rem] animate-ping opacity-20" />
                     <BookmarkMinus className="w-14 h-14 text-amber-600/60" />
                  </div>
                  <h3 className="text-3xl font-black text-foreground mb-4">Your vault is currently empty</h3>
                  <p className="text-muted-foreground mb-12 max-w-md text-lg font-medium leading-relaxed">
                    You haven&apos;t saved any jobs yet. Browse our daily updated job board to find your next major career move!
                  </p>
                  <Link href="/jobs">
                    <Button variant="outline" className="h-16 px-14 rounded-[2rem] font-black border-4 border-primary/10 hover:bg-primary/5 transition-all text-sm uppercase tracking-widest">
                      Explore Job Board
                    </Button>
                  </Link>
                </motion.div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20">
                   <AnimatePresence mode="popLayout">
                      {savedJobs.map((job, idx) => (
                        <motion.div
                          key={job._id || job.id}
                          layout
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                          transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.23, 1, 0.32, 1] }}
                          className="relative group"
                        >
                          <JobCard job={job} />
                          <button 
                            onClick={(e) => { e.preventDefault(); handleRemove(job._id || job.id); }}
                            className="absolute top-6 right-6 p-4 bg-rose-500 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-90 shadow-2xl z-30 flex items-center justify-center border-4 border-card group/btn"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                          </button>
                        </motion.div>
                      ))}
                   </AnimatePresence>
                </div>
             )}
          </DataWrapper>
       </div>
    </ProtectedRoute>
  );
}
