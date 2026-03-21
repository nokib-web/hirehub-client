'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Loader2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background gap-4">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
        </motion.div>
        <p className="text-sm font-bold text-muted-foreground animate-pulse tracking-widest uppercase">
          Verifying Access...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-6">
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md bg-card p-10 rounded-[2.5rem] shadow-2xl border border-border text-center space-y-6"
          >
            <div className="w-20 h-20 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center text-red-600 mx-auto scale-110 shadow-lg shadow-red-500/10 border-4 border-background">
              <ShieldAlert className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight">Access Denied</h1>
              <p className="text-muted-foreground font-medium leading-relaxed">
                Your role <span className="text-red-500 font-bold uppercase tracking-tighter px-2 bg-red-500/10 rounded-md">{(user as any).role}</span> does not have the required permissions to view this content.
              </p>
            </div>

            <button
               onClick={() => router.push('/dashboard')}
               className="w-full py-3.5 bg-foreground text-background font-black rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-foreground/10"
            >
              Back to Safety
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return <>{children}</>;
}
