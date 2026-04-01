'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import JobCard from './JobCard';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import { Briefcase } from 'lucide-react';
import { IJob } from '@/types/job';

const FeaturedJobs = () => {
  const { data: jobs = [], isLoading, isError } = useQuery({
    queryKey: ['featured-jobs'],
    queryFn: async () => {
      const response = await api.get('/jobs?isFeatured=true&limit=8');
      return response.data.data;
    },
  });

  if (isError) {
    return (
      <div className="py-24 text-center">
         <h2 className="text-xl font-bold text-red-500">Unable to load featured jobs at this time.</h2>
      </div>
    );
  }

  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-950/50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center p-2 px-4 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold text-sm mb-4"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Featured Jobs
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-zinc-100 mb-4"
          >
            Handpicked opportunities for you
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto"
          >
            We curate the best roles from top companies to help you find the perfect fit. Your next career move is just a click away.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-6 h-full space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <Skeleton className="w-6 h-6 rounded-full" />
                </div>
                <Skeleton className="w-3/4 h-6" />
                <Skeleton className="w-1/2 h-4" />
                <Skeleton className="w-full h-10" />
                <div className="flex gap-2 pt-4">
                  <Skeleton className="w-16 h-6 rounded-full" />
                  <Skeleton className="w-16 h-6 rounded-full" />
                </div>
              </div>
            ))
          ) : (
            jobs.map((j: IJob, index: number) => (
              <motion.div 
                key={j._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <JobCard job={j} />
              </motion.div>
            ))
          )}
        </div>

        <div className="mt-16 text-center">
          <Button 
            onClick={() => window.location.href='/jobs'}
            size="lg" 
            variant="outline" 
            className="border-blue-200 dark:border-zinc-800 hover:border-blue-500 text-blue-600 dark:text-blue-400 group"
          >
            View All Jobs <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
