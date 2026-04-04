'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { 
  Laptop, 
  Palette, 
  Megaphone, 
  DollarSign, 
  Heart, 
  Cog, 
  BookOpen, 
  TrendingUp, 
  Users, 
  Scale 
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, any> = {
  'Technology': Laptop,
  'Design': Palette,
  'Marketing': Megaphone,
  'Finance': DollarSign,
  'Healthcare': Heart,
  'Engineering': Cog,
  'Education': BookOpen,
  'Sales': TrendingUp,
  'HR': Users,
  'Legal': Scale,
};

const CATEGORY_COLORS: Record<string, string> = {
  'Technology': 'bg-blue-100 text-blue-600',
  'Design': 'bg-purple-100 text-purple-600',
  'Marketing': 'bg-orange-100 text-orange-600',
  'Finance': 'bg-emerald-100 text-emerald-600',
  'Healthcare': 'bg-rose-100 text-rose-600',
  'Engineering': 'bg-gray-100 text-gray-600',
  'Education': 'bg-amber-100 text-amber-600',
  'Sales': 'bg-cyan-100 text-cyan-600',
  'HR': 'bg-pink-100 text-pink-600',
  'Legal': 'bg-indigo-100 text-indigo-600',
};

const CategorySection = () => {
  const { data: serverStats = [], isLoading } = useQuery<{ name: string; count: number }[]>({
    queryKey: ['category-stats'],
    queryFn: async () => {
      const response = await api.get('/jobs/category-stats');
      return response.data.data;
    },
  });

  return (
    <section className="py-24 bg-white dark:bg-zinc-950">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-zinc-100 mb-4"
          >
            Browse by Category
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 dark:text-zinc-400"
          >
            Explore diverse opportunities across various industries tailored to your skills.
          </motion.p>
        </div>
      </div>

      <div className="overflow-hidden whitespace-nowrap relative border-0 py-4 w-full group/marquee">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee-rtl {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee-rtl {
            animation: marquee-rtl 40s linear infinite;
          }
          .group\\/marquee:hover .animate-marquee-rtl {
            animation-play-state: paused;
          }
        `}} />
        {isLoading ? (
          <div className="flex gap-6 w-max px-4">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-zinc-50 dark:bg-zinc-900 h-48 w-[240px] shrink-0 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="flex gap-6 w-max px-4 animate-marquee-rtl">
            {[...serverStats, ...serverStats, ...serverStats].map((cat, index) => {
              const Icon = CATEGORY_ICONS[cat.name] || Laptop;
              const color = CATEGORY_COLORS[cat.name] || 'bg-blue-100 text-blue-600';
              
              return (
                <div
                  key={`${cat.name}-${index}`}
                  onClick={() => window.location.href = `/jobs?category=${cat.name}`}
                  className="group cursor-pointer bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-8 rounded-2xl text-center shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-zinc-700 transition-all w-[240px] shrink-0 whitespace-normal"
                >
                  <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-200 mb-2 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {cat.count} open positions
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;
