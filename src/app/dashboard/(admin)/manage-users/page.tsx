'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Search, ShieldAlert, CheckCircle2, User, Briefcase, Trash2, ShieldCheck, UserX, MoreVertical, Ghost, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DataWrapper from '@/components/dashboard/DataWrapper';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { IUser, ApiResponse } from '@/types';

export default function ManageUsers() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error, refetch } = useQuery<ApiResponse<IUser[]>>({
    queryKey: ['admin-users', page, searchTerm, roleFilter],
    queryFn: async () => {
      const params = {
        page,
        limit,
        search: searchTerm,
        role: roleFilter === 'All' ? undefined : roleFilter.toLowerCase()
      };
      const res = await api.get('/admin/users', { params });
      return res.data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<IUser> }) => {
      await api.patch(`/admin/users/${id}`, updates);
    },
    onSuccess: () => {
      toast.success('User profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => {
      toast.error('Failed to update user profile');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/users/${id}`);
    },
    onSuccess: () => {
      toast.success('User permanently removed');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => {
      toast.error('Failed to delete user');
    }
  });

  const users = data?.data || [];
  const totalPages = data?.meta?.total ? Math.ceil(data.meta.total / limit) : 1;

  const handleDelete = (id: string) => {
    if (window.confirm('CRITICAL: Are you sure you want to delete this user? This will also remove all their associated data.')) {
      deleteMutation.mutate(id);
    }
  };

  const getRoleBadge = (role: string) => {
    switch(role.toLowerCase()) {
      case 'admin':
        return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 font-black uppercase text-[9px] tracking-widest px-3 py-1"><ShieldCheck className="w-3 h-3 mr-1.5" /> Admin</Badge>;
      case 'employer':
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 font-black uppercase text-[9px] tracking-widest px-3 py-1"><Briefcase className="w-3 h-3 mr-1.5" /> Employer</Badge>;
      default:
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-black uppercase text-[9px] tracking-widest px-3 py-1"><User className="w-3 h-3 mr-1.5" /> Jobseeker</Badge>;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DataWrapper 
        isLoading={isLoading} 
        error={error} 
        retry={refetch}
        loadingMessage="Accessing user directory database..."
      >
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
             <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-wider border border-primary/20">
                  <ShieldAlert className="w-3 h-3" /> User Authorization System
                </div>
                <h1 className="text-5xl font-black text-foreground tracking-tight leading-none italic uppercase">Platform Inhabitants</h1>
                <p className="text-muted-foreground font-medium max-w-lg">Advanced identity management. Control access levels, moderate behavior, and oversee platform participants.</p>
             </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 bg-card/30 p-6 rounded-[2.5rem] border border-border/60">
             <div className="flex flex-wrap bg-muted/20 p-2 rounded-2xl border border-border/40 gap-2">
                {['All', 'Jobseeker', 'Employer', 'Admin'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => { setRoleFilter(tab); setPage(1); }}
                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${roleFilter === tab ? 'bg-background shadow-xl text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'}`}
                  >
                    {tab}
                  </button>
                ))}
             </div>

             <div className="relative w-full xl:max-w-md group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" placeholder="Search by name, email, or headline..." 
                  value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                  className="w-full pl-16 pr-8 py-5 bg-background/50 border border-border/40 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary font-bold text-sm transition-all"
                />
             </div>
          </div>

          {/* Table */}
          <div className="bg-card border border-border shadow-2xl shadow-primary/5 rounded-[3rem] overflow-hidden">
             <div className="overflow-x-auto text-center">
               <table className="w-full text-left">
                 <thead>
                   <tr className="bg-muted/30 border-b border-border/50">
                     <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Identity & Profile</th>
                     <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Access Role</th>
                     <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Protocol Status</th>
                     <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Creation Date</th>
                     <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">System Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-border/40">
                   <AnimatePresence mode="popLayout">
                     {users.length === 0 ? (
                       <tr>
                         <td colSpan={5} className="py-32">
                            <div className="flex flex-col items-center justify-center text-center opacity-40">
                               <Ghost className="w-20 h-20 mb-6" />
                               <p className="text-xl font-black uppercase tracking-widest italic">No Citizens Found</p>
                               <p className="text-sm font-bold max-w-xs mt-2">Adjust your intelligence parameters to find specific platform residents.</p>
                            </div>
                         </td>
                       </tr>
                     ) : (
                       users.map((user: IUser, idx: number) => (
                         <motion.tr 
                           key={user._id || user.id} 
                           initial={{ opacity: 0, x: -10 }} 
                           animate={{ opacity: 1, x: 0 }} 
                           transition={{ delay: idx * 0.03 }}
                           className="hover:bg-primary/5 transition-all group"
                         >
                           <td className="px-10 py-8">
                             <div className="flex items-center gap-6">
                               <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-focus text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/10 group-hover:scale-110 transition-transform duration-500">
                                 {user.name?.charAt(0) || 'U'}
                               </div>
                               <div className="space-y-1">
                                 <p className="font-black text-lg text-foreground tracking-tight uppercase italic leading-none">{user.name}</p>
                                 <p className="text-xs font-bold text-muted-foreground opacity-60 uppercase tracking-tighter">{user.email}</p>
                               </div>
                             </div>
                           </td>
                           <td className="px-10 py-8">
                             {getRoleBadge(user.role)}
                           </td>
                           <td className="px-10 py-8 text-center">
                             <button 
                               onClick={() => updateMutation.mutate({ id: (user._id || user.id) as string, updates: { isActive: !user.isActive } })}
                               className="relative group/status rounded-full p-1"
                             >
                               {user.isActive !== false ? (
                                 <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 font-black text-[9px] tracking-widest uppercase animate-pulse-slow">
                                   <div className="w-2 h-2 rounded-full bg-emerald-500" /> Authorized
                                 </div>
                               ) : (
                                 <div className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-500 rounded-full border border-rose-500/20 font-black text-[9px] tracking-widest uppercase">
                                   <UserX className="w-3 h-3" /> Restrictive
                                 </div>
                               )}
                             </button>
                           </td>
                           <td className="px-10 py-8 text-[11px] font-black text-muted-foreground uppercase opacity-60">
                             {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                           </td>
                           <td className="px-10 py-8 text-right">
                             <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                                <select 
                                  value={user.role}
                                  onChange={(e) => updateMutation.mutate({ id: (user._id || user.id) as string, updates: { role: e.target.value } })}
                                  className="h-12 text-[10px] font-black uppercase tracking-[0.2em] border-2 border-border/60 bg-card rounded-xl px-4 outline-none cursor-pointer hover:border-primary transition-all appearance-none text-center"
                                >
                                   <option value="jobseeker">Jobseeker</option>
                                   <option value="employer">Employer</option>
                                   <option value="admin">Admin</option>
                                </select>
                                
                                <Button 
                                  onClick={() => handleDelete((user._id || user.id) as string)}
                                  variant="outline" size="sm" 
                                  className="w-12 h-12 p-0 rounded-xl hover:bg-rose-500 hover:text-white border-2 border-border/60 hover:border-rose-500 transition-all"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </Button>
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
                Showing citizen {(page - 1) * limit + 1} to {Math.min(page * limit, (data?.meta?.total || 0))} of {data?.meta?.total || 0}
             </div>
             <div className="flex gap-4">
                <Button 
                   disabled={page === 1} onClick={() => setPage(p => p - 1)}
                   variant="outline" className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase border-2 disabled:opacity-30 transition-all"
                >
                   <ArrowLeft className="w-4 h-4 mr-2" /> Sector Prev
                </Button>
                <Button 
                   disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                   variant="outline" className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase border-2 disabled:opacity-30 transition-all"
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
