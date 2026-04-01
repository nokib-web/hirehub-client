'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Clock, Bookmark } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { IJob } from '@/types/job';

interface JobCardProps {
  job: IJob;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { 
    company, 
    companyLogo, 
    title, 
    location, 
    type, 
    salary, 
    skills, 
    createdAt,
    isFeatured 
  } = job;

  // Calculate days ago
  const daysAgo = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
  const timeAgo = daysAgo === 0 ? 'Today' : `${daysAgo}d ago`;

  // Get first letter of company name for avatar if logo is missing
  const companyName = company || 'Unknown';
  const initial = companyName.charAt(0).toUpperCase();
  const avatarColors = [
    'bg-blue-100 text-blue-600',
    'bg-purple-100 text-purple-600',
    'bg-green-100 text-green-600',
    'bg-orange-100 text-orange-600',
    'bg-rose-100 text-rose-600',
  ];
  const avatarColor = avatarColors[companyName.length % avatarColors.length];

  // Format salary
  const salaryDisplay = typeof salary === 'string' 
    ? salary 
    : `$${(salary?.min || 0).toLocaleString()} - $${(salary?.max || 0).toLocaleString()}`;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[12px] p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] dark:shadow-none hover:shadow-xl transition-all h-full flex flex-col"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {companyLogo ? (
            <img src={companyLogo} alt={companyName} className="w-12 h-12 rounded-lg object-contain bg-gray-50 p-1" />
          ) : (
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl ${avatarColor}`}>
              {initial}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                {companyName}
              </span>
              {isFeatured && (
                <Badge variant="warning" className="text-[10px] px-1.5 py-0 h-4 bg-amber-100 text-amber-700 border-amber-200">
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      <Link href={`/jobs/${job._id || job.id}`}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-2 line-clamp-1 hover:text-blue-600 transition-colors cursor-pointer">
          {title}
        </h3>
      </Link>

      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{type}</span>
        </div>
      </div>

      <div className="mb-4">
        <span className="text-emerald-600 dark:text-emerald-500 font-bold text-lg">
          {salaryDisplay}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 flex-1">
        {skills.slice(0, 3).map((skill) => (
          <Badge key={skill} variant="outline" className="text-[11px] font-medium bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
            {skill}
          </Badge>
        ))}
        {skills.length > 3 && (
          <span className="text-[11px] text-gray-400 self-center font-medium">
            +{skills.length - 3} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 dark:border-zinc-800 pt-4 mt-auto">
        <span className="text-xs text-gray-400 italic">
          {timeAgo}
        </span>
        <Link href={`/jobs/${job._id || job.id}`}>
          <Button size="sm" className="px-5 rounded-lg font-bold">
            Apply Now
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default JobCard;
