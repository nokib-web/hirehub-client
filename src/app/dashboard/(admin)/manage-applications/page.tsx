'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Filter, FileText, User, Briefcase, Calendar, Ghost, ArrowRight, ArrowLeft, ShieldAlert, BadgeCheck, Clock, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import DataWrapper from '@/components/dashboard/DataWrapper';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Link from 'next/link';

import { IApplication, ApiResponse } from '@/types';

export default function ManageApplications() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error, refetch } = useQuery<ApiResponse<IApplication[]>>({
    queryKey: ['admin-applications', page, statusFilter, searchTerm],
    queryFn: async () => {
      const params = {
        page,
        limit,
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchTerm
      };
      const res = await api.get('/admin/applications', { params });
      return res.data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      await api.patch(`/admin/applications/${id}/status`, { status });
    },
    onSuccess: (_, variables) => {
      toast.success(`Global protocol updated: ${variables.status.toUpperCase()}`, {
        icon: '🔗',
        style: { borderRadius: '1rem', fontWeight: 'black', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }
      });
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
    },
    onError: () => {
      toast.error('Failed to override application status');
    }
  });

  const applications = data?.data || [];
  const totalPages = data?.meta?.total ? Math.ceil(data.meta.total / limit) : 1;

  const getStatusStyle = (status: string) => {
    switch(status.toLowerCase()) {
      case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'reviewed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'shortlisted': return 'bg-purple-500/10 text-purple-500 border-purple-200';
      case 'hired': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'rejected': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DataWrapper 
        isLoading={isLoading} 
        error={error} 
        retry={refetch}
        loadingMessage="Accessing global submission stream..."
      >
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
             <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-wider border border-primary/20">
                  <FileText className="w-3 h-3" /> Application Audit System
                </div>
                <h1 className="text-5xl font-black text-foreground tracking-tight leading-none italic uppercase">Submission Nexus</h1>
                <p className="text-muted-foreground font-medium max-w-lg">Advanced pipeline oversight. Monitor global candidate movement, override status protocols, and audit recruitment health.</p>
             </div>
          </div>

          {/* Intelligent Filtering */}
          <div className="bg-card/30 p-8 rounded-[3rem] border border-border/60 space-y-8 shadow-xl shadow-primary/5">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="relative group">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                   <input 
                     type="text" placeholder="Search parameters: Applicant name, Job title..." 
                     value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                     className="w-full pl-16 pr-8 py-5 bg-background border border-border/40 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary font-bold text-sm transition-all"
                   />
                </div>
                
                <div className="relative">
                   <Filter className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <select 
                     value={statusFilter} 
                     onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                     className="w-full pl-14 pr-10 py-5 bg-background border border-border/40 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
                   >
                     <option value="all">ALL STATUS PROTOCOLS</option>
                     <option value="pending">PENDING OPS</option>
                     <option value="reviewed">REVIEWED STATE</option>
                     <option value="shortlisted">PRIORITY SHORTLIST</option>
                     <option value="hired">CONCLUDED: HIRED</option>
                     <option value="rejected">CONCLUDED: REJECTED</option>
                   </select>
                   <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground rotate-90" />
                </div>
             </div>
          </div>

          {/* Content Table */}
          <div className="bg-card border border-border shadow-2xl shadow-primary/5 rounded-[3rem] overflow-hidden">
             <div className="overflow-x-auto text-center">
               <table className="w-full text-left">
                 <thead>
                   <tr className="bg-muted/30 border-b border-border/50">
                     <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Candidate Node</th>
                     <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Target Position</th>
                     <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Submission Log</th>
                     <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Protocol Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-border/40">
                   <AnimatePresence mode="popLayout">
                     {applications.length === 0 ? (
                       <tr>
                         <td colSpan={4} className="py-32">
                            <div className="flex flex-col items-center justify-center text-center opacity-40">
                               <Ghost className="w-20 h-20 mb-6" />
                               <p className="text-xl font-black uppercase tracking-widest italic">Nexus Empty</p>
                               <p className="text-sm font-bold max-w-xs mt-2">No application data detected within the current spectral filter.</p>
                            </div>
                         </td>
                       </tr>
                     ) : (
                       applications.map((app: IApplication, idx: number) => (
                         <motion.tr 
                           key={app._id || app.id} 
                           initial={{ opacity: 0, x: -10 }} 
                           animate={{ opacity: 1, x: 0 }} 
                           transition={{ delay: idx * 0.03 }}
                           className="hover:bg-primary/5 transition-all group"
                         >
                           <td className="px-10 py-8">
                             <div className="flex items-center gap-6">
                               <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center font-black text-primary italic text-xl">
                                 {app.applicant?.name?.charAt(0) || 'U'}
                               </div>
                               <div className="space-y-1">
                                 <p className="font-black text-lg text-foreground tracking-tight uppercase italic leading-none">{app.applicant?.name || 'Anonymous'}</p>
                                 <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter">{app.applicant?.email}</p>
                               </div>
                             </div>
                           </td>
                           <td className="px-10 py-8">
                             <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                   <p className="font-black text-foreground italic uppercase tracking-tighter leading-none">{app.job?.title || 'Unknown Ops'}</p>
                                   <Link href={`/jobs/${app.job?._id}`} target="_blank" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                      <ExternalLink className="w-3.5 h-3.5 text-primary" />
                                   </Link>
                                </div>
                                <p className="text-[11px] font-bold text-muted-foreground uppercase opacity-50">{app.job?.company || 'Redacted Org'}</p>
                             </div>
                           </td>
                           <td className="px-10 py-8">
                              <div className="flex items-center gap-2 text-[11px] font-black text-muted-foreground uppercase opacity-80">
                                 <Clock className="w-3.5 h-3.5" />
                                 {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                           </td>
                           <td className="px-10 py-8 text-center">
                              <div className="flex justify-center">
                                <select 
                                  value={app.status.toLowerCase()}
                                  onChange={(e) => updateStatusMutation.mutate({ id: (app._id || app.id) as string, status: e.target.value })}
                                  className={`h-12 text-[10px] font-black uppercase tracking-[0.2em] border-2 rounded-xl px-6 outline-none cursor-pointer appearance-none text-center transition-all ${getStatusStyle(app.status)}`}
                                >
                                   <option value="pending">Pending</option>
                                   <option value="reviewed">Reviewed</option>
                                   <option value="shortlisted">Shortlisted</option>
                                   <option value="rejected">Rejected</option>
                                   <option value="hired">Hired</option>
                                </select>
                              </div>
                           </td>
                         </motion.tr>
                       ))
                     )}
                   </AnimatePresence>
                 </tbody>
               </table>
             </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border/40 pt-10">
             <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Displaying application {(page - 1) * limit + 1} to {Math.min(page * limit, (data?.meta?.total || 0))} of {data?.meta?.total || 0}
             </div>
             <div className="flex gap-4">
                <Button 
                   disabled={page === 1} onClick={() => setPage(p => p - 1)}
                   variant="outline" className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase border-2 disabled:opacity-30 transition-all"
                >
                   <ArrowLeft className="w-4 h-4 mr-2" /> Tier Prev
                </Button>
                <Button 
                   disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                   variant="outline" className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase border-2 disabled:opacity-30 transition-all"
                >
                   Tier Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
             </div>
          </div>
        </div>
      </DataWrapper>
    </ProtectedRoute>
  );
}

