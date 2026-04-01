'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import DataWrapper from '@/components/dashboard/DataWrapper';
import { Eye, Search, Edit2, Trash2, Users, Plus, Briefcase, ExternalLink, MoreVertical, XCircle, LayoutGrid, List } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { IJob } from '@/types';

export default function MyJobs() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['employer-jobs'],
    queryFn: async () => {
      // Endpoint to get jobs created by the logged-in employer
      const response = await api.get('/jobs/my-jobs'); 
      return response.data.data as IJob[];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/jobs/${id}`);
    },
    onSuccess: () => {
      toast.success('Job posting permanently removed');
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
    },
    onError: () => {
      toast.error('Failed to delete job posting');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      await api.patch(`/jobs/${id}`, { status });
    },
    onSuccess: (_, variables) => {
      toast.success(`Job marked as ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
    },
    onError: () => {
      toast.error('Failed to update job status');
    }
  });

  const jobs = Array.isArray(data) ? data : [];
  
  const filteredJobs = jobs.filter((job: IJob) => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this job? This action is irreversible.')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'active':
        return <Badge variant="success" className="uppercase tracking-[0.15em] text-[9px] px-3 py-1 font-black bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Active</Badge>;
      case 'draft':
        return <Badge variant="secondary" className="uppercase tracking-[0.15em] text-[9px] px-3 py-1 font-black bg-amber-500/10 text-amber-500 border-amber-500/20">Draft</Badge>;
      case 'closed':
        return <Badge variant="error" className="uppercase tracking-[0.15em] text-[9px] px-3 py-1 font-black bg-rose-500/10 text-rose-500 border-rose-500/20">Closed</Badge>;
      default:
        return <Badge className="uppercase tracking-[0.15em] text-[9px] px-3 py-1 font-black">{status}</Badge>;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['employer']}>
      <DataWrapper 
        isLoading={isLoading} 
        error={error} 
        retry={refetch}
        loadingMessage="Retrieving your job listings..."
      >
        <div className="space-y-12 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-wider border border-primary/20">
                <Briefcase className="w-3 h-3" /> Employer Command Center
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight leading-tight italic uppercase">Manage Postings</h1>
              <p className="text-muted-foreground font-medium max-w-md text-sm">Control your active listings, track candidate flow, and optimize your recruitment pipeline.</p>
            </div>
            
            <Link href="/dashboard/post-job" className="w-full lg:w-auto">
              <Button className="w-full h-14 md:h-16 px-10 rounded-2xl font-black text-sm shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2">
                 <Plus className="w-5 h-5" /> Post New Job
              </Button>
            </Link>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-card/30 p-4 rounded-[2rem] border border-border/60">
             <div className="relative w-full sm:max-w-md group">
                <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search by title, category, or status..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-background/50 border border-border/40 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-background transition-all"
                />
             </div>
             
             <div className="flex bg-muted/20 p-1.5 rounded-2xl border border-border/40">
                <button onClick={() => setViewMode('table')} className={`p-3 rounded-xl transition-all ${viewMode === 'table' ? 'bg-background shadow-lg text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                  <List className="w-5 h-5" />
                </button>
                <button onClick={() => setViewMode('grid')} className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-background shadow-lg text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                  <LayoutGrid className="w-5 h-5" />
                </button>
             </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {filteredJobs.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="w-full p-24 bg-card border border-dashed border-primary/20 rounded-[4rem] flex flex-col items-center justify-center text-center shadow-xl shadow-primary/5"
              >
                <div className="w-28 h-28 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mb-10 relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-[2.5rem] animate-ping opacity-20" />
                  <Briefcase className="w-14 h-14 text-primary/40" />
                </div>
                <h3 className="text-3xl font-black text-foreground mb-4">No job postings found</h3>
                <p className="text-muted-foreground mb-12 max-w-md text-lg font-medium leading-relaxed">
                  {searchTerm 
                    ? `We couldn't find any listings matching "${searchTerm}". Try a different search term.`
                    : "You haven't posted any jobs yet. Start your recruitment journey today!"}
                </p>
                {!searchTerm && (
                  <Link href="/dashboard/post-job">
                    <Button variant="outline" className="h-16 px-12 rounded-[2rem] font-black border-4 border-primary/10 hover:bg-primary/5 hover:border-primary/30 transition-all text-sm uppercase tracking-widest">
                      Post Your First Job
                    </Button>
                  </Link>
                )}
              </motion.div>
            ) : viewMode === 'table' ? (
              <motion.div 
                key="table"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border shadow-2xl shadow-primary/5 rounded-[2rem] md:rounded-[3rem] overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-muted/30 border-b border-border/50">
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Position Information</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Current Status</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Talent Pipeline</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Publication Date</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Operational Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {filteredJobs.map((job: IJob) => (
                        <motion.tr 
                          key={job._id || job.id}
                          className="hover:bg-primary/5 transition-all group"
                        >
                          <td className="px-8 py-8">
                            <div className="space-y-1.5">
                              <Link href={`/jobs/${job._id || job.id}`} className="font-black text-lg text-foreground hover:text-primary transition-colors block tracking-tight">
                                {job.title}
                              </Link>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md uppercase tracking-wider">{job.category}</span>
                                <span className="w-1 h-1 rounded-full bg-border" />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{job.type}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-8 text-center">
                            <div className="relative inline-block group/status">
                              {getStatusBadge(job.status)}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 pointer-events-none opacity-0 group-hover/status:opacity-100 group-hover/status:pointer-events-auto transition-all">
                                 <div className="bg-popover border border-border rounded-xl shadow-2xl p-2 flex flex-col gap-1 min-w-[120px]">
                                    {['active', 'draft', 'closed'].filter(s => s !== job.status).map(s => (
                                      <button 
                                        key={s}
                                        onClick={() => updateStatusMutation.mutate({ id: (job._id || job.id) as string, status: s })}
                                        className="text-[10px] font-black uppercase p-2 hover:bg-muted rounded-lg text-left transition-colors"
                                      >
                                        Mark as {s}
                                      </button>
                                    ))}
                                 </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-8 text-center">
                             <Link href={`/dashboard/applications?jobId=${job._id || job.id}`}>
                                <button className="inline-flex items-center gap-3 bg-muted/30 hover:bg-primary/10 hover:text-primary px-5 py-3 rounded-2xl border border-border/40 transition-all group/pip">
                                   <Users className="w-4 h-4" />
                                   <span className="font-black text-sm">{job.applicantsCount || 0}</span>
                                   <ExternalLink className="w-3 h-3 opacity-0 group-hover/pip:opacity-100 transition-all translate-x-1 group-hover/pip:translate-x-0" />
                                </button>
                             </Link>
                          </td>
                          <td className="px-8 py-8">
                            <div className="flex items-center gap-2 text-xs font-black text-muted-foreground uppercase tracking-tighter">
                               {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          </td>
                          <td className="px-8 py-8 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <Link href={`/dashboard/applications?jobId=${job._id || job.id}`}>
                                <Button variant="outline" size="sm" className="h-11 px-5 rounded-xl font-black text-[10px] uppercase border-none bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all">
                                   Applications
                                </Button>
                              </Link>
                              
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="w-11 h-11 p-0 rounded-xl hover:bg-amber-500/10 hover:text-amber-500 border-none bg-muted/20" title="Edit Post">
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button onClick={() => handleDelete((job._id || job.id) as string)} variant="outline" size="sm" className="w-11 h-11 p-0 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 border-none bg-muted/20" title="Delete Post">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
              >
                 {filteredJobs.map((job: IJob) => (
                    <motion.div 
                      key={job._id || job.id}
                      layout
                      className="bg-card border border-border/60 p-8 rounded-[2.5rem] shadow-xl shadow-primary/5 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all group flex flex-col"
                    >
                       <div className="flex justify-between items-start mb-8">
                          <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center font-black text-3xl border border-primary/20">
                             {job.title.charAt(0).toUpperCase()}
                          </div>
                          {getStatusBadge(job.status)}
                       </div>
                       
                       <div className="space-y-2 mb-8 flex-1">
                          <h3 className="text-2xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors">{job.title}</h3>
                          <div className="flex flex-wrap gap-2">
                             <span className="text-[10px] font-black text-muted-foreground uppercase">{job.category}</span>
                             <span className="text-muted-foreground opacity-30">•</span>
                             <span className="text-[10px] font-black text-muted-foreground uppercase">{job.type}</span>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4 mb-8 pt-8 border-t border-border/40">
                          <div className="space-y-1">
                             <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Applicants</p>
                             <p className="font-bold text-foreground text-xl">{job.applicantsCount || 0}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Posted</p>
                             <p className="font-bold text-foreground">{new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-3">
                          <Link href={`/dashboard/applications?jobId=${job._id || job.id}`} className="col-span-2">
                             <Button className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest bg-primary/5 text-primary hover:bg-primary hover:text-white border-none transition-all">
                                View Applications
                             </Button>
                          </Link>
                          <Button variant="outline" className="h-12 rounded-xl text-muted-foreground hover:bg-amber-500/10 hover:text-amber-500 border-none bg-muted/20">
                             <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button onClick={() => handleDelete((job._id || job.id) as string)} variant="outline" className="h-12 rounded-xl text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 border-none bg-muted/20">
                             <Trash2 className="w-4 h-4" />
                          </Button>
                       </div>
                    </motion.div>
                 ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DataWrapper>
    </ProtectedRoute>
  );
}
