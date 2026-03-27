'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { motion } from 'framer-motion';
import { ExternalLink, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageApplications() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-applications'],
    queryFn: async () => {
      // Endpoint should fetch all applications globally for admin
      const res = await api.get('/applications');
      return res.data.data;
    }
  });

  const applications = Array.isArray(data) ? data : data?.applications || [];

  const filteredApps = statusFilter === 'all' 
    ? applications
    : applications.filter((app: { status: string; [key: string]: unknown }) => app.status.toLowerCase() === statusFilter);

  const adminUpdateStatus = async (appId: string, newStatus: string) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status: newStatus });
      toast.success('System application status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
    } catch {
      toast.error('Failed to master update status');
    }
  };

  const getBadgeColor = (status: string) => {
    const s = status.toLowerCase();
    if(s === 'pending') return 'bg-gray-100 text-gray-700 border-gray-200';
    if(s === 'reviewed') return 'bg-blue-100 text-blue-700 border-blue-200';
    if(s === 'shortlisted') return 'bg-purple-100 text-purple-700 border-purple-200';
    if(s === 'rejected') return 'bg-rose-100 text-rose-700 border-rose-200';
    if(s === 'hired') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    return '';
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        <div>
          <h1 className="text-3xl font-black text-foreground">Manage Global Applications</h1>
          <p className="text-muted-foreground font-medium mt-1">System-wide audit view of all candidate submissions.</p>
        </div>

        <div className="flex gap-4 p-4 bg-card rounded-3xl border border-border shadow-sm items-center">
           <Filter className="w-5 h-5 text-muted-foreground hidden sm:block ml-2" />
           <select 
             value={statusFilter} 
             onChange={e => setStatusFilter(e.target.value)}
             className="w-full sm:max-w-[240px] h-12 bg-muted/30 border border-input rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold px-4"
           >
             <option value="all">All Application Statuses</option>
             <option value="pending">Pending</option>
             <option value="reviewed">Reviewed</option>
             <option value="shortlisted">Shortlisted</option>
             <option value="rejected">Rejected</option>
             <option value="hired">Hired</option>
           </select>
        </div>

        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead className="bg-muted/40 text-muted-foreground font-black uppercase text-[10px] tracking-wider">
                 <tr>
                   <th className="px-6 py-5">Applicant</th>
                   <th className="px-6 py-5">Position & Company</th>
                   <th className="px-6 py-5">Date</th>
                   <th className="px-6 py-5 text-center">Status Audit</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border/50">
                 {isLoading ? (
                    <tr><td colSpan={4} className="p-6 text-center text-muted-foreground animate-pulse font-bold">Loading...</td></tr>
                 ) : filteredApps.length === 0 ? (
                    <tr><td colSpan={4} className="p-10 text-center text-muted-foreground font-medium">No applications found.</td></tr>
                 ) : (
                   filteredApps.map((app: { _id: string; status: string; applicant?: { name?: string; email?: string }; job?: { _id?: string; title?: string; company?: string }; createdAt: string; [key: string]: unknown }) => (
                     <motion.tr key={app._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-muted/20 transition-all group">
                       <td className="px-6 py-4">
                         <p className="font-bold text-base text-foreground truncate max-w-[200px]">
                           {app.applicant?.name || 'Unknown User'}
                         </p>
                         <a href={`mailto:${app.applicant?.email}`} className="text-xs text-muted-foreground font-semibold mt-0.5 hover:text-primary underline-offset-2">
                           {app.applicant?.email || 'N/A'}
                         </a>
                       </td>
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-2">
                            <p className="font-bold text-foreground truncate max-w-[200px]">{app.job?.title || 'Unknown Job'}</p>
                            <a href={`/jobs/${app.job?._id}`} target="_blank" className="opacity-0 group-hover:opacity-100"><ExternalLink className="w-3.5 h-3.5 text-primary" /></a>
                         </div>
                         <p className="text-xs text-muted-foreground font-semibold mt-1 truncate max-w-[200px]">{app.job?.company || 'Unknown Company'}</p>
                       </td>
                       <td className="px-6 py-4 text-xs font-bold text-muted-foreground">
                         {new Date(app.createdAt).toLocaleDateString()}
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <select 
                              value={app.status.toLowerCase()}
                              onChange={(e) => adminUpdateStatus(app._id, e.target.value)}
                              className={`text-xs uppercase font-black tracking-widest border border-input rounded-xl px-3 py-2 outline-none cursor-pointer focus:ring-2 focus:ring-primary/20 transition-all text-center appearance-none ${getBadgeColor(app.status)}`}
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
               </tbody>
             </table>
           </div>
        </div>

      </div>
    </ProtectedRoute>
  );
}
