'use client';

import React from 'react';
import { motion } from 'framer-motion';
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

const categories = [
  { name: 'Technology', icon: Laptop, color: 'bg-blue-100 text-blue-600', jobs: '2,450' },
  { name: 'Design', icon: Palette, color: 'bg-purple-100 text-purple-600', jobs: '1,120' },
  { name: 'Marketing', icon: Megaphone, color: 'bg-orange-100 text-orange-600', jobs: '980' },
  { name: 'Finance', icon: DollarSign, color: 'bg-emerald-100 text-emerald-600', jobs: '750' },
  { name: 'Healthcare', icon: Heart, color: 'bg-rose-100 text-rose-600', jobs: '1,340' },
  { name: 'Engineering', icon: Cog, color: 'bg-gray-100 text-gray-600', jobs: '890' },
  { name: 'Education', icon: BookOpen, color: 'bg-amber-100 text-amber-600', jobs: '420' },
  { name: 'Sales', icon: TrendingUp, color: 'bg-cyan-100 text-cyan-600', jobs: '670' },
  { name: 'HR', icon: Users, color: 'bg-pink-100 text-pink-600', jobs: '310' },
  { name: 'Legal', icon: Scale, color: 'bg-indigo-100 text-indigo-600', jobs: '240' },
];

const CategorySection = () => {
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="group cursor-pointer bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-8 rounded-2xl text-center shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-zinc-700 transition-all"
            >
              <div className={`w-16 h-16 ${cat.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                <cat.icon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-200 mb-2 group-hover:text-blue-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {cat.jobs} open positions
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
