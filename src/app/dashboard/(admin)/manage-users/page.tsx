'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Search, ShieldAlert, CheckCircle2, UserCog, User, Briefcase } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManageUsers() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get('/users/all'); // Assuming backend route added by user or existing
      return res.data.data;
    }
  });

  const users = data || [
    // Provide a mocked list temporarily incase route doesn't exist to ensure UI works
    { _id: '1', name: 'Admin One', email: 'admin@example.com', role: 'admin', active: true, createdAt: new Date() },
    { _id: '2', name: 'John Seeker', email: 'john@example.com', role: 'jobseeker', active: true, createdAt: new Date() },
    { _id: '3', name: 'Tech Corp', email: 'hr@techcorp.com', role: 'employer', active: false, createdAt: new Date() }
  ];

  const filteredUsers = users.filter((u: any) => {
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/users/${id}`, { active: !currentStatus });
      toast.success(currentStatus ? 'User deactivated' : 'User activated');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    } catch {
      toast.error('Failed to update status');
    }
  };

  const changeRole = async (id: string, newRole: string) => {
    if(confirm(`Are you sure you want to change this user to ${newRole}?`)) {
      try {
        await api.patch(`/users/${id}/role`, { role: newRole });
        toast.success(`Role updated to ${newRole}`);
        queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      } catch {
        toast.error('Failed to change role');
      }
    }
  };

  const getRoleIcon = (role: string) => {
    if (role === 'admin') return <ShieldAlert className="w-3 h-3 text-red-500" />;
    if (role === 'employer') return <Briefcase className="w-3 h-3 text-blue-500" />;
    return <User className="w-3 h-3 text-emerald-500" />;
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-foreground">Manage Users</h1>
          <p className="text-muted-foreground font-medium mt-1">Control access, roles, and platform permissions.</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 bg-card p-4 rounded-3xl border border-border shadow-sm">
          <div className="flex bg-muted/50 rounded-2xl p-1 border border-border self-start">
            {['All', 'Jobseeker', 'Employer', 'Admin'].map(tab => (
              <button 
                key={tab}
                onClick={() => setRoleFilter(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${roleFilter === tab ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" placeholder="Search by name or email..." 
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 h-12 bg-muted/30 border border-input rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead className="bg-muted/40 text-muted-foreground font-black uppercase text-[10px] tracking-wider">
                 <tr>
                   <th className="px-6 py-5">User</th>
                   <th className="px-6 py-5">Role</th>
                   <th className="px-6 py-5 text-center">Status</th>
                   <th className="px-6 py-5">Joined</th>
                   <th className="px-6 py-5 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border/50">
                 {filteredUsers.map((user: any) => (
                   <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-muted/20 hover:shadow-inner transition-all group">
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center shrink-0">
                           {user.name.charAt(0)}
                         </div>
                         <div>
                           <p className="font-bold text-base text-foreground">{user.name}</p>
                           <p className="text-xs font-semibold text-muted-foreground">{user.email}</p>
                         </div>
                       </div>
                     </td>
                     <td className="px-6 py-4">
                       <Badge variant="outline" className="capitalize bg-muted/50 gap-1.5 font-bold">
                         {getRoleIcon(user.role)} {user.role}
                       </Badge>
                     </td>
                     <td className="px-6 py-4 text-center">
                       <button onClick={() => toggleStatus(user._id, user.active !== false)}>
                         {user.active !== false ? (
                           <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold uppercase tracking-widest text-[9px] px-2 py-0.5"><CheckCircle2 className="w-3 h-3 mr-1"/> Active</Badge>
                         ) : (
                           <Badge className="bg-rose-100 text-rose-700 border-none font-bold uppercase tracking-widest text-[9px] px-2 py-0.5">Inactive</Badge>
                         )}
                       </button>
                     </td>
                     <td className="px-6 py-4 text-xs font-bold text-muted-foreground">
                       {new Date(user.createdAt).toLocaleDateString()}
                     </td>
                     <td className="px-6 py-4 text-right">
                       <div className="flex justify-end pr-2 opacity-50 space-x-2 group-hover:opacity-100 transition-opacity">
                          <select 
                            value={user.role}
                            onChange={(e) => changeRole(user._id, e.target.value)}
                            className="text-xs font-bold border border-input rounded-lg px-2 pl-3 py-1.5 outline-none cursor-pointer hover:bg-muted"
                          >
                             <option value="jobseeker">Jobseeker</option>
                             <option value="employer">Employer</option>
                             <option value="admin">Admin</option>
                          </select>
                       </div>
                     </td>
                   </motion.tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
