'use client';

import React, { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Briefcase, Building2, MapPin, DollarSign, ExternalLink, XCircle, SearchX } from 'lucide-react';
import Link from 'next/link';

type AppStatus = 'all' | 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';

export default function MyApplications() {
  const [activeTab, setActiveTab] = useState<AppStatus>('all');
  
  const { data, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: async () => {
      // Backend automatically filters to requesting user
      const response = await api.get('/applications');
      return response.data.data;
    }
  });

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-700 italic border border-gray-200 uppercase tracking-widest text-[10px] px-2 py-0.5">Under Review</Badge>;
      case 'reviewed':
        return <Badge className="bg-blue-100 text-blue-700 border border-blue-200 uppercase tracking-widest text-[10px] px-2 py-0.5">Being Reviewed</Badge>;
      case 'shortlisted':
        return <Badge className="bg-purple-100 text-purple-700 border border-purple-200 uppercase tracking-widest text-[10px] px-2 py-0.5 font-bold">Shortlisted 🎉</Badge>;
      case 'rejected':
        return <Badge variant="error" className="uppercase tracking-widest text-[10px] px-2 py-0.5 font-bold bg-rose-100 text-rose-700 border border-rose-200">Not Selected</Badge>;
      case 'hired':
        return <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase tracking-widest text-[10px] px-2 py-0.5 font-bold">Hired! 🎉</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const applications = Array.isArray(data) ? data : data?.applications || [];
  const filteredApps = activeTab === 'all' 
    ? applications 
    : applications.filter((app: any) => app.status.toLowerCase() === activeTab);

  const tabs = ['All', 'Pending', 'Reviewed', 'Shortlisted', 'Rejected', 'Hired'];

  return (
    <ProtectedRoute allowedRoles={['jobseeker']}>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-foreground">My Applications</h1>
            <p className="text-muted-foreground font-medium mt-1">Track and manage your submitted job applications.</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar gap-2">
           <div className="flex p-1 bg-muted/50 rounded-2xl border border-border inline-flex">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase() as AppStatus)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all relative ${activeTab === tab.toLowerCase() ? 'text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                >
                  {activeTab === tab.toLowerCase() && (
                    <motion.div layoutId="app-tab" className="absolute inset-0 bg-background border border-border/50 rounded-xl z-0" />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              ))}
           </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-card border border-border rounded-2xl h-32 w-full" />
            ))
          ) : filteredApps.length === 0 ? (
            <div className="w-full p-12 bg-card border border-dashed border-border/60 rounded-3xl flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                <SearchX className="w-10 h-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-xl font-black text-foreground">No applications found</h3>
              <p className="text-muted-foreground mt-2 max-w-sm">
                You haven't submitted any applications that match the "{tabs.find(t => t.toLowerCase() === activeTab)}" status.
              </p>
              {activeTab !== 'all' && (
                <Button onClick={() => setActiveTab('all')} variant="outline" className="mt-6 rounded-xl font-bold">
                  View All Applications
                </Button>
              )}
            </div>
          ) : (
            <AnimatePresence>
              {filteredApps.map((app: any, idx: number) => {
                const job = app.job || {};
                const appliedDate = new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ delay: idx * 0.05 }}
                    key={app._id}
                    className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm hover:border-primary/30 transition-all flex flex-col sm:flex-row gap-6 relative group"
                  >
                    <div className="w-16 h-16 shrink-0 bg-primary/10 rounded-2xl flex items-center justify-center font-black text-2xl text-primary border border-primary/20">
                      {(job.company || 'C').charAt(0)}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <Link href={`/jobs/${job._id}`} className="text-lg font-black hover:text-primary transition-colors pr-4 block">
                            {job.title || 'Unknown Position'}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-bold text-muted-foreground">{job.company || 'Unknown Company'}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-2">
                          {getStatusBadge(app.status)}
                          <span className="text-xs font-bold text-muted-foreground uppercase opacity-70">
                            Applied {appliedDate}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 pt-2 border-t border-border/50">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5 text-primary/70" /> {job.location || 'Remote'}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> 
                          {job.salary ? `${job.salary.min?.toLocaleString() || 0} - ${job.salary.max?.toLocaleString() || 0}` : 'Competitive'}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="w-full sm:w-auto flex flex-row sm:flex-col gap-2 pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-border/50 sm:pl-6 justify-center">
                       <Button variant="outline" size="sm" className="w-full rounded-xl font-bold text-xs" onClick={() => window.location.href=`/jobs/${job._id}`}>
                          View Job <ExternalLink className="w-3 h-3 ml-2" />
                       </Button>
                       {app.status.toLowerCase() === 'pending' && (
                         <Button variant="outline" size="sm" className="w-full rounded-xl font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 border-none text-xs">
                           Withdraw <XCircle className="w-3 h-3 ml-2" />
                         </Button>
                       )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
