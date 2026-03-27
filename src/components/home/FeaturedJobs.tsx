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
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['featured-jobs'],
    queryFn: async () => {
      try {
        const response = await api.get('/jobs?isFeatured=true&limit=8');
        return response.data.data;
      } catch (err) {
        console.error('Error fetching jobs:', err);
        return mockJobs;
      }
    },
    initialData: [],
  });

  const displayJobs = jobs.length > 0 ? jobs : mockJobs;

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
            displayJobs.map((job: unknown, index: number) => {
              const j = job as IJob;
              return (
              <motion.div 
                key={j._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <JobCard job={j} />
              </motion.div>
            );
          })
          )}
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" variant="outline" className="border-blue-200 dark:border-zinc-800 hover:border-blue-500 text-blue-600 dark:text-blue-400 group">
            View All Jobs <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

// Real relevant mock data for demonstration
const mockJobs = [
  {
    _id: "1",
    company: "Google",
    title: "Senior Frontend Engineer (React)",
    location: "Mountain View, CA",
    type: "Full-time",
    salary: { min: 150000, max: 220000, currency: 'USD', period: 'yearly' },
    skills: ["React", "TypeScript", "Next.js"],
    createdAt: new Date().toISOString(),
    isFeatured: true
  },
  {
    _id: "2",
    company: "Meta",
    title: "UI Designer",
    location: "Remote",
    type: "Remote",
    salary: { min: 120000, max: 180000, currency: 'USD', period: 'yearly' },
    skills: ["Figma", "Prototyping", "Design Systems"],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isFeatured: true
  },
  {
    _id: "3",
    company: "Amazon",
    title: "Backend Developer (Node.js)",
    location: "Seattle, WA",
    type: "Contract",
    salary: { min: 130000, max: 190000, currency: 'USD', period: 'yearly' },
    skills: ["Node.js", "AWS", "DynamoDB"],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    isFeatured: true
  },
  {
    _id: "4",
    company: "Netflix",
    title: "Data Scientist",
    location: "Los Gatos, CA",
    type: "Full-time",
    salary: { min: 160000, max: 250000, currency: 'USD', period: 'yearly' },
    skills: ["Python", "Machine Learning", "PyTorch"],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    isFeatured: true
  },
  {
    _id: "5",
    company: "Stripe",
    title: "Product Manager",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: { min: 170000, max: 230000, currency: 'USD', period: 'yearly' },
    skills: ["Strategy", "Product Roadmap", "Analytics"],
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    isFeatured: true
  },
  {
    _id: "6",
    company: "Tesla",
    title: "Automotive Software Engineer",
    location: "Palo Alto, CA",
    type: "Full-time",
    salary: { min: 140000, max: 210000, currency: 'USD', period: 'yearly' },
    skills: ["C++", "Embedded Systems", "RTOS"],
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    isFeatured: true
  },
  {
    _id: "7",
    company: "Microsoft",
    title: "Solution Architect (Azure)",
    location: "Redmond, WA",
    type: "Full-time",
    salary: { min: 160000, max: 240000, currency: 'USD', period: 'yearly' },
    skills: ["Cloud", "DevOps", "Kubernetes"],
    createdAt: new Date(Date.now() - 518400000).toISOString(),
    isFeatured: true
  },
  {
    _id: "8",
    company: "Airbnb",
    title: "Mobile App Developer",
    location: "Remote",
    type: "Hybrid",
    salary: { min: 150000, max: 200000, currency: 'USD', period: 'yearly' },
    skills: ["React Native", "iOS", "Android"],
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    isFeatured: true
  }
] as unknown as IJob[];

export default FeaturedJobs;
