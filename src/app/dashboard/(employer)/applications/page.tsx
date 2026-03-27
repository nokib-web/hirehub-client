'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, DollarSign, Mail, Globe, Calendar, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EmployerApplications() {
  const queryClient = useQueryClient();
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Fetch employer's jobs for the filter dropdown
  const { data: myJobs } = useQuery({
    queryKey: ['my-jobs-list'],
    queryFn: async () => {
      const res = await api.get('/jobs', { params: { limit: 100 } });
      return res.data.data;
    }
  });

  // Fetch applications
  const { data: applications, isLoading } = useQuery({
    queryKey: ['employer-applications'],
    queryFn: async () => {
      const res = await api.get('/applications');
      return res.data.data;
    }
  });

  const jobsList = Array.isArray(myJobs) ? myJobs : myJobs?.jobs || [];
  const appsList = Array.isArray(applications) ? applications : applications?.applications || [];

  const filteredApps = selectedJobId === 'all' 
    ? appsList
    : appsList.filter((app: { job?: { _id: string }; [key: string]: unknown }) => app.job?._id === selectedJobId);

  const updateStatus = async (appId: string, newStatus: string) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status: newStatus });
      toast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['employer-applications'] });
    } catch {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'reviewed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shortlisted': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'rejected': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'hired': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <ProtectedRoute allowedRoles={['employer']}>
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" /> Application Pipeline
            </h1>
            <p className="text-muted-foreground font-medium mt-1">Review candidates and update hiring stages.</p>
          </div>
          
          <div className="w-full md:w-72 relative">
             <label className="text-xs font-black uppercase text-muted-foreground absolute -top-2 left-3 bg-background px-1 z-10">Filter by Job</label>
             <select 
               value={selectedJobId} 
               onChange={e => setSelectedJobId(e.target.value)}
               className="w-full h-12 rounded-xl border border-input bg-card px-4 shadow-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
             >
               <option value="all">All Jobs ({appsList.length})</option>
               {jobsList.map((job: { _id: string; title?: string; [key: string]: unknown }) => (
                 <option key={job._id} value={job._id}>
                   {job.title}
                 </option>
               ))}
             </select>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-card border border-border rounded-3xl h-64 w-full"/>)
          ) : filteredApps.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 border border-dashed border-border/50 rounded-3xl">
              <p className="text-muted-foreground font-medium">No candidates found for the selected criteria.</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredApps.map((app: { _id: string; applicant?: { name?: string; email?: string }; job?: { title?: string }; createdAt: string; expectedSalary?: string; portfolioUrl?: string; resumeUrl?: string; status: string; coverLetter?: string; [key: string]: unknown }) => {
                const applicant = app.applicant || {};
                const job = app.job || {};
                const isExpanded = expandedId === app._id;
                const appliedDate = new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    key={app._id}
                    className="bg-card border border-border rounded-[2rem] p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10" />
                    
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                      {/* Left: Applicant ID & Meta */}
                      <div className="flex flex-row lg:flex-col gap-6 w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-border pb-6 lg:pb-0 lg:pr-6 justify-between lg:justify-start">
                         <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-black text-2xl shadow-lg ring-4 ring-primary/10">
                              {(applicant.name || 'A').charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-black text-lg leading-tight">{applicant.name || 'Anonymous User'}</h3>
                              <p className="text-xs text-muted-foreground font-bold">{applicant.email}</p>
                            </div>
                         </div>
                         
                         <div className="space-y-4 pt-4 shrink-0">
                           <div>
                             <p className="text-[10px] uppercase font-black text-muted-foreground">Applied For</p>
                             <p className="text-sm font-bold text-primary truncate max-w-[200px]">{job.title}</p>
                           </div>
                           <div className="hidden lg:block">
                             <p className="text-[10px] uppercase font-black text-muted-foreground">Date</p>
                             <p className="text-sm font-bold flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-muted-foreground" /> {appliedDate}</p>
                           </div>
                           <div className="hidden lg:block">
                             <p className="text-[10px] uppercase font-black text-muted-foreground">Expected Salary</p>
                             <p className="text-sm font-bold flex items-center gap-1.5 text-emerald-600"><DollarSign className="w-3.5 h-3.5" /> {app.expectedSalary || 'Not specified'}</p>
                           </div>
                         </div>
                      </div>

                      {/* Right: Cover Letter & Actions */}
                      <div className="flex-1 w-full space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                           <div className="flex flex-wrap gap-2">
                             {app.portfolioUrl && (
                               <a href={app.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors">
                                 <Globe className="w-3.5 h-3.5" /> Portfolio
                               </a>
                             )}
                             {app.resumeUrl && (
                               <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold transition-colors">
                                 <FileText className="w-3.5 h-3.5" /> View Resume
                               </a>
                             )}
                           </div>
                           
                           <div className="shrink-0 relative group">
                             <label className="text-[10px] uppercase font-black text-muted-foreground block text-right mb-1">Update Status</label>
                             <div className="relative">
                               <select 
                                 value={app.status}
                                 onChange={e => updateStatus(app._id, e.target.value)}
                                 className={`appearance-none bg-transparent border-none outline-none font-bold text-xs uppercase tracking-wider pl-3 pr-8 py-2 rounded-xl cursor-pointer ${getStatusColor(app.status)}`}
                                 style={{ backgroundImage: 'none' }}
                               >
                                 <option value="pending">Pending</option>
                                 <option value="reviewed">Reviewed</option>
                                 <option value="shortlisted">Shortlisted</option>
                                 <option value="rejected">Rejected</option>
                                 <option value="hired">Hired</option>
                               </select>
                               <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                             </div>
                           </div>
                        </div>

                        {app.coverLetter && (
                          <div className="bg-muted/30 rounded-2xl p-5 border border-border/50 relative">
                             <h4 className="text-xs font-black uppercase text-muted-foreground mb-3 flex items-center gap-2">
                               <Mail className="w-4 h-4" /> Cover Letter
                             </h4>
                             <p className={`text-sm text-foreground/80 leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
                               {app.coverLetter}
                             </p>
                             {app.coverLetter.length > 200 && (
                               <button 
                                 onClick={() => setExpandedId(isExpanded ? null : app._id)}
                                 className="text-xs font-black text-primary hover:underline mt-2 inline-block"
                               >
                                 {isExpanded ? 'Show less' : 'Read full cover letter'}
                               </button>
                             )}
                          </div>
                        )}
                      </div>
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
