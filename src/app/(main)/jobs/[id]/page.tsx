'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useJob } from '@/hooks/useJobs';
import JobHeader from '@/components/jobs/detail/JobHeader';
import JobTabs from '@/components/jobs/detail/JobTabs';
import Sidebar from '@/components/jobs/detail/Sidebar';
import ApplicationModal from '@/components/jobs/detail/ApplicationModal';
import RelatedJobs from '@/components/jobs/detail/RelatedJobs';
import { Loader2, Inbox, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: job, isLoading, isError } = useJob(id as string);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs animate-pulse">Loading Job Details...</p>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 bg-card border border-border/40 rounded-3xl max-w-lg mx-auto mt-20 shadow-2xl">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center text-red-600 mb-6 scale-110">
          <Inbox className="w-10 h-10" />
        </div>
        <h3 className="text-3xl font-black text-foreground mb-3 leading-tight uppercase tracking-tight">Oops! Job not found</h3>
        <p className="text-muted-foreground max-w-sm mb-8 text-base font-medium leading-relaxed">
          The job you&apos;re looking for might have been closed or removed by the employer.
        </p>
        <Button onClick={() => router.push('/jobs')} className="px-10 h-14 rounded-2xl font-black gap-3 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Browse All Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Main Content (Left) */}
          <div className="flex-1 min-w-0">
             <JobHeader job={job} />
             <JobTabs job={job} />
             
             {/* Related Jobs Section */}
             <div className="border-t border-border mt-20">
                <RelatedJobs category={job.category} currentJobId={job._id} />
             </div>
          </div>

          {/* Sticky Sidebar (Right) */}
          <div className="lg:w-[380px] shrink-0">
            <Sidebar 
              job={job} 
              onApply={() => setIsApplyModalOpen(true)} 
            />
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal 
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobTitle={job.title}
        companyName={job.company}
      />
    </div>
  );
}
