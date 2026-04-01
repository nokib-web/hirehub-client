'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, animate, useInView } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

const AnimatedCounter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (latest) => {
          setDisplayValue(Math.floor(latest));
        },
      });
      return () => controls.stop();
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};

const StatsSection = () => {
  const { data: serverStats, isLoading } = useQuery({
    queryKey: ['platform-stats'],
    queryFn: async () => {
      const response = await api.get('/jobs/stats');
      return response.data.data;
    },
  });

  const stats = [
    { 
      label: "Jobs Listed", 
      value: serverStats?.jobs || 0,
      suffix: "+"
    },
    { 
      label: "Companies Hiring", 
      value: serverStats?.companies || 0, 
      suffix: "+" 
    },
    { 
      label: "Job Seekers", 
      value: serverStats?.jobSeekers || 0, 
      suffix: "+" 
    },
    { 
      label: "Hiring Success Rate", 
      value: serverStats?.successRate || 95, 
      suffix: "%" 
    }
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with blue-violet gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-800 to-violet-800">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      </div>

      <div className="container relative z-10 px-4 mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center text-white">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="space-y-4"
            >
              <h3 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </h3>
              <p className="text-blue-100/70 text-lg font-medium uppercase tracking-[3px]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
