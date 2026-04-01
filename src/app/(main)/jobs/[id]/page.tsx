'use client';

import React, { useState } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20 animate-pulse">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <div className="flex-1 space-y-12">
            {/* Header Skeleton */}
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded-xl w-3/4" />
              <div className="flex gap-4">
                <div className="h-4 bg-muted rounded-lg w-32" />
                <div className="h-4 bg-muted rounded-lg w-32" />
              </div>
            </div>
            {/* Tabs Skeleton */}
            <div className="h-10 bg-muted rounded-xl w-full" />
            <div className="space-y-6">
              <div className="h-32 bg-muted rounded-2xl w-full" />
              <div className="h-32 bg-muted rounded-2xl w-full" />
            </div>
          </div>
          <div className="lg:w-[380px] space-y-6">
            <div className="h-96 bg-muted rounded-3xl w-full" />
            <div className="h-32 bg-muted rounded-3xl w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !job) {
    notFound();
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
            <div className="sticky top-32">
              <Sidebar 
                job={job} 
                onApply={() => setIsApplyModalOpen(true)} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal 
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobId={job._id}
        jobTitle={job.title}
        companyName={job.company}
      />
    </div>
  );
}
