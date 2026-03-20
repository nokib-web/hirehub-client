'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { Search, MapPin, Briefcase } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-background overflow-hidden py-20 lg:py-32 border-b border-border">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground"
          >
            Find Your <span className="text-primary italic">Dream Job</span> <br />
            in a Minute.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-xl text-foreground/70 max-w-2xl mx-auto"
          >
            HireHub is the leading platform for tech recruitment. Connect with top employers and grow your career with our AI-powered recommendation system.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 max-w-4xl mx-auto"
          >
            <div className="bg-card p-2 rounded-xl border border-border flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 shadow-sm">
              <div className="flex-1 flex items-center px-4 w-full">
                <Search className="text-foreground/50 w-5 h-5 mr-3" />
                <input
                  type="text"
                  placeholder="Job title or keywords"
                  className="bg-transparent border-none focus:ring-0 w-full text-foreground"
                />
              </div>
              <div className="hidden md:block w-px h-10 bg-border mx-2" />
              <div className="flex-1 flex items-center px-4 w-full">
                <MapPin className="text-foreground/50 w-5 h-5 mr-3" />
                <input
                  type="text"
                  placeholder="Location"
                  className="bg-transparent border-none focus:ring-0 w-full text-foreground"
                />
              </div>
              <Button size="lg" className="w-full md:w-auto px-10">
                Search
              </Button>
            </div>
            
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-foreground/50">
              <span>Popular Tags:</span>
              <span className="text-primary cursor-pointer hover:underline">Frontend</span>
              <span className="text-primary cursor-pointer hover:underline">Backend</span>
              <span className="text-primary cursor-pointer hover:underline">UI Design</span>
              <span className="text-primary cursor-pointer hover:underline">DevOps</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
