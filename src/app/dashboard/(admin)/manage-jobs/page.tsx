'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Search, Trash2, Eye, Star, Briefcase, Filter, ArrowRight, ArrowLeft, Ghost, ShieldAlert, BadgeCheck, Zap, MoreVertical, LayoutGrid, List } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import DataWrapper from '@/components/dashboard/DataWrapper';
import { IJob, ApiResponse } from '@/types';

export default function ManageJobs() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const limit = 10;

  const { data, isLoading, error, refetch } = useQuery<ApiResponse<IJob[]>>({
    queryKey: ['admin-jobs', page, searchTerm, categoryFilter, statusFilter],
    queryFn: async () => {
      const params = {
        page,
        limit,
        search: searchTerm,
        category: categoryFilter === 'All' ? undefined : categoryFilter,
        status: statusFilter === 'All' ? undefined : statusFilter.toLowerCase()
      };
      const res = await api.get('/admin/jobs', { params });
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/jobs/${id}`);
    },
    onSuccess: () => {
      toast.success('Job listing permanently vaporized', { icon: '🔥' });
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
    },
    onError: () => {
      toast.error('Failed to eliminate job listing');
    }
  });

  const toggleFeatureMutation = useMutation({
    mutationFn: async ({ id, isFeatured }: { id: string, isFeatured: boolean }) => {
      await api.patch(`/admin/jobs/${id}`, { isFeatured });
    },
    onSuccess: (_, variables) => {
      toast.success(variables.isFeatured ? 'Job promoted to featured status' : 'Job removed from featured list', {
        icon: variables.isFeatured ? '🌟' : '🌑',
        style: { borderRadius: '1rem', fontWeight: 'bold' }
      });
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
    },
    onError: () => {
      toast.error('Failed to update promotion status');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      await api.patch(`/admin/jobs/${id}`, { status });
    },
    onSuccess: (_, variables) => {
      toast.success(`Job status changed to ${variables.status.toUpperCase()}`);
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
    },
    onError: () => {
      toast.error('Failed to update operational status');
    }
  });

  const jobs = data?.data || [];
  const totalPages = data?.meta?.total ? Math.ceil(data.meta.total / limit) : 1;
  const categories = ['All', 'Technology', 'Marketing', 'Design', 'Finance', 'Healthcare', 'Sales'];

  const handleDelete = (id: string) => {
    if (window.confirm('PROTOCOL WARNING: This will permanently delete the selected job listing across the entire platform. This action is final.')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-black uppercase text-[9px] tracking-widest px-3 py-1">Active</Badge>;
      case 'draft':
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-black uppercase text-[9px] tracking-widest px-3 py-1">Draft</Badge>;
      case 'closed':
        return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 font-black uppercase text-[9px] tracking-widest px-3 py-1">Closed</Badge>;
      default:
        return <Badge className="bg-muted/50 font-black uppercase text-[9px] tracking-widest px-3 py-1">{status}</Badge>;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DataWrapper 
        isLoading={isLoading} 
        error={error} 
        retry={refetch}
        loadingMessage="Scanning global recruitment inventory..."
      >
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
             <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-wider border border-primary/20">
                  <Briefcase className="w-3 h-3" /> Market Moderation Console
                </div>
                <h1 className="text-5xl font-black text-foreground tracking-tight leading-none italic uppercase">Recruitment Index</h1>
                <p className="text-muted-foreground font-medium max-w-lg">Universal market oversight. Audit job liquidity, manage promotion slots, and ensure platform listings meet quality protocols.</p>
             </div>

             <div className="flex bg-muted/20 p-2 rounded-2xl border border-border/40 shrink-0">
                <button onClick={() => setViewMode('table')} className={`p-3 rounded-xl transition-all ${viewMode === 'table' ? 'bg-background shadow-xl text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                  <List className="w-5 h-5" />
                </button>
                <button onClick={() => setViewMode('grid')} className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-background shadow-xl text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                  <LayoutGrid className="w-5 h-5" />
                </button>
             </div>
          </div>

          {/* Advanced Controls */}
          <div className="bg-card/30 p-8 rounded-[3rem] border border-border/60 space-y-8 shadow-xl shadow-primary/5">
             <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <div className="xl:col-span-2 relative group">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                   <input 
                     type="text" placeholder="Search parameters: Title, Company, ID..." 
                     value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                     className="w-full pl-16 pr-8 py-5 bg-background border border-border/40 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary font-bold text-sm transition-all"
                   />
                </div>
                
                <div className="relative">
                   <Filter className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }} className="w-full pl-14 pr-10 py-5 bg-background border border-border/40 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer">
                      {categories.map(c => <option key={c} value={c}>{c} SECTOR</option>)}
                   </select>
                   <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground rotate-90" />
                </div>

                <div className="relative">
                   <Zap className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="w-full pl-14 pr-10 py-5 bg-background border border-border/40 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer">
                      <option value="All">ALL PROTOCOLS</option>
                      <option value="Active">ACTIVE OPS</option>
                      <option value="Draft">DRAFT MODE</option>
                      <option value="Closed">TERMINATED</option>
                   </select>
                   <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground rotate-90" />
                </div>
             </div>
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            {jobs.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="w-full p-32 bg-card border border-dashed border-border/60 rounded-[4rem] flex flex-col items-center justify-center text-center shadow-xl shadow-primary/5"
              >
                <Ghost className="w-20 h-20 text-muted-foreground/30 mb-8" />
                <h3 className="text-3xl font-black text-foreground italic uppercase tracking-tighter">Zero Market Liquidity</h3>
                <p className="text-muted-foreground max-w-sm mt-4 font-medium italic">No listings detected within your current scanning radius. Adjust your filters or initiate a re-scan.</p>
                <Button onClick={() => { setSearchTerm(''); setCategoryFilter('All'); setStatusFilter('All'); }} variant="outline" className="mt-12 h-14 px-10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border-2">
                   Reset Scanning Parameters
                </Button>
              </motion.div>
            ) : viewMode === 'table' ? (
              <motion.div 
                key="table"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border shadow-2xl shadow-primary/5 rounded-[3rem] overflow-hidden"
              >
                 <div className="overflow-x-auto">
                   <table className="w-full text-left">
                     <thead>
                       <tr className="bg-muted/30 border-b border-border/50">
                         <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Listing Node & Organization</th>
                         <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Operational State</th>
                         <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Promotional Slot</th>
                         <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Creation Marker</th>
                         <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Moderator Control</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-border/40">
                       {jobs.map((job: IJob, idx: number) => (
                         <motion.tr 
                           key={job._id || job.id} 
                           initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
                           className="hover:bg-primary/5 transition-all group"
                         >
                           <td className="px-10 py-8">
                             <div className="space-y-1.5">
                               <Link href={`/jobs/${job._id || job.id}`} className="font-black text-lg text-foreground hover:text-primary transition-colors block italic tracking-tighter">
                                 {job.title}
                               </Link>
                               <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-[9px] font-black uppercase tracking-[0.2em] border-none bg-muted/60 px-3">{job.company || 'Private Entity'}</Badge>
                                  <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">{job.category}</span>
                               </div>
                             </div>
                           </td>
                           <td className="px-10 py-8 text-center">
                             {getStatusBadge(job.status)}
                           </td>
                           <td className="px-10 py-8 text-center">
                              <button 
                                onClick={() => toggleFeatureMutation.mutate({ id: (job._id || job.id) as string, isFeatured: !job.isFeatured })} 
                                className={`p-4 rounded-[1.25rem] transition-all hover:scale-110 active:scale-90 ${job.isFeatured ? 'bg-amber-400/10 shadow-2xl shadow-amber-400/20' : 'bg-muted/20 hover:bg-muted/40'}`}
                              >
                                <Star className={`w-6 h-6 ${job.isFeatured ? 'fill-amber-400 text-amber-500' : 'text-muted-foreground/30'}`} />
                              </button>
                           </td>
                           <td className="px-10 py-8 text-[11px] font-black text-muted-foreground uppercase opacity-80">
                             {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                           </td>
                           <td className="px-10 py-8 text-right">
                             <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                                <Link href={`/jobs/${job._id || job.id}`}>
                                  <Button variant="outline" size="sm" className="w-12 h-12 p-0 rounded-xl hover:bg-blue-500 hover:text-white border-2 border-border/60 hover:border-blue-500 transition-all">
                                    <Eye className="w-5 h-5" />
                                  </Button>
                                </Link>
                                <Button 
                                  onClick={() => handleDelete((job._id || job.id) as string)} 
                                  variant="outline" size="sm" 
                                  className="w-12 h-12 p-0 rounded-xl hover:bg-rose-500 hover:text-white border-2 border-border/60 hover:border-rose-500 transition-all"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </Button>
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
                 {jobs.map((job: IJob) => (
                    <div 
                      key={job._id || job.id}
                      className="bg-card border border-border/60 p-10 rounded-[3rem] shadow-xl shadow-primary/5 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all group flex flex-col relative overflow-hidden"
                    >
                       {job.isFeatured && (
                          <div className="absolute top-8 right-8 text-amber-500">
                             <Star className="w-6 h-6 fill-amber-400" />
                          </div>
                       )}
                       
                       <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 text-primary flex items-center justify-center font-black text-3xl mb-8 border border-primary/20 italic">
                          {job.title.charAt(0).toUpperCase()}
                       </div>
                       
                       <div className="space-y-2 mb-10 flex-1">
                          <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none group-hover:text-primary transition-colors">{job.title}</h3>
                          <p className="text-sm font-bold text-muted-foreground uppercase opacity-60 tracking-tight">{job.company}</p>
                       </div>

                       <div className="flex flex-wrap gap-2 mb-10">
                          <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest">{job.category}</Badge>
                          {getStatusBadge(job.status)}
                       </div>

                       <div className="grid grid-cols-2 gap-4 pt-10 border-t border-border/40">
                          <Link href={`/jobs/${job._id || job.id}`} className="col-span-2">
                             <Button className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-primary/5 text-primary hover:bg-primary hover:text-white border-none transition-all">
                                View Intelligence
                             </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            onClick={() => toggleFeatureMutation.mutate({ id: (job._id || job.id) as string, isFeatured: !job.isFeatured })}
                            className={`h-14 rounded-2xl transition-all border-none ${job.isFeatured ? 'bg-amber-400/10 text-amber-500' : 'bg-muted/20 text-muted-foreground'}`}
                          >
                             <Star className={`w-5 h-5 ${job.isFeatured ? 'fill-amber-400' : ''}`} />
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => handleDelete((job._id || job.id) as string)}
                            className="h-14 rounded-2xl text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 border-none bg-muted/20 transition-all font-black text-[10px] uppercase tracking-widest"
                          >
                             Eliminate Listing
                          </Button>
                       </div>
                    </div>
                 ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border/40 pt-12">
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Indexed Node {(page - 1) * limit + 1} to {Math.min(page * limit, (data?.meta?.total || 0))} of {data?.meta?.total || 0}
             </div>
             <div className="flex gap-4">
                <Button 
                   disabled={page === 1} onClick={() => setPage(p => p - 1)}
                   variant="outline" className="h-16 px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 disabled:opacity-30 transition-all"
                >
                   <ArrowLeft className="w-4 h-4 mr-2" /> Sector Prev
                </Button>
                <Button 
                   disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                   variant="outline" className="h-16 px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 disabled:opacity-30 transition-all"
                >
                   Sector Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
             </div>
          </div>
        </div>
      </DataWrapper>
    </ProtectedRoute>
  );
}
