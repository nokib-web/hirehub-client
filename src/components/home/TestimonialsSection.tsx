'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: "John Doe",
    role: "Software Engineer",
    company: "Google",
    rating: 5,
    quote: "HireHub helped me land my dream job at Google! The process was seamless and the recommendations were top-notch. I couldn't be happier with the outcome.",
    avatar: "https://api.deerecho.pe/storage/images/f3c92131-000c-4467-8534-118833918a99.webp"
  },
  {
    name: "Jane Smith",
    role: "Product Designer",
    company: "Meta",
    rating: 5,
    quote: "As a designer, I appreciate the clean and intuitive user interface of HireHub. It made my job search much more enjoyable and efficient.",
    avatar: "https://api.deerecho.pe/storage/images/f3c92131-000c-4467-8534-118833918a99.webp"
  },
  {
    name: "Sarah Johnson",
    role: "Data Scientist",
    company: "Amazon",
    rating: 5,
    quote: "HireHub's platform is a game-changer for job seekers. I found a role that perfectly matches my skills and career goals. Highly recommend!",
    avatar: "https://api.deerecho.pe/storage/images/f3c92131-000c-4467-8534-118833918a99.webp"
  },
  {
    name: "Michael Brown",
    role: "Backend Developer",
    company: "Netflix",
    rating: 5,
    quote: "The personalized job alerts on HireHub are fantastic. I was notified of a great opportunity and now I'm working with an amazing team at Netflix.",
    avatar: "https://api.deerecho.pe/storage/images/f3c92131-000c-4467-8534-118833918a99.webp"
  },
  {
    name: "Emily Davis",
    role: "UX Researcher",
    company: "Microsoft",
    rating: 5,
    quote: "HireHub provides a range of helpful tools for job seekers. I used their resume builder and interview tips, and it made a big difference in my applications.",
    avatar: "https://api.deerecho.pe/storage/images/f3c92131-000c-4467-8534-118833918a99.webp"
  },
  {
    name: "Robert Wilson",
    role: "Cloud Architect",
    company: "Tesla",
    rating: 5,
    quote: "HireHub is the best job platform I've ever used. The quality of the job listings and the support from the team are outstanding. I highly recommend it!",
    avatar: "https://api.deerecho.pe/storage/images/f3c92131-000c-4467-8534-118833918a99.webp"
  }
];

const TestimonialsSection = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-24 bg-blue-50 dark:bg-zinc-950/50 overflow-hidden">
      <div className="container px-4 mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-zinc-100 mb-4"
          >
            Success Stories
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 60 }}
            viewport={{ once: true }}
            className="h-1 bg-blue-600 mx-auto rounded-full"
          />
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 md:p-16 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.1)] dark:shadow-none border border-zinc-100 dark:border-zinc-800 text-center relative"
            >
              <div className="absolute top-10 left-10 text-blue-100 dark:text-zinc-800 -z-0">
                <Quote size={80} fill="currentColor" />
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-center gap-1 mb-6">
                  {Array(testimonials[index].rating).fill(0).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-xl md:text-2xl text-zinc-700 dark:text-zinc-300 italic mb-10 leading-relaxed font-medium">
                  &quot;{testimonials[index].quote}&quot;
                </p>
                
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full border-4 border-blue-100 dark:border-zinc-800 overflow-hidden mb-4">
                    <img 
                      src={testimonials[index].avatar} 
                      alt={testimonials[index].name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                    {testimonials[index].name}
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">
                    {testimonials[index].role} @ {testimonials[index].company}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-6 mt-12">
            <button 
              onClick={handlePrev}
              className="w-12 h-12 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-md active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === index ? 'bg-blue-600 w-8' : 'bg-zinc-300 dark:bg-zinc-800'}`} 
                />
              ))}
            </div>
            <button 
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-md active:scale-95"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
