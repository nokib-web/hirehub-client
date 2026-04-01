'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Briefcase, DollarSign, Bookmark, ArrowRight, Clock } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { IJob } from '@/types';
import { motion } from 'framer-motion';

interface JobCardProps {
  job: IJob;
  variant?: 'default' | 'minimal';
}

export default function JobCard({ job, variant = 'default' }: JobCardProps) {
  const daysAgo = Math.floor((new Date().getTime() - new Date(job.createdAt).getTime()) / (1000 * 3600 * 24));
  const [isSaved, setIsSaved] = React.useState(false);

  React.useEffect(() => {
     const savedJobs = JSON.parse(localStorage.getItem('hirehub_saved_jobs') || '[]');
     setIsSaved(savedJobs.includes(job._id || job.id));
  }, [job._id, job.id]);

  const toggleBookmark = (e: React.MouseEvent) => {
     e.preventDefault();
     e.stopPropagation();
     let savedJobs = JSON.parse(localStorage.getItem('hirehub_saved_jobs') || '[]');
     const jobId = job._id || job.id;
     if (isSaved) {
        savedJobs = savedJobs.filter((id: string) => id !== jobId);
     } else {
        savedJobs.push(jobId);
     }
     localStorage.setItem('hirehub_saved_jobs', JSON.stringify(savedJobs));
     setIsSaved(!isSaved);
  };

  if (variant === 'minimal') {
    return (
      <Link href={`/jobs/${job._id || job.id}`}>
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="group bg-card border border-border/40 hover:border-primary/40 p-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 flex items-center gap-6 relative overflow-hidden"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg uppercase border border-primary/20 shrink-0 group-hover:scale-105 transition-transform">
            {(job.company || 'U').charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-base font-black text-foreground truncate group-hover:text-primary transition-colors uppercase italic tracking-tight">{job.title}</h3>
                <p className="text-[10px] font-black text-muted-foreground uppercase opacity-70 tracking-widest">{job.company}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                 <span className="text-[9px] font-black text-primary uppercase italic tracking-widest bg-primary/5 px-2 py-1 rounded-md border border-primary/10">
                   {job.salary ? `${job.salary.min?.toLocaleString()} - ${job.salary.max?.toLocaleString()}` : 'Negotiable'}
                 </span>
                 <button onClick={toggleBookmark} className={`p-1.5 rounded-lg border border-border/60 ${isSaved ? 'text-primary bg-primary/5 border-primary/20' : 'text-muted-foreground'}`}>
                   <Bookmark className={`w-3 h-3 ${isSaved ? 'fill-current' : ''}`} />
                 </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-[9px] font-black uppercase text-muted-foreground tracking-widest">
                <MapPin className="w-3 h-3 text-primary/60" /> {job.location}
              </div>
              <div className="flex items-center gap-1 text-[9px] font-black uppercase text-muted-foreground tracking-widest">
                <Briefcase className="w-3 h-3 text-primary/60" /> {job.type}
              </div>
              <div className="flex items-center gap-1 text-[9px] font-black uppercase text-muted-foreground tracking-widest">
                <Clock className="w-3 h-3 text-primary/60" /> {daysAgo === 0 ? 'Today' : `${daysAgo}d`}
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 pr-2">
             {job.skills.slice(0, 2).map(skill => (
               <Badge key={skill} variant="outline" className="text-[8px] font-black uppercase tracking-widest bg-muted/30 border-border/40 px-2 py-0.5">
                 {skill}
               </Badge>
             ))}
             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all ml-2">
                <ArrowRight className="w-4 h-4" />
             </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/jobs/${job._id || job.id}`}>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6 }}
        className="group relative bg-card border border-border/60 hover:border-primary/40 p-6 rounded-3xl shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden flex flex-col h-full"
      >
        {/* Background Sparkle Effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700 -z-10" />

        {/* Top Header: Logo & Save */}
        <div className="flex items-start justify-between mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary font-black text-xl uppercase border border-primary/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
            {(job.company || 'U').charAt(0)}
          </div>
          <div className="flex flex-col items-end gap-2">
            <button 
              onClick={toggleBookmark}
              className={`p-2.5 rounded-xl border border-border hover:bg-muted transition-all active:scale-90 ${isSaved ? 'text-primary bg-primary/5 border-primary/30' : 'text-muted-foreground'}`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 flex items-center gap-1.5">
               <Clock className="w-3 h-3" /> {daysAgo === 0 ? 'Today' : `${daysAgo}d`}
            </span>
          </div>
        </div>

        {/* Job Primary Info */}
        <div className="flex-1 space-y-4">
          <div className="space-y-1.5">
             {job.isFeatured && (
               <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:bg-amber-950/40 dark:text-amber-500 border-none px-2.5 py-0.5 h-auto text-[9px] uppercase tracking-[0.15em] font-black italic rounded-full inline-flex mb-1">
                 Featured Positioning
               </Badge>
             )}
             <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight leading-snug uppercase italic">
               {job.title}
             </h3>
             <p className="text-sm font-bold text-muted-foreground uppercase opacity-80">{job.company}</p>
          </div>

          <div className="flex flex-wrap items-center gap-y-3 gap-x-4 pt-1">
            <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-foreground/70">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {job.location}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-foreground/70">
              <Briefcase className="w-3.5 h-3.5 text-primary" />
              {job.type}
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-sm font-black text-primary uppercase italic">
            <DollarSign className="w-3.5 h-3.5" />
            {job.salary ? `${job.salary.min?.toLocaleString()} - ${job.salary.max?.toLocaleString()}` : 'Negotiable'}
          </div>
        </div>

        {/* Footer: Skills & Button */}
        <div className="mt-8 pt-6 border-t border-border/40 space-y-6">
          <div className="flex flex-wrap gap-2">
            {job.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="outline" className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-muted/30 border-border/60 rounded-lg">
                {skill}
              </Badge>
            ))}
          </div>

          <div className="group/btn flex items-center justify-between gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
               Direct Apply
            </span>
            <div className="h-11 w-11 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 group-hover:w-full group-hover:rounded-xl transition-all duration-500 overflow-hidden relative">
               <ArrowRight className="w-5 h-5 absolute group-hover:translate-x-32 transition-transform duration-500" />
               <span className="opacity-0 group-hover:opacity-100 font-bold uppercase text-[10px] tracking-widest whitespace-nowrap px-4 transition-opacity duration-300">
                  Engage Now
               </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
