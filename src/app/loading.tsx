import React from 'react';
import { Briefcase } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/40 rounded-full blur-xl animate-pulse" />
          <div className="w-16 h-16 bg-card border-2 border-primary rounded-2xl flex items-center justify-center relative z-10 shadow-xl overflow-hidden">
             <div className="absolute inset-0 bg-primary/10 w-full h-full animate-[spin_3s_linear_infinite]" />
             <Briefcase className="w-8 h-8 text-primary animate-bounce shadow-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
          </div>
        </div>
        <p className="font-black text-sm uppercase tracking-widest text-primary animate-pulse relative z-10 font-sans">
          Loading Data...
        </p>
      </div>
    </div>
  );
}
