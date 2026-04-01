'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface DataWrapperProps {
  isLoading: boolean;
  error: any;
  retry: () => void;
  children: React.ReactNode;
  loadingMessage?: string;
  skeleton?: React.ReactNode;
}

export default function DataWrapper({ 
  isLoading, 
  error, 
  retry, 
  children, 
  loadingMessage = "Fetching data...",
  skeleton
}: DataWrapperProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setElapsedTime(0);
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  if (isLoading) {
    if (elapsedTime >= 60) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-3xl border border-dashed border-primary/30 min-h-[400px]">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/30 rounded-2xl flex items-center justify-center text-amber-600 mb-6 animate-pulse">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <h3 className="text-xl font-black mb-2">Server is waking up...</h3>
          <p className="text-muted-foreground mb-8 max-w-sm">
            This may take up to 60 seconds on first load as our server is hosted on a free tier. 
            Thank you for your patience!
          </p>
          <button 
            onClick={retry}
            className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      );
    }

    return (
      <div className="w-full">
        {skeleton || (
           <div className="w-full h-[400px] flex flex-col items-center justify-center gap-4 animate-pulse">
              <Loader2 className="w-10 h-10 text-primary animate-spin opacity-50" />
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{loadingMessage}</p>
           </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-3xl border border-dashed border-rose-500/30 min-h-[400px]">
        <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/30 rounded-2xl flex items-center justify-center text-rose-600 mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black mb-2">Oops! Something went wrong</h3>
        <p className="text-muted-foreground mb-8 max-w-sm">
          {error.response?.data?.message || error.message || "We couldn't fetch the requested data. Please check your connection and try again."}
        </p>
        <button 
          onClick={retry}
          className="flex items-center space-x-2 px-6 py-3 bg-foreground text-background rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-foreground/10"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Now</span>
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
