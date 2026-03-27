'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const companies = [
  { name: 'Google', industry: 'Technonogy', jobs: 120, color: 'bg-red-500' },
  { name: 'Meta', industry: 'Social Media', jobs: 85, color: 'bg-blue-600' },
  { name: 'Amazon', industry: 'E-commerce', jobs: 240, color: 'bg-orange-500' },
  { name: 'Apple', industry: 'Hardware', jobs: 95, color: 'bg-gray-800' },
  { name: 'Microsoft', industry: 'Software', jobs: 150, color: 'bg-blue-500' },
  { name: 'Tesla', industry: 'Automotive', jobs: 45, color: 'bg-red-700' },
];

const TopCompanies = () => {
  return (
    <section className="py-24 bg-white dark:bg-zinc-950">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-zinc-100 mb-4"
            >
              Top Companies Hiring
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 dark:text-zinc-400 text-lg"
            >
              Join the world&apos;s most innovative companies and grow your career.
            </motion.p>
          </div>
          <Button variant="outline" className="border-zinc-200 dark:border-zinc-800 hover:border-blue-500 text-blue-600 dark:text-blue-400">
            View All Companies
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 rounded-3xl text-center flex flex-col items-center justify-between group shadow-sm hover:shadow-xl transition-all"
            >
              <div className={`w-20 h-20 ${company.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-black/10 text-white font-bold text-2xl group-hover:rotate-6 transition-transform`}>
                {company.name.charAt(0)}
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">{company.name}</h3>
                <Badge variant="outline" className="text-[10px] uppercase tracking-widest bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 py-0 px-2 font-medium">
                  {company.industry}
                </Badge>
              </div>

              <div className="w-full space-y-4">
                <div className="text-blue-600 font-bold">
                  {company.jobs} <span className="text-xs text-zinc-400 ml-1">Open Positions</span>
                </div>
                <Button size="sm" variant="outline" className="w-full border-zinc-200 dark:border-zinc-800 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                  View Jobs
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCompanies;
