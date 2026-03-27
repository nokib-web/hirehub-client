'use client';

import React, { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Eye, Search, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { IJob } from '@/types';

export default function MyJobs() {
  const {  } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['employer-jobs'],
    queryFn: async () => {
      // API automatically filters by logged-in employer based on token
      const response = await api.get('/jobs', { params: { limit: 100 } }); 
      return response.data.data as IJob[];
    }
  });

  const jobs = (Array.isArray(data) ? data : (data as unknown as { jobs?: IJob[] })?.jobs || []) as IJob[];
  
  const filteredJobs = jobs.filter((job: IJob) => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this job? This cannot be undone.')) {
      try {
        await api.delete(`/jobs/${id}`);
        toast.success('Job deleted successfully');
        refetch();
      } catch {
        toast.error('Failed to delete job');
      }
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'closed' : 'active';
    try {
      await api.patch(`/jobs/${id}`, { status: newStatus });
      toast.success(`Job marked as ${newStatus}`);
      refetch();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['employer']}>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-foreground">My Job Posts</h1>
            <p className="text-muted-foreground font-medium mt-1">Manage all your active, drafted, and closed job listings.</p>
          </div>
          <Link href="/dashboard/post-job">
            <Button className="rounded-xl font-bold shadow-lg shadow-primary/20">
               + Post New Job
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search jobs by title or status..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-input rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
           </div>
        </div>

        {/* Table/List */}
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 text-muted-foreground font-black uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Job Title & Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Applicants</th>
                  <th className="px-6 py-4">Posted Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-3/4 mb-2"/><div className="h-3 bg-muted rounded w-1/2"/></td>
                      <td className="px-6 py-4"><div className="h-6 w-16 bg-muted rounded-full"/></td>
                      <td className="px-6 py-4"><div className="h-6 w-8 mx-auto bg-muted rounded"/></td>
                      <td className="px-6 py-4"><div className="h-4 w-20 bg-muted rounded"/></td>
                      <td className="px-6 py-4"><div className="h-8 w-24 ml-auto bg-muted rounded"/></td>
                    </tr>
                  ))
                ) : filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No jobs found. Try adjusting your search term or post a new job.
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {filteredJobs.map((job: IJob) => (
                      <motion.tr 
                        key={job.id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="hover:bg-muted/20 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <Link href={`/jobs/${job.id}`} className="font-bold text-foreground hover:text-primary transition-colors block text-base truncate max-w-xs">
                            {job.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground font-medium">
                            <span>{job.category}</span>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span>{job.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={() => toggleStatus(job.id, job.status)} className="focus:outline-none">
                            <Badge variant={job.status === 'active' ? 'primary' : job.status === 'draft' ? 'outline' : 'secondary'} className={`cursor-pointer capitalize text-[10px] tracking-wider px-2 py-0.5 ${job.status === 'active' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200' : ''}`}>
                              {job.status}
                            </Badge>
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant="outline" className="px-2 py-1 font-black bg-muted/40">
                            {job.applicantsCount || 0}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground font-medium whitespace-nowrap text-xs">
                          {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                         <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/jobs/${job.id}`}>
                              <Button variant="outline" size="sm" className="w-8 h-8 p-0 rounded-lg" title="View Public Job">
                                <Eye className="w-4 h-4 text-muted-foreground hover:text-blue-500" />
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm" className="w-8 h-8 p-0 rounded-lg bg-orange-50 hover:bg-orange-100 hover:border-orange-300" title="Edit Job">
                              <Edit2 className="w-3.5 h-3.5 text-orange-600" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(job.id)} className="w-8 h-8 p-0 rounded-lg bg-rose-50 hover:bg-rose-100 hover:border-rose-300" title="Delete Job">
                              <Trash2 className="w-4 h-4 text-rose-600" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
