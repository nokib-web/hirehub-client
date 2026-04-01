'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Calendar, User, Clock, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

const BlogDetail = () => {
  const { slug } = useParams();

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const response = await api.get(`/blogs/${slug}`);
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="container px-4 py-32 mx-auto">
        <div className="animate-pulse space-y-8 max-w-4xl mx-auto">
          <div className="h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-3/4" />
          <div className="h-64 bg-zinc-100 dark:bg-zinc-800 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-full" />
            <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-full" />
            <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container px-4 py-32 mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Article Not Found</h2>
        <Link href="/blog">
          <Button>Back to Blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen pt-32 pb-20 relative z-0">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link 
            href="/blog" 
            className="group flex items-center gap-2 text-zinc-500 hover:text-blue-600 transition-colors mb-8"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 mb-6">
              {blog.category}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-zinc-100 mb-8 leading-[1.1]">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-zinc-500 dark:text-zinc-400 pb-8 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-blue-600">
                  {blog.author?.name?.charAt(0)}
                </div>
                <span className="font-medium text-zinc-900 dark:text-zinc-200">{blog.author?.name}</span>
              </div>
              <div className="flex items-center gap-2 h-fit">
                <Calendar size={18} />
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 h-fit">
                <Clock size={18} />
                <span>5 min read</span>
              </div>
            </div>
          </motion.div>

          {/* Social Share & Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400">
            {blog.coverImage && (
              <img 
                src={blog.coverImage} 
                alt={blog.title} 
                className="w-full rounded-3xl mb-12 shadow-2xl"
              />
            )}
            
            <div className="whitespace-pre-wrap text-zinc-600 dark:text-zinc-300 leading-relaxed text-xl">
              {blog.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
