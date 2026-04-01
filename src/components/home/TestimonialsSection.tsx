'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Frontend Developer",
    company: "Hired at DataFlow Inc",
    location: "San Francisco, CA",
    rating: 5,
    text: "I landed my dream job within 3 weeks of using HireHub. The AI career assistant helped me tailor my cover letter perfectly for each application.",
    initials: "SC",
    color: "bg-blue-500"
  },
  {
    name: "Marcus Johnson",
    role: "Product Manager",
    company: "Hired at GrowthBase",
    location: "Austin, TX",
    rating: 5,
    text: "As someone switching careers, HireHub's job matching was incredibly accurate. I got 4 interviews in my first week.",
    initials: "MJ",
    color: "bg-green-500"
  },
  {
    name: "Priya Patel",
    role: "UX Designer",
    company: "Hired at Craftly Studio",
    location: "New York, NY",
    rating: 5,
    text: "The salary guide helped me negotiate 15% above the initial offer. I would not have known my market value without it.",
    initials: "PP",
    color: "bg-purple-500"
  },
  {
    name: "James Rivera",
    role: "Data Scientist",
    company: "Hired at Nexus Analytics",
    location: "Seattle, WA",
    rating: 5,
    text: "HireHub connected me with companies I had never heard of but were perfect fits for my skills. Best job search experience I have had.",
    initials: "JR",
    color: "bg-orange-500"
  },
  {
    name: "Emma Williams",
    role: "Backend Engineer",
    company: "Hired at CloudStack",
    location: "Remote",
    rating: 5,
    text: "Applied to 8 jobs on Monday. Had 3 interviews by Friday. The filtering system is incredibly accurate.",
    initials: "EW",
    color: "bg-pink-500"
  },
  {
    name: "Ahmed Hassan",
    role: "DevOps Engineer",
    company: "Hired at Infratech",
    location: "Chicago, IL",
    rating: 5,
    text: "The employer dashboard made it so easy to review applications. We hired our entire engineering team through HireHub in 6 weeks.",
    initials: "AH",
    color: "bg-teal-500"
  }
];

const TestimonialsSection = () => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const handlePrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  const goToSlide = (slideIndex: number) => {
    setIndex(slideIndex);
  };

  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      handleNext();
    }, 4000);
    
    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

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

        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 md:p-16 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.1)] dark:shadow-none border border-zinc-100 dark:border-zinc-800 text-center relative min-h-[500px] flex flex-col justify-center"
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
                  &quot;{testimonials[index].text}&quot;
                </p>
                
                <div className="flex flex-col items-center">
                  <div className={`w-20 h-20 rounded-full border-4 border-white dark:border-zinc-800 shadow-lg mb-4 flex items-center justify-center text-white text-2xl font-bold ${testimonials[index].color}`}>
                    {testimonials[index].initials}
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                    {testimonials[index].name}
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mb-1">
                    {testimonials[index].role}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                    {testimonials[index].company} • {testimonials[index].location}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-6 mt-12">
            <button 
              onClick={handlePrev}
              className="w-12 h-12 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-md active:scale-95 text-zinc-600 dark:text-zinc-400 hover:border-blue-600"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="flex gap-3">
              {testimonials.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => goToSlide(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${i === index ? 'bg-blue-600 w-8' : 'bg-zinc-300 dark:bg-zinc-800 w-2.5 hover:bg-zinc-400'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-md active:scale-95 text-zinc-600 dark:text-zinc-400 hover:border-blue-600"
              aria-label="Next testimonial"
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
