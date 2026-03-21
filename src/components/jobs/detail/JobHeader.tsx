'use client';

import React from 'react';
import { MapPin, Briefcase, GraduationCap, Clock, CheckCircle2, Bookmark, Share2, ArrowLeft } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { IJob } from '@/types/job';
import Link from 'next/link';

interface JobHeaderProps {
  job: IJob;
}

export default function JobHeader({ job }: JobHeaderProps) {
  const daysAgo = Math.floor((new Date().getTime() - new Date(job.createdAt).getTime()) / (1000 * 3600 * 24));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link 
        href="/jobs" 
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Jobs
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl border-2 border-primary/20 shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
            <span className="relative z-10">{job.company.charAt(0)}</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">{job.title}</h1>
              {job.isFeatured && (
                <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-500 border-none px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider">
                  Featured
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-base font-medium">
              <div className="flex items-center gap-2 text-foreground/80">
                 <span className="text-foreground">{job.company}</span>
                 <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500/10" />
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                {job.location} ({job.locationType})
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-2">
              <Badge variant="outline" className="bg-muted px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 border-border/80">
                <Briefcase className="w-3.5 h-3.5 text-primary" />
                {job.type}
              </Badge>
              <Badge variant="outline" className="bg-muted px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 border-border/80">
                <GraduationCap className="w-3.5 h-3.5 text-primary" />
                {job.experience}
              </Badge>
              <Badge variant="outline" className="bg-muted px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 border-border/80">
                <Clock className="w-3.5 h-3.5 text-primary" />
                Posted {daysAgo === 0 ? 'Today' : `${daysAgo} days ago`}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 md:pt-2">
          <Button variant="outline" className="w-12 h-12 p-0 rounded-xl group hover:border-primary/40">
             <Bookmark className="w-5 h-5 group-hover:text-primary transition-colors" />
          </Button>
          <Button variant="outline" className="w-12 h-12 p-0 rounded-xl group hover:border-primary/40">
             <Share2 className="w-5 h-5 group-hover:text-primary transition-colors" />
          </Button>
        </div>
      </div>
    </div>
  );
}
