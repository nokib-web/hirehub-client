'use client';

import React from 'react';
import { useRelatedJobs } from '@/hooks/useJobs';
import JobCard from '@/components/jobs/JobCard';
import { IJob } from '@/types/job';
import { Sparkles } from 'lucide-react';

interface RelatedJobsProps {
  category: string;
  currentJobId: string;
}

export default function RelatedJobs({ category, currentJobId }: RelatedJobsProps) {
  const { data: jobs, isLoading } = useRelatedJobs(category, currentJobId);

  if (isLoading) return (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse mt-8">
        {[1, 2, 3].map(i => (
           <div key={i} className="h-44 bg-muted rounded-2xl border border-border" />
        ))}
     </div>
  );

  const filteredJobs = jobs?.filter(job => job._id !== currentJobId).slice(0, 3) || [];

  if (filteredJobs.length === 0) return null;

  return (
    <div className="pt-24 space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
      <div className="flex items-center justify-between">
         <div className="space-y-1">
            <h2 className="text-3xl font-black text-foreground uppercase tracking-tight">Similar Jobs You Might Like</h2>
            <p className="text-sm font-bold text-muted-foreground uppercase opacity-60">Explore more opportunities in <span className="text-primary">{category}</span></p>
         </div>
         <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6" />
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
           <div key={job._id} className="group hover:translate-y-[-8px] transition-transform duration-500">
              <JobCard job={job} />
           </div>
        ))}
      </div>
    </div>
  );
}
