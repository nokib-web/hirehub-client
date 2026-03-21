'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Search, Edit2, Trash2, Eye, Star } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function ManageJobs() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-jobs'],
    queryFn: async () => {
      const res = await api.get('/jobs', { params: { limit: 1000 } }); 
      return res.data.data;
    }
  });

  const jobs = Array.isArray(data) ? data : data?.jobs || [];

  const filteredJobs = jobs.filter((job: any) => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || job.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || job.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this job globally?')) {
      try {
        await api.delete(`/jobs/${id}`);
        toast.success('Job deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      } catch {
        toast.error('Failed to delete job');
      }
    }
  };

  const toggleFeature = async (id: string, currentIsFeatured: boolean) => {
    try {
      await api.patch(`/jobs/${id}`, { isFeatured: !currentIsFeatured });
      toast.success(currentIsFeatured ? 'Job unfeatured' : 'Job featured');
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
    } catch {
      toast.error('Failed to update featured status');
    }
  };

  const categories = ['All', 'Technology', 'Marketing', 'Design', 'Finance', 'Healthcare', 'Sales'];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        <div>
          <h1 className="text-3xl font-black text-foreground">Manage Global Jobs</h1>
          <p className="text-muted-foreground font-medium mt-1">Audit, edit, and moderate all employer job listings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-card rounded-3xl border border-border shadow-sm">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" placeholder="Search by title or company..." 
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 h-12 bg-muted/30 border border-input rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all"
            />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="h-12 border border-input bg-muted/30 px-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold w-full mx-auto mdTabs max-w-[200px]">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-12 border border-input bg-muted/30 px-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold w-full max-w-[200px] mx-auto md:ml-auto block">
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead className="bg-muted/40 text-muted-foreground font-black uppercase text-[10px] tracking-wider">
                 <tr>
                   <th className="px-6 py-5">Job info</th>
                   <th className="px-6 py-5">Category & Type</th>
                   <th className="px-6 py-5 text-center">Status</th>
                   <th className="px-6 py-5">Feature</th>
                   <th className="px-6 py-5 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border/50">
                 {isLoading ? (
                    <tr><td colSpan={5} className="p-6 text-center text-muted-foreground animate-pulse font-bold">Loading system jobs...</td></tr>
                 ) : filteredJobs.length === 0 ? (
                    <tr><td colSpan={5} className="p-10 text-center text-muted-foreground font-medium">No jobs mathing your filters.</td></tr>
                 ) : (
                   filteredJobs.map((job: any) => (
                     <motion.tr key={job._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-muted/30 transition-all group">
                       <td className="px-6 py-4">
                         <Link href={`/jobs/${job._id}`} className="font-bold text-foreground hover:text-primary transition-colors block text-base truncate max-w-[200px]">
                           {job.title}
                         </Link>
                         <p className="text-xs text-muted-foreground font-semibold mt-1 truncate max-w-[200px]">{job.company}</p>
                       </td>
                       <td className="px-6 py-4">
                         <Badge variant="outline" className="font-bold bg-muted/40 text-[10px] uppercase">{job.category}</Badge>
                         <p className="text-xs text-muted-foreground font-semibold mt-1.5 pl-1">{job.type}</p>
                       </td>
                       <td className="px-6 py-4 text-center">
                         <Badge className={`uppercase text-[9px] tracking-wider font-bold border-none px-2 py-0.5 ${job.status === 'active' ? 'bg-emerald-100 text-emerald-700' : job.status==='draft' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>
                           {job.status}
                         </Badge>
                       </td>
                       <td className="px-6 py-4 text-center">
                          <button onClick={() => toggleFeature(job._id, job.isFeatured)} className="p-2 rounded-xl transition-all hover:bg-muted">
                            <Star className={`w-5 h-5 ${job.isFeatured ? 'fill-amber-400 text-amber-500' : 'text-muted-foreground'}`} />
                          </button>
                       </td>
                       <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-50 group-hover:opacity-100 transition-opacity">
                            <Link href={`/jobs/${job._id}`}>
                              <Button variant="outline" size="sm" className="w-8 h-8 p-0 rounded-lg hover:border-primary/50" title="View Public Job">
                                <Eye className="w-4 h-4 text-muted-foreground hover:text-blue-500" />
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(job._id)} className="w-8 h-8 p-0 rounded-lg bg-rose-50 hover:bg-rose-100 hover:border-rose-300" title="Delete Job">
                              <Trash2 className="w-4 h-4 text-rose-600" />
                            </Button>
                          </div>
                       </td>
                     </motion.tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
