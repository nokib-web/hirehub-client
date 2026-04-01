'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, DollarSign, Mail, Globe, Calendar, ChevronDown, Users, Search, Briefcase, ExternalLink, Filter, UserCheck, UserX, UserMinus } from 'lucide-react';
import toast from 'react-hot-toast';
import DataWrapper from '@/components/dashboard/DataWrapper';
import Badge from '@/components/ui/Badge';
import { useSearchParams, useRouter } from 'next/navigation';
import { IApplication, IJob, IUser } from '@/types';

export default function EmployerApplications() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const jobIdFromUrl = searchParams.get('jobId') || 'all';
  
  const [selectedJobId, setSelectedJobId] = useState<string>(jobIdFromUrl);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedJobId(jobIdFromUrl);
  }, [jobIdFromUrl]);

  // Fetch employer's jobs for the filter dropdown
  const { data: myJobs } = useQuery({
    queryKey: ['my-jobs-list'],
    queryFn: async () => {
      const res = await api.get('/jobs/my-jobs');
      return res.data.data as IJob[];
    }
  });

  // Fetch applications
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['employer-applications'],
    queryFn: async () => {
      const res = await api.get('/applications/employer');
      return res.data.data as IApplication[];
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      await api.patch(`/applications/${id}`, { status });
    },
    onSuccess: (_, variables) => {
      toast.success(`Applicant marked as ${variables.status}`, {
        icon: '📋',
        style: { borderRadius: '1rem', fontWeight: 'bold' }
      });
      queryClient.invalidateQueries({ queryKey: ['employer-applications'] });
    },
    onError: () => {
      toast.error('Failed to update candidate status');
    }
  });

  const jobsList = Array.isArray(myJobs) ? myJobs : [];
  const appsList = Array.isArray(data) ? data : [];

  const filteredApps = selectedJobId === 'all' 
    ? appsList
    : appsList.filter((app: IApplication) => {
        const job = app.job as IJob;
        return (job?._id || job?.id) === selectedJobId;
      });

  const handleJobFilterChange = (id: string) => {
    setSelectedJobId(id);
    const params = new URLSearchParams(searchParams.toString());
    if (id === 'all') params.delete('jobId');
    else params.set('jobId', id);
    router.push(`?${params.toString()}`);
  };

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return <Badge variant="warning" className="uppercase tracking-[0.15em] text-[9px] px-3 py-1 font-black border-amber-500/30">Pending</Badge>;
      case 'reviewed':
        return <Badge variant="secondary" className="uppercase tracking-[0.15em] text-[9px] px-3 py-1 font-black border-blue-500/30">Reviewed</Badge>;
      case 'shortlisted':
        return <Badge variant="primary" className="uppercase tracking-[0.15em] text-[10px] px-3 py-1.5 font-black border-blue-500/30 bg-blue-500/10 text-blue-500">Shortlisted</Badge>;
      case 'rejected':
        return <Badge variant="error" className="uppercase tracking-[0.15em] text-[9px] px-3 py-1 font-black border-rose-500/30">Rejected</Badge>;
      case 'hired':
        return <Badge variant="success" className="uppercase tracking-[0.15em] text-[9px] px-3 py-1 font-black border-emerald-500/30">Hired 🎉</Badge>;
      default:
        return <Badge className="uppercase tracking-[0.15em] text-[9px] px-3 py-1 font-black">{status}</Badge>;
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Mark Pending', icon: UserMinus },
    { value: 'reviewed', label: 'Mark Reviewed', icon: UserCheck },
    { value: 'shortlisted', label: 'Shortlist Candidate', icon: Users },
    { value: 'rejected', label: 'Reject Candidate', icon: UserX },
    { value: 'hired', label: 'Confirm Hire', icon: UserCheck },
  ];

  return (
    <ProtectedRoute allowedRoles={['employer']}>
      <DataWrapper 
        isLoading={isLoading} 
        error={error} 
        retry={refetch}
        loadingMessage="Analyzing applicant data..."
      >
        <div className="space-y-12 max-w-7xl mx-auto pb-20">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-wider border border-primary/20">
                <Users className="w-3 h-3" /> Recruitment Funnel
              </div>
              <h1 className="text-4xl font-black text-foreground tracking-tight leading-tight italic uppercase">Candidate Pipeline</h1>
              <p className="text-muted-foreground font-medium max-w-md">Streamline your hiring process. Review, shortlist, and hire top-tier talent from around the world.</p>
            </div>
            
            <div className="w-full md:w-80 relative group">
               <div className="absolute -top-3 left-4 bg-background px-2 text-[10px] font-black text-primary uppercase tracking-widest z-10 border border-primary/20 rounded-md">
                 Filter Positions
               </div>
               <div className="relative">
                 <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <select 
                   value={selectedJobId} 
                   onChange={e => handleJobFilterChange(e.target.value)}
                   className="w-full h-16 pl-12 pr-10 rounded-[1.25rem] border-2 border-border/60 bg-card shadow-xl shadow-primary/5 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary font-bold text-sm appearance-none cursor-pointer transition-all"
                 >
                   <option value="all">All Active Positions ({appsList.length})</option>
                   {jobsList.map((job: IJob) => (
                     <option key={job._id || job.id} value={job._id || job.id}>
                       {job.title}
                     </option>
                   ))}
                 </select>
                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
               </div>
            </div>
          </div>

          {/* Applications Grid/List */}
          <div className="space-y-8">
            {filteredApps.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="w-full p-24 bg-card border border-dashed border-border/60 rounded-[4rem] flex flex-col items-center justify-center text-center shadow-xl shadow-primary/5"
              >
                <div className="w-24 h-24 bg-muted/30 rounded-[2rem] flex items-center justify-center mb-10 relative">
                   <Search className="w-12 h-12 text-muted-foreground/40" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-4 italic">No candidates found</h3>
                <p className="text-muted-foreground mb-12 max-w-sm font-medium leading-relaxed">
                  {selectedJobId === 'all' 
                    ? "You haven't received any applications yet. Make sure your job posts are active and compelling!"
                    : "No one has applied for this specific position yet. Keep an eye out!"}
                </p>
                <div className="flex gap-4">
                   <button onClick={() => handleJobFilterChange('all')} className="h-14 px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all">
                      Clear Filters
                   </button>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredApps.map((app: IApplication, idx: number) => {
                    const applicant = (app.user || app.userId) as IUser;
                    const job = app.job as IJob;
                    const isExpanded = expandedId === (app._id || app.id);
                    const appliedDate = new Date(app.createdAt || app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const appId = (app._id || app.id) as string;

                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                        key={appId}
                        className="bg-card border border-border rounded-[3rem] p-8 md:p-12 shadow-[0_12px_48px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.1)] hover:border-primary/20 transition-all duration-500 relative flex flex-col lg:flex-row gap-12 group"
                      >
                        {/* Status Strip */}
                        <div className={`absolute left-0 top-12 bottom-12 w-2 rounded-r-full transition-all duration-500 ${
                           app.status === 'hired' ? 'bg-emerald-500' : 
                           app.status === 'rejected' ? 'bg-rose-500' : 
                           app.status === 'shortlisted' ? 'bg-blue-500' : 
                           'bg-amber-500'
                        } opacity-40 group-hover:opacity-100 shadow-[0_0_20px_rgba(var(--primary),0.3)]`} />

                        {/* Candidate Info */}
                        <div className="lg:w-80 shrink-0 space-y-8 lg:border-r border-border/40 lg:pr-12">
                           <div className="flex items-center gap-6">
                              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary to-primary-focus text-white flex items-center justify-center font-black text-4xl shadow-2xl shadow-primary/20 ring-4 ring-primary/5 group-hover:scale-110 transition-transform duration-500">
                                {applicant?.name?.charAt(0) || 'A'}
                              </div>
                              <div className="space-y-1">
                                 <h3 className="text-2xl font-black text-foreground leading-tight tracking-tight uppercase italic">{applicant?.name || 'Anonymous User'}</h3>
                                 <p className="text-sm text-primary font-bold">{applicant?.headline || 'Talented Professional'}</p>
                              </div>
                           </div>
                           
                           <div className="space-y-6">
                              <div className="bg-muted/30 p-5 rounded-2xl border border-border/40 space-y-4">
                                 <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 border-b border-border/40 pb-2">
                                    Candidate Details
                                 </div>
                                 <div className="space-y-3">
                                   <div className="flex items-center gap-3 text-sm font-bold text-foreground/80">
                                      <Mail className="w-4 h-4 text-primary" /> {applicant?.email}
                                   </div>
                                   <div className="flex items-center gap-3 text-sm font-bold text-foreground/80">
                                      <Briefcase className="w-4 h-4 text-primary" /> {job?.title}
                                   </div>
                                   <div className="flex items-center gap-3 text-sm font-bold text-foreground/80">
                                      <Calendar className="w-4 h-4 text-primary" /> {appliedDate}
                                   </div>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Actions & Experience */}
                        <div className="flex-1 space-y-10">
                           <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
                              <div className="flex flex-wrap gap-4">
                                 {app.resumeUrl && (
                                   <a href={app.resumeUrl} target="_blank" rel="noreferrer">
                                     <Button className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all">
                                        <FileText className="w-4 h-4 mr-2" /> View Dossier
                                     </Button>
                                   </a>
                                 )}
                                 {app.portfolioUrl && (
                                   <a href={app.portfolioUrl} target="_blank" rel="noreferrer">
                                     <Button variant="outline" className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border-2 hover:bg-muted/50 transition-all">
                                        <Globe className="w-4 h-4 mr-2" /> Portfolio
                                     </Button>
                                   </a>
                                 )}
                              </div>
                              
                              <div className="relative group/select w-full sm:w-64">
                                 <div className="absolute -top-3 left-4 bg-background px-2 text-[8px] font-black text-muted-foreground uppercase tracking-widest z-10 border border-border/60 rounded-md">
                                    Change Phase
                                 </div>
                                 <div className="relative">
                                    <select 
                                      value={app.status}
                                      onChange={e => updateStatusMutation.mutate({ id: appId, status: e.target.value })}
                                      className="w-full h-14 pl-6 pr-12 rounded-2xl border-2 border-border/40 bg-card font-black text-[10px] uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer appearance-none"
                                    >
                                      {statusOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                      ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-6">
                              <div className="flex items-center justify-between">
                                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" /> Application Message
                                 </h4>
                                 {getStatusBadge(app.status)}
                              </div>
                              
                              <div className="bg-muted/20 p-8 rounded-[2rem] border border-border/40 relative group/msg hover:bg-muted/30 transition-all duration-500">
                                 <p className={`text-md font-medium text-foreground/80 leading-relaxed ${isExpanded ? '' : 'line-clamp-4'}`}>
                                   {app.coverLetter || "No summary provided by candidate."}
                                 </p>
                                 {app.coverLetter && app.coverLetter.length > 300 && (
                                   <button 
                                     onClick={() => setExpandedId(isExpanded ? null : appId)}
                                     className="mt-6 text-[10px] font-black text-primary hover:text-primary-focus uppercase tracking-widest flex items-center gap-2 transition-colors"
                                   >
                                     {isExpanded ? 'Minimize Record' : 'Read Full Manifest'} 
                                     <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                   </button>
                                 )}
                              </div>
                           </div>
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
