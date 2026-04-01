'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  createdAt: string;
  coverImage?: string;
}

const BlogSection = () => {
  const { data: blogs = [], isLoading } = useQuery<Blog[]>({
    queryKey: ['home-blogs'],
    queryFn: async () => {
      const response = await api.get('/blogs', { params: { limit: 3 } });
      return response.data.data;
    },
  });

  const getGradient = (category: string) => {
    switch (category) {
      case 'Career Advice': return 'from-blue-500 to-indigo-600';
      case 'Interview Tips': return 'from-purple-500 to-pink-600';
      case 'Salary & Benefits': return 'from-emerald-500 to-teal-600';
      case 'Recruitment': return 'from-orange-500 to-red-600';
      default: return 'from-zinc-500 to-zinc-700';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

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
          <Link href="/blog">
            <Button variant="outline" className="border-zinc-200 dark:border-zinc-800 hover:border-blue-500 text-blue-600 dark:text-blue-400 group">
              View All Articles <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-zinc-50 dark:bg-zinc-900 h-[500px] rounded-3xl" />
            ))
          ) : blogs.length > 0 ? (
            blogs.map((post, index) => (
              <Link key={post._id} href={`/blog/${post.slug}`}>
                <motion.article
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group cursor-pointer bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl transition-all flex flex-col min-h-[500px]"
                >
                  <div className={`h-52 bg-gradient-to-br ${getGradient(post.category)} p-8 flex flex-col justify-end relative overflow-hidden shrink-0`}>
                    {post.coverImage && (
                      <img 
                        src={post.coverImage} 
                        className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-500" 
                        alt="" 
                      />
                    )}
                    <div className="absolute top-4 right-4 text-white/20 -rotate-12 transform group-hover:scale-110 transition-transform">
                      <BookOpen size={120} />
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-md w-fit mb-4 relative z-10">
                      {post.category}
                    </Badge>
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
                      <Calendar size={14} />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 group-hover:text-blue-600 transition-colors leading-tight min-h-[3.5rem] line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-zinc-500 dark:text-zinc-400 mb-8 line-clamp-3 text-lg leading-relaxed flex-1">
                      {post.excerpt}
                    </p>
                    
                    <span className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all p-0 mt-auto">
                      Read More <ArrowRight size={16} />
                    </span>
                  </div>
                </motion.article>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-zinc-500">
              No articles found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
