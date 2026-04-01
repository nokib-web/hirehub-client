'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { IJob } from '@/types/job';
import { DollarSign, Calendar, Users, Eye, Bookmark, Share2, ArrowRight, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useCheckApplication } from '@/hooks/useApplications';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface SidebarProps {
  job: IJob;
  onApply: () => void;
}

export default function Sidebar({ job, onApply }: SidebarProps) {
  const { user, isAuthenticated } = useAuth();
  const { data: application } = useCheckApplication(job._id);
  const router = useRouter();
  const pathname = usePathname();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
     const savedJobs = JSON.parse(localStorage.getItem('hirehub_saved_jobs') || '[]');
     setIsSaved(savedJobs.includes(job._id));
  }, [job._id]);

  const toggleBookmark = () => {
     let savedJobs = JSON.parse(localStorage.getItem('hirehub_saved_jobs') || '[]');
     if (isSaved) {
        savedJobs = savedJobs.filter((id: string) => id !== job._id);
        toast.success('Job removed from saved');
     } else {
        savedJobs.push(job._id);
        toast.success('Job saved!');
     }
     localStorage.setItem('hirehub_saved_jobs', JSON.stringify(savedJobs));
     setIsSaved(!isSaved);
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }
    
    if (user?.role === 'employer') {
        return;
    }

    onApply();
  };

  const deadline = new Date(job.deadline).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const appliedDate = application?.createdAt ? new Date(application.createdAt).toLocaleDateString() : '';

  return (
    <aside className="space-y-6 sticky top-24 self-start animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
      {/* Action Card */}
      <div className="bg-card border border-primary/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all pointer-events-none">
            <ShieldCheck className="w-32 h-32 text-primary" />
         </div>

         <div className="space-y-6 relative z-10">
            <div className="space-y-1">
               <p className="text-xs font-black text-primary uppercase tracking-widest leading-none">Expected Salary</p>
               <h3 className="text-2xl font-black text-foreground flex items-center gap-1.5 pt-1">
                 <DollarSign className="w-6 h-6 text-primary" strokeWidth={3} />
                 {job.salary?.min?.toLocaleString() || 0} - {job.salary?.max?.toLocaleString() || 0}
                 <span className="text-sm font-bold text-muted-foreground uppercase opacity-60">/ {job.salary?.period || 'yearly'}</span>
               </h3>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
               <div className="flex items-center justify-between group/item p-3 rounded-2xl bg-muted/30 border border-border/40 hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center font-bold">
                        <Calendar className="w-5 h-5" />
                     </div>
                     <div className="space-y-0.5">
                        <p className="text-[10px] uppercase font-black text-muted-foreground leading-none">Deadline</p>
                        <p className="text-sm font-bold text-foreground">{deadline}</p>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-blue-100/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 group/stat">
                     <Users className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
                     <p className="text-lg font-black leading-none">{job.applicantsCount}</p>
                     <p className="text-[10px] uppercase font-bold text-blue-600/60 dark:text-blue-400/60 pt-1">Applicants</p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-emerald-100/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 group/stat">
                     <Eye className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
                     <p className="text-lg font-black leading-none">{job.views}</p>
                     <p className="text-[10px] uppercase font-bold text-emerald-600/60 dark:text-emerald-400/60 pt-1">Views</p>
                  </div>
               </div>
            </div>

            <div className="space-y-3 pt-6">
               {isAuthenticated && user?.role === 'employer' ? (
                 <div className="p-4 bg-muted border border-border rounded-2xl flex items-center gap-3 text-muted-foreground">
                   <ShieldCheck className="w-5 h-5" />
                   <p className="text-sm font-bold">You are viewing as an Employer</p>
                 </div>
               ) : application ? (
                 <Button 
                  disabled
                  className="w-full h-14 rounded-2xl font-black text-lg gap-2.5 bg-green-600 text-white shadow-xl shadow-green-600/20"
                 >
                   <CheckCircle2 className="w-6 h-6" />
                   Applied on {appliedDate}
                 </Button>
               ) : (
                 <Button 
                  onClick={handleApplyClick}
                  className="w-full h-14 rounded-2xl font-black text-lg gap-2.5 shadow-xl shadow-primary/20 group/btn relative overflow-hidden group active:scale-[0.98] transition-all"
                 >
                   <span className="relative z-10 flex items-center gap-2">
                     Apply Now 
                     <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                   </span>
                   <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                 </Button>
               )}
               
               <div className="grid grid-cols-2 gap-3">
                 <Button 
                  onClick={toggleBookmark}
                  variant="outline" 
                  className={`h-12 rounded-2xl font-bold gap-2 group hover:border-primary/40 hover:bg-primary/5 ${isSaved ? 'text-primary border-primary/40 bg-primary/5' : ''}`}
                 >
                    <Bookmark className={`w-4 h-4 group-hover:fill-primary group-hover:text-primary transition-all ${isSaved ? 'fill-primary text-primary' : ''}`} />
                    {isSaved ? 'Saved' : 'Save Job'}
                 </Button>
                 <Button 
                  onClick={() => {
                    navigator.share?.({
                      title: job.title,
                      url: window.location.href
                    }).catch(() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success('Link copied to clipboard!');
                    });
                  }}
                  variant="outline" 
                  className="h-12 rounded-2xl font-bold gap-2 group hover:border-primary/40 hover:bg-primary/5"
                 >
                    <Share2 className="w-4 h-4 group-hover:text-primary transition-all" />
                    Share
                 </Button>
               </div>
            </div>
         </div>
      </div>

      {/* Security Tip */}
      <div className="p-6 bg-muted/40 border border-border/80 rounded-3xl relative overflow-hidden group">
         <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all scale-90">
               <Zap className="w-5 h-5" />
            </div>
            <div className="space-y-1">
               <p className="text-sm font-black text-foreground uppercase tracking-tight">Hiring Tip</p>
               <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                 Personalize your cover letter with AI to stand out from 80% of other applicants.
               </p>
            </div>
         </div>
      </div>
    </aside>
  );
}
