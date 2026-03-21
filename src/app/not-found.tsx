import React from 'react';
import Link from 'next/link';
import { Briefcase, Home, Search } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
       <div className="max-w-md w-full text-center space-y-6">
          <div className="relative w-48 h-48 mx-auto -mb-8">
             <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
             <div className="w-full h-full bg-card border-2 border-border rounded-[3rem] shadow-2xl flex items-center justify-center relative z-10 rotate-12 hover:rotate-0 transition-transform duration-500">
                <Briefcase className="w-20 h-20 text-primary" strokeWidth={1.5} />
             </div>
             <p className="absolute -bottom-4 -right-4 text-9xl font-black text-background text-transparent bg-clip-text bg-gradient-to-br from-primary/20 to-primary/5 select-none -z-10">
               404
             </p>
          </div>

          <h1 className="text-5xl font-black text-foreground tracking-tight">Oops! Page not found</h1>
          <p className="text-lg text-muted-foreground font-medium max-w-sm mx-auto">
            The job or page you're looking for seems to have been moved or no longer exists.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link href="/" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-14 px-8 rounded-2xl font-black text-lg gap-2 shadow-xl shadow-primary/20">
                  <Home className="w-5 h-5" /> Back to Home
                </Button>
             </Link>
             <Link href="/jobs" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-2xl font-black text-lg gap-2">
                  <Search className="w-5 h-5 text-muted-foreground" /> Browse Jobs
                </Button>
             </Link>
          </div>
       </div>
    </div>
  );
}
