'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Briefcase, DollarSign, Bookmark, ArrowRight, Clock } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { IJob } from '@/types/job';
import { motion } from 'framer-motion';

interface JobCardProps {
  job: IJob;
}

export default function JobCard({ job }: JobCardProps) {
  const daysAgo = Math.floor((new Date().getTime() - new Date(job.createdAt).getTime()) / (1000 * 3600 * 24));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group bg-card border border-border hover:border-primary/40 p-5 rounded-xl shadow-sm transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row gap-5">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl uppercase border border-primary/20">
            {(job.company || 'U').charAt(0)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1">
              <Link 
                href={`/jobs/${job._id}`}
                className="text-lg font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer"
              >
                {job.title}
              </Link>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <span>{job.company}</span>
                {job.isFeatured && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-500 border-none px-2 py-0 h-5 text-[10px] uppercase tracking-wider font-bold">
                    Featured
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:text-right">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                 <Clock className="w-3.5 h-3.5" />
                 {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
              </span>
              <button className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-primary transition-colors">
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Details Row */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-4">
            <div className="flex items-center gap-1.5 text-sm text-foreground/70">
              <MapPin className="w-4 h-4 text-primary/70" />
              {job.location}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-foreground/70 border-l border-border pl-4">
              <Briefcase className="w-4 h-4 text-primary/70" />
              {job.type}
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-primary border-l border-border pl-4">
              <DollarSign className="w-4 h-4" />
              {job.salary ? `${job.salary.min?.toLocaleString() || 0} - ${job.salary.max?.toLocaleString() || 0} / ${job.salary.period || 'yearly'}` : 'Salary not provided'}
            </div>
          </div>

          {/* Skills & Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
            <div className="flex flex-wrap gap-2">
              {job.skills.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="outline" className="text-[11px] font-medium px-2.5 py-0.5 bg-muted/50 border-border/60">
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 4 && (
                <span className="text-[10px] text-muted-foreground font-medium self-center">
                  +{job.skills.length - 4} more
                </span>
              )}
            </div>

            <Link href={`/jobs/${job._id}`}>
              <Button size="sm" className="w-full sm:w-auto gap-2 group/btn h-9 px-5">
                Apply Now
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
