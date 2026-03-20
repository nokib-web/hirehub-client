'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, Building2, CheckCircle2 } from 'lucide-react';

const stats = [
  { name: 'Active Users', value: '45k+', icon: Users, color: 'text-primary' },
  { name: 'Total Jobs', value: '12k+', icon: Briefcase, color: 'text-secondary' },
  { name: 'Companies', value: '3,200', icon: Building2, color: 'text-accent' },
  { name: 'Applications', value: '250k+', icon: CheckCircle2, color: 'text-emerald-500' },
];

const StatsSection = () => {
  return (
    <section className="bg-card w-full py-12 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center space-y-2 p-6 rounded-2xl bg-background border border-border/50 hover:shadow-md transition-shadow"
            >
              <div className={`p-3 rounded-xl bg-card border border-border ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm font-medium text-foreground/50 tracking-wide uppercase">
                {stat.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
