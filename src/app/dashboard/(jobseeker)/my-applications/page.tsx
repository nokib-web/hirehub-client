'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import DataWrapper from '@/components/dashboard/DataWrapper';
import { Building2, MapPin, DollarSign, ExternalLink, XCircle, SearchX, Briefcase } from 'lucide-react';
import { IApplication, IJob } from '@/types';
import Link from 'next/link';
import toast from 'react-hot-toast';

type AppStatus = 'all' | 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';

export default function MyApplications() {
  const [activeTab, setActiveTab] = useState<AppStatus>('all');
  const queryClient = useQueryClient();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['my-applications'],
    queryFn: async () => {
      const response = await api.get('/applications');
      return response.data.data as IApplication[];
    }
  });

  const withdrawMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/applications/${id}`);
    },
    onSuccess: () => {
      toast.success('Application withdrawn successfully');
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
    },
    onError: () => {
      toast.error('Failed to withdraw application');
    }
  });

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return <Badge variant="warning" className="uppercase tracking-[0.15em] text-[9px] px-3 py-1 font-black border-amber-500/30">Pending</Badge>;
      case 'reviewed':
        return <Badge variant="secondary" className="uppercase tracking-[0.15em] text-[9px] px-3 py-1 font-black border-blue-500/30">Reviewed</Badge>;
      case 'shortlisted':
        return <Badge variant="primary" className="uppercase tracking-[0.15em] text-[9px] px-3 py-1 font-black border-purple-500/30 bg-purple-500/10 text-purple-500">Shortlisted</Badge>;
      case 'rejected':
        return <Badge variant="error" className="uppercase tracking-[0.15em] text-[9px] px-3 py-1 font-black border-rose-500/30">Rejected</Badge>;
      case 'hired':
        return <Badge variant="success" className="uppercase tracking-[0.15em] text-[9px] px-3 py-1 font-black border-emerald-500/30">Hired 🎉</Badge>;
      default:
        return <Badge className="uppercase tracking-[0.15em] text-[9px] px-3 py-1 font-black">{status}</Badge>;
    }
  };

  const applications = Array.isArray(data) ? data : [];
  const filteredApps = activeTab === 'all' 
    ? applications 
    : applications.filter((app: IApplication) => app.status.toLowerCase() === activeTab);

  const tabs: { label: string; value: AppStatus }[] = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Reviewed', value: 'reviewed' },
    { label: 'Shortlisted', value: 'shortlisted' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Hired', value: 'hired' }
  ];

  return (
    <ProtectedRoute allowedRoles={['jobseeker']}>
      <DataWrapper 
        isLoading={isLoading} 
        error={error} 
        retry={refetch}
        loadingMessage="Fetching your applications..."
      >
        <div className="space-y-10 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-wider border border-primary/20">
                <Briefcase className="w-3 h-3" /> Career Portal
              </div>
              <h1 className="text-4xl font-black text-foreground tracking-tight">Applied Positions</h1>
              <p className="text-muted-foreground font-medium max-w-md">Track your progress and manage your submitted job applications in real-time.</p>
            </div>
            
            <Link href="/jobs">
              <Button className="h-14 px-8 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all">
                Find More Jobs
              </Button>
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="sticky top-20 z-30 bg-background/50 backdrop-blur-xl -mx-4 px-4 py-4 sm:mx-0 sm:px-0">
             <div className="flex p-1.5 bg-card/50 backdrop-blur-md rounded-[1.5rem] border border-border shadow-xl shadow-primary/5 inline-flex flex-wrap md:flex-nowrap gap-1">
                {tabs.map(tab => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all relative ${activeTab === tab.value ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                  >
                    {activeTab === tab.value && (
                      <motion.div layoutId="app-tab" className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-2xl z-0" />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                ))}
             </div>
          </div>

          {/* List */}
          <div className="space-y-6">
            {filteredApps.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="w-full p-20 bg-card border border-dashed border-primary/20 rounded-[3rem] flex flex-col items-center justify-center text-center shadow-2xl shadow-primary/5"
              >
                <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center mb-8 relative">
                   <div className="absolute inset-0 bg-primary/10 rounded-[2rem] animate-ping opacity-20" />
                   <SearchX className="w-12 h-12 text-primary/40" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-4">No applications found</h3>
                <p className="text-muted-foreground mb-10 max-w-sm font-medium leading-relaxed">
                  {activeTab === 'all' 
                    ? "You haven't applied to any jobs yet. Start your journey today!"
                    : `You don't have any applications with status "${activeTab.toUpperCase()}".`}
                </p>
                <Link href="/jobs">
                  <Button variant="outline" className="h-14 px-10 rounded-[1.5rem] font-black border-2 border-primary/20 hover:bg-primary/5 transition-all">
                    Browse Available Jobs
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="popLayout">
                {filteredApps.map((app: IApplication, idxValue: number) => {
                    const job = app.job as IJob;
                    const appliedDate = new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const appId = app.id || app._id;
                    
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, scale: 0.9, x: 50 }}
                        transition={{ duration: 0.4, delay: idxValue * 0.05 }}
                        key={appId}
                        layout
                        className="bg-card border border-border rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-primary/5 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col lg:flex-row gap-8 relative overflow-hidden group"
                      >
                        {/* Status Strip */}
                        <div className={`absolute top-0 left-0 w-2 h-full ${
                          app.status === 'hired' ? 'bg-emerald-500' : 
                          app.status === 'rejected' ? 'bg-rose-500' : 
                          app.status === 'shortlisted' ? 'bg-purple-500' : 
                          'bg-primary'
                        } opacity-40 group-hover:opacity-100 transition-opacity`} />

                        <div className="w-20 h-20 shrink-0 bg-muted/50 rounded-3xl flex items-center justify-center font-black text-3xl text-primary border border-border group-hover:scale-105 transition-transform duration-500">
                          {job.company ? job.company.charAt(0).toUpperCase() : 'H'}
                        </div>
                        
                        <div className="flex-1 space-y-5">
                          <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
                            <div className="space-y-1">
                              <Link href={`/jobs/${job._id}`} className="text-2xl font-black text-foreground hover:text-primary transition-colors pr-4 block tracking-tight leading-tight">
                                {job.title || 'Untitled Position'}
                              </Link>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-primary px-3 py-1 bg-primary/5 rounded-lg">{job.company || 'Private Cloud'}</span>
                                <div className="w-1 h-1 rounded-full bg-border" />
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Applied {appliedDate}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {getStatusBadge(app.status)}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-6 pt-6 border-t border-border/60">
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground/80">
                              <MapPin className="w-4 h-4 text-primary" /> {job.location || 'Remote'}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground/80">
                              <DollarSign className="w-4 h-4 text-emerald-500" /> 
                              {job.salary ? `${job.salary.min?.toLocaleString() || 0} - ${job.salary.max?.toLocaleString() || 0}` : 'Competitive'}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground/80">
                               <Briefcase className="w-4 h-4 text-amber-500" /> {job.type || 'Full-time'}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[160px] lg:border-l lg:border-border/60 lg:pl-8 justify-center">
                           <Link href={`/jobs/${job?._id || ''}`} className="w-full">
                              <Button variant="outline" className="w-full h-12 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 hover:bg-muted/30">
                                View Details <ExternalLink className="w-3 h-3 ml-2" />
                              </Button>
                           </Link>
                           
                           {app.status.toLowerCase() === 'pending' && (
                             <Button 
                               variant="outline" 
                               onClick={() => withdrawMutation.mutate(appId as string)}
                               isLoading={withdrawMutation.isPending}
                               className="w-full h-12 rounded-xl font-black text-[10px] uppercase tracking-widest bg-rose-500/5 hover:bg-rose-500 hover:text-white border-none text-rose-500 transition-all active:scale-95"
                             >
                               Withdraw <XCircle className="w-3 h-3 ml-2" />
                             </Button>
                           )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </DataWrapper>
    </ProtectedRoute>
  );
}
