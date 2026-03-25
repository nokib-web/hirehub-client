'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Search, 
  CheckCircle, 
  PlusCircle, 
  FileCheck, 
  UserCheck, 
  ArrowRight 
} from 'lucide-react';

const seekerSteps = [
  { icon: UserPlus, title: 'Create Profile', desc: 'Build your career profile and highlight your skills.' },
  { icon: Search, title: 'Browse & Apply', desc: 'Find relevant jobs and apply with just one click.' },
  { icon: CheckCircle, title: 'Get Hired', desc: 'Succeed in interviews and land your dream job.' },
];

const employerSteps = [
  { icon: PlusCircle, title: 'Post a Job', desc: 'Easily post job openings to attract top talent.' },
  { icon: FileCheck, title: 'Review Applications', desc: 'Manage candidates and review their profiles.' },
  { icon: UserCheck, title: 'Hire the Best', desc: 'Connect with ideal candidates and grow your team.' },
];

const HowItWorksSection = () => {
  const [activeTab, setActiveTab] = useState<'seekers' | 'employers'>('seekers');

  const steps = activeTab === 'seekers' ? seekerSteps : employerSteps;

  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-950/50">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-zinc-100 mb-6"
          >
            How HireHub Works
          </motion.h2>
          
          <div className="inline-flex p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 mx-auto">
            {(['seekers', 'employers'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-8 py-3 rounded-full text-sm font-bold transition-all ${
                  activeTab === tab 
                  ? 'text-white' 
                  : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTabBg"
                    className="absolute inset-0 bg-blue-600 rounded-full z-0 shadow-lg shadow-blue-500/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 uppercase tracking-widest">
                  {tab === 'seekers' ? 'For Job Seekers' : 'For Employers'}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center items-center relative z-10">
            <AnimatePresence mode="wait">
              {steps.map((step, index) => (
                <motion.div
                  key={`${activeTab}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="group"
                >
                  <div className="relative mb-8 flex justify-center">
                    <div className="w-24 h-24 bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] group-hover:shadow-blue-500/20 group-hover:scale-105 transition-all flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
                      <step.icon className="w-10 h-10 text-blue-600" />
                    </div>
                    {/* Floating number */}
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">{step.title}</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto text-lg leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Connecting Arrows (Visible on Desktop) */}
          <div className="hidden md:block absolute top-[20%] left-[30%] right-[30%] h-0.5 border-t-2 border-dashed border-zinc-200 dark:border-zinc-800 -z-0" />
          <div className="hidden md:block absolute top-[20%] right-[30%] text-blue-300 transform -translate-y-1/2">
            <ArrowRight className="w-10 h-10" />
          </div>
          <div className="hidden md:block absolute top-[20%] left-[30%] text-blue-300 transform -translate-y-1/2">
            <ArrowRight className="w-10 h-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
