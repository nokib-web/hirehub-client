'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const posts = [
  {
    title: "10 Resume Mistakes to Avoid in 2024",
    category: "Career Advice",
    date: "March 15, 2024",
    excerpt: "Learn how to make your resume stand out to recruiters and applicant tracking systems (ATS) with these 10 simple tips.",
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    title: "How to Ace Your Technical Interview",
    category: "Interview Tips",
    date: "March 10, 2024",
    excerpt: "Preparation is key! Discover the most common technical interview questions and how to answer them with confidence and skill.",
    gradient: "from-purple-500 to-pink-600"
  },
  {
    title: "Negotiating Salary: A Complete Guide",
    category: "Salary & Benefits",
    date: "March 5, 2024",
    excerpt: "Don't leave money on the table. Our comprehensive guide will teach you the art of salary negotiation and help you get paid what you're worth.",
    gradient: "from-emerald-500 to-teal-600"
  }
];

const BlogSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-zinc-950">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 text-center md:text-left">
          <div className="max-w-xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-zinc-100 mb-4"
            >
              Career Advice & Tips
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 dark:text-zinc-400 text-lg"
            >
              Stay ahead in your career with the latest insights from our recruitment experts.
            </motion.p>
          </div>
          <Button variant="outline" className="border-zinc-200 dark:border-zinc-800 hover:border-blue-500 text-blue-600 dark:text-blue-400 group">
            View All Articles <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl transition-all"
            >
              <div className={`h-52 bg-gradient-to-br ${post.gradient} p-8 flex flex-col justify-end relative overflow-hidden`}>
                <div className="absolute top-4 right-4 text-white/20 -rotate-12 transform group-hover:scale-110 transition-transform">
                  <BookOpen size={120} />
                </div>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-md w-fit mb-4">
                  {post.category}
                </Badge>
              </div>
              
              <div className="p-8">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
                  <Calendar size={14} />
                  <span>{post.date}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                  {post.title}
                </h3>
                
                <p className="text-zinc-500 dark:text-zinc-400 mb-8 line-clamp-3 text-lg leading-relaxed">
                  {post.excerpt}
                </p>
                
                <button className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400 hover:gap-3 transition-all p-0">
                  Read More <ArrowRight size={16} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
