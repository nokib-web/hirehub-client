import React from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ArrowRight, Calendar, User } from 'lucide-react';
import Link from 'next/link';

export default function BlogPage() {
  const blogs = [
    { title: "10 Resume Mistakes That Cost You Interviews", tag: "Career Tips", author: "Sarah Drasner", date: "Oct 12, 2024", excerpt: "Learn the most common pitfalls hiring managers see every day and exactly how to fix them to land your dream job faster.", color: "from-blue-500 to-indigo-500" },
    { title: "How to Ace Behavioral Interview Questions", tag: "Interviews", author: "Michael Chen", date: "Oct 10, 2024", excerpt: "Master the STAR method and impress interviewers with structured, compelling stories about your past professional experiences.", color: "from-emerald-400 to-teal-500" },
    { title: "Remote Work: The Complete Guide for 2024", tag: "Work Life", author: "Amara Rahman", date: "Oct 05, 2024", excerpt: "Everything you need to know about setting up your home office, managing time zones, and staying visible in a distributed team.", color: "from-orange-400 to-rose-400" },
    { title: "Salary Negotiation Scripts That Actually Work", tag: "Career Tips", author: "David Smith", date: "Sep 28, 2024", excerpt: "Stop leaving money on the table. Use these proven conversation frameworks to confidently ask for what you deserve.", color: "from-purple-500 to-fuchsia-500" },
    { title: "Building a LinkedIn Profile That Gets Noticed", tag: "Networking", author: "Sarah Drasner", date: "Sep 20, 2024", excerpt: "Optimize your headline, summary, and experience sections to rank higher in recruiter searches and attract inbound opportunities.", color: "from-sky-400 to-blue-500" },
    { title: "The Future of AI in Recruitment", tag: "Industry Trends", author: "Michael Chen", date: "Sep 15, 2024", excerpt: "Explore how machine learning is changing the way companies source, screen, and hire candidates across the globe.", color: "from-amber-400 to-orange-500" }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* Header */}
      <section className="bg-primary/5 py-20 px-6 lg:px-8 border-b border-border text-center">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground uppercase tracking-wider">
          The <span className="text-primary">HireHub</span> Blog
        </h1>
        <p className="mt-4 text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
          Actionable career advice, proven interview strategies, and the latest trends shaping the future of work.
        </p>
      </section>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((b, i) => (
              <article key={i} className="bg-card rounded-[2rem] border border-border overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2 group flex flex-col">
                 
                 <div className={`w-full h-48 bg-gradient-to-br ${b.color} relative overflow-hidden shrink-0`}>
                   <div className="absolute inset-0 bg-black/10 mix-blend-overlay group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: 'radial-gradient(circle at top right, rgba(255,255,255,0.3) 0%, transparent 60%)' }} />
                   <Badge className="absolute top-4 left-4 bg-white/90 text-foreground backdrop-blur-sm px-3 py-1 font-black uppercase text-[10px] tracking-wider border-none shadow-sm hover:bg-white">
                     {b.tag}
                   </Badge>
                 </div>

                 <div className="p-8 flex-1 flex flex-col">
                   <h2 className="text-2xl font-black text-foreground mb-4 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                     <Link href="#">{b.title}</Link>
                   </h2>
                   <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-medium line-clamp-3 flex-1">
                     {b.excerpt}
                   </p>
                   
                   <div className="flex items-center justify-between pt-6 border-t border-border mt-auto">
                      <div className="space-y-1">
                         <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                            <User className="w-3.5 h-3.5 text-primary" /> {b.author}
                         </div>
                         <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                            <Calendar className="w-3.5 h-3.5" /> {b.date}
                         </div>
                      </div>
                      
                      <button className="w-10 h-10 rounded-full bg-muted/50 text-foreground flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                   </div>
                 </div>
              </article>
            ))}
         </div>

         <div className="mt-16 text-center">
            <Button variant="outline" className="h-14 px-10 rounded-2xl font-black text-lg shadow-sm">
              Load More Articles
            </Button>
         </div>
      </div>
    </div>
  );
}
