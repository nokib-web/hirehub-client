'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ArrowRight, Calendar, User, Search } from 'lucide-react';
import Link from 'next/link';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  createdAt: string;
  author: {
    name: string;
  };
}

const CATEGORIES = ["All", "Career Advice", "Interview Tips", "Salary & Benefits", "Recruitment", "Industry News"];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const { data: response, isLoading } = useQuery({
    queryKey: ['blogs', activeCategory, search],
    queryFn: async () => {
      const params: any = {};
      if (activeCategory !== "All") params.category = activeCategory;
      if (search) params.search = search;
      const res = await api.get('/blogs', { params });
      return res.data;
    },
  });

  const blogs = response?.data || [];

  const getGradient = (category: string) => {
    switch (category) {
      case 'Career Advice': return 'from-blue-500 to-indigo-500';
      case 'Interview Tips': return 'from-emerald-400 to-teal-500';
      case 'Salary & Benefits': return 'from-orange-400 to-rose-400';
      case 'Recruitment': return 'from-purple-500 to-fuchsia-500';
      default: return 'from-sky-400 to-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-20">
      
      {/* Header */}
      <section className="bg-primary/5 py-20 px-6 lg:px-8 border-b border-border text-center">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground uppercase tracking-wider">
          The <span className="text-primary">HireHub</span> Blog
        </h1>
        <p className="mt-4 text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
          Actionable career advice, proven interview strategies, and the latest trends shaping the future of work.
        </p>
      </section>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 border ${
                  activeCategory === category
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                    : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         {isLoading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse bg-card h-96 rounded-[2rem] border border-border" />
              ))}
           </div>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((b: Blog) => (
                <Link key={b._id} href={`/blog/${b.slug}`} className="flex">
                  <article className="bg-card rounded-[2rem] border border-border overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2 group flex flex-col w-full">
                     <div className={`w-full h-48 bg-gradient-to-br ${getGradient(b.category)} relative overflow-hidden shrink-0`}>
                       <div className="absolute inset-0 bg-black/10 mix-blend-overlay group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: 'radial-gradient(circle at top right, rgba(255,255,255,0.3) 0%, transparent 60%)' }} />
                       <Badge className="absolute top-4 left-4 bg-white/90 text-foreground backdrop-blur-sm px-3 py-1 font-black uppercase text-[10px] tracking-wider border-none shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                         {b.category}
                       </Badge>
                     </div>

                     <div className="p-8 flex-1 flex flex-col">
                       <h2 className="text-2xl font-black text-foreground mb-4 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                         {b.title}
                       </h2>
                       <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-medium line-clamp-3 flex-1">
                         {b.excerpt}
                       </p>
                       
                       <div className="flex items-center justify-between pt-6 border-t border-border mt-auto">
                          <div className="space-y-1">
                             <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                                <User className="w-3.5 h-3.5 text-primary" /> {b.author?.name}
                             </div>
                             <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                                <Calendar className="w-3.5 h-3.5" /> {new Date(b.createdAt).toLocaleDateString()}
                             </div>
                          </div>
                          
                          <div className="w-10 h-10 rounded-full bg-muted/50 text-foreground flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                       </div>
                     </div>
                  </article>
                </Link>
              ))}
           </div>
         )}

         {!isLoading && blogs.length === 0 && (
           <div className="text-center py-20">
             <p className="text-muted-foreground font-medium">No articles found matching your criteria.</p>
             <Button 
               variant="ghost" 
               onClick={() => { setActiveCategory("All"); setSearch(""); }}
               className="mt-2 text-primary font-bold hover:bg-primary/5"
             >
               View all articles
             </Button>
           </div>
         )}
      </div>
    </div>
  );
}
