'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const HeroSection = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const slideIn = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, delay: 0.3 }
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center pt-32 pb-20 overflow-hidden">
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-700 to-violet-700"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <div className="container relative z-10 px-4 mx-auto text-center">
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-md px-4 py-1.5 text-sm">
            🚀 #1 Job Platform in 2024
          </Badge>
        </motion.div>

        {/* Heading */}
        <motion.h1 
          {...fadeInUp}
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Find Your <span className="text-blue-400">Dream Job</span> Today
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.2 }}
          className="text-xl text-blue-100/80 mb-10 max-w-2xl mx-auto"
        >
          Connect with top companies and land the career you deserve. Your journey starts here.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-6 text-lg rounded-full font-bold group">
            Browse Jobs <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full font-bold">
            Post a Job
          </Button>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          {...slideIn}
          className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-2 md:p-3 flex flex-col md:flex-row items-center gap-2"
        >
          <div className="flex-1 flex items-center px-4 py-2 w-full border-b md:border-b-0 md:border-r border-gray-200 dark:border-zinc-800">
            <Search className="text-gray-400 mr-2 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Job title, keywords..." 
              className="w-full bg-transparent border-none focus:ring-0 text-gray-800 dark:text-zinc-100 placeholder:text-gray-400"
            />
          </div>
          <div className="flex-1 flex items-center px-4 py-2 w-full">
            <MapPin className="text-gray-400 mr-2 w-5 h-5" />
            <input 
              type="text" 
              placeholder="City, remote..." 
              className="w-full bg-transparent border-none focus:ring-0 text-gray-800 dark:text-zinc-100 placeholder:text-gray-400"
            />
          </div>
          <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all whitespace-nowrap">
            Search Jobs
          </Button>
        </motion.div>

        {/* Popular Tags */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-6 flex flex-wrap justify-center items-center gap-3 text-sm text-blue-100/60"
        >
          <span>Popular:</span>
          {["React Developer", "UI Designer", "Data Scientist", "Product Manager"].map((tag) => (
            <span key={tag} className="text-blue-200 hover:text-white cursor-pointer transition-colors underline underline-offset-4 decoration-blue-500/30">
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-8 md:gap-16 text-white/80"
        >
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">50K+</span>
            <span className="text-xs uppercase tracking-wider text-white/50">Jobs Listed</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">10K+</span>
            <span className="text-xs uppercase tracking-wider text-white/50">Companies</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">200K+</span>
            <span className="text-xs uppercase tracking-wider text-white/50">Job Seekers</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">95%</span>
            <span className="text-xs uppercase tracking-wider text-white/50">Success Rate</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
