'use client';

import React from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { LucideIcon, Users, Briefcase, FileText, CheckCircle2, TrendingUp, TrendingDown, Sparkles, Activity, Clock, ArrowRight, UserPlus, FilePlus, BadgeCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DataWrapper from '@/components/dashboard/DataWrapper';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ApiResponse } from '@/types';

export default function AdminOverview() {
  const { data: statsData, isLoading: statsLoading, error, refetch } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data.data;
    }
  });

  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['admin-activity'],
    queryFn: async () => {
       const res = await api.get('/admin/activity');
       return res.data.data;
    }
  });

  const stats = statsData?.overview || {
    totalUsers: 0,
    activeJobs: 0,
    totalApplications: 0,
    hiredCount: 0,
    growth: { users: 0, jobs: 0, apps: 0, hired: 0 }
  };

  const activities = (Array.isArray(activityData) ? activityData : [
    { id: '1', type: 'user_signup', text: 'New employer "Quantum Systems" joined', time: '2 mins ago', icon: UserPlus, color: 'text-blue-500' },
    { id: '2', type: 'job_posted', text: 'Senior UX Designer posted by TechFlow', time: '15 mins ago', icon: FilePlus, color: 'text-emerald-500' },
    { id: '3', type: 'hired', text: 'Sarah Connor hired at Cyberdyne', time: '1 hour ago', icon: BadgeCheck, color: 'text-purple-500' },
    { id: '4', type: 'application', text: 'New application for Rust Engineer', time: '2 hours ago', icon: FileText, color: 'text-amber-500' },
  ]).slice(0, 5);

  const chartData = statsData?.charts || {
    monthlyApps: [],
    jobsByCategory: [],
    appStatus: [],
    userGrowth: []
  };

  interface ActivityLog {
    id: string;
    type: string;
    text: string;
    time: string;
    icon: LucideIcon;
    color: string;
  }

  const StatCard = ({ title, value, icon: Icon, color, trend, idx }: { title: string; value: string | number; icon: LucideIcon; color: string; trend: number; idx: number }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1, duration: 0.5 }}
      className="bg-card rounded-[2.5rem] p-8 border border-border/40 shadow-xl shadow-primary/5 relative overflow-hidden group hover:border-primary/40 transition-all duration-500"
    >
       <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-10 ${color} blur-3xl group-hover:scale-150 transition-transform duration-1000`} />
       
       <div className="flex justify-between items-start relative z-10">
         <div className="space-y-4">
           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} text-white shadow-2xl rotate-[10deg] group-hover:rotate-0 transition-all duration-500`}>
             <Icon className="w-7 h-7" />
           </div>
           <div>
             <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">{title}</p>
             <h3 className="text-4xl font-black mt-1 text-foreground tracking-tighter italic">{value?.toLocaleString() || '0'}</h3>
           </div>
           <div className={`flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full w-fit ${trend >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
             {trend >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
             {Math.abs(trend)}% <span className="text-[10px] opacity-60 font-medium">vs last month</span>
           </div>
         </div>
       </div>
    </motion.div>
  );

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DataWrapper 
        isLoading={statsLoading} 
        error={error} 
        retry={refetch}
        loadingMessage="Synchronizing platform core metrics..."
      >
        <div className="space-y-12 max-w-7xl mx-auto pb-20">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
             <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-wider border border-primary/20">
                  <Activity className="w-3 h-3" /> System Intelligence
                </div>
                <h1 className="text-5xl font-black text-foreground tracking-tight leading-none italic uppercase">Master Console</h1>
                <p className="text-muted-foreground font-medium max-w-lg">Universal platform control. Real-time monitoring of user growth, market liquidity, and hiring velocity.</p>
             </div>
             
             <div className="flex gap-4">
                <Link href="/dashboard/manage-users">
                   <Button variant="outline" className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase border-2 hover:bg-muted/50 transition-all">
                      Control Users
                   </Button>
                </Link>
                <Link href="/dashboard/manage-jobs">
                   <Button className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all">
                      Review Listings
                   </Button>
                </Link>
             </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="bg-blue-600 shadow-blue-500/30" trend={stats.growth.users} idx={0} />
            <StatCard title="Market Listings" value={stats.activeJobs} icon={Briefcase} color="bg-emerald-600 shadow-emerald-500/30" trend={stats.growth.jobs} idx={1} />
            <StatCard title="Application Flow" value={stats.totalApplications} icon={FileText} color="bg-purple-600 shadow-purple-500/30" trend={stats.growth.apps} idx={2} />
            <StatCard title="Hiring Velocity" value={stats.hiredCount} icon={CheckCircle2} color="bg-orange-600 shadow-orange-500/30" trend={stats.growth.hired} idx={3} />
          </div>

          {/* Activity and Large Chart */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
             {/* Main Chart */}
             <motion.div 
               initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
               className="xl:col-span-2 bg-card border border-border shadow-2xl shadow-primary/5 rounded-[3rem] p-10 flex flex-col"
             >
                <div className="flex items-center justify-between mb-10">
                   <div className="space-y-1">
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter">Growth Dynamics</h3>
                      <p className="text-xs text-muted-foreground font-medium">Monthly application influx and engagement volume</p>
                   </div>
                   <div className="flex gap-2">
                      <Badge variant="outline" className="px-3 py-1 border-primary/20 text-primary bg-primary/5">Real-time Data</Badge>
                   </div>
                </div>
                
                <div className="h-[400px] w-full mt-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.monthlyApps}>
                      <defs>
                        <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.15} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#6b7280' }} dy={15} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#6b7280' }} dx={-15} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          borderRadius: '1.5rem', 
                          border: 'none', 
                          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', 
                          padding: '1.5rem',
                          color: '#fff'
                        }} 
                        itemStyle={{ fontWeight: 900, fontSize: '14px', textTransform: 'uppercase' }}
                      />
                      <Area type="monotone" dataKey="apps" stroke="#8b5cf6" strokeWidth={5} fillOpacity={1} fill="url(#colorApps)" activeDot={{ r: 10, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 4, className: 'animate-pulse' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </motion.div>

             {/* Recent Activity */}
             <motion.div 
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
               className="bg-card border border-border shadow-2xl shadow-primary/5 rounded-[3rem] p-10 flex flex-col"
             >
                <div className="flex items-center justify-between mb-10">
                   <div className="space-y-1">
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter">Audit Log</h3>
                      <p className="text-xs text-muted-foreground font-medium">Latest cross-platform operations</p>
                   </div>
                   <Activity className="w-5 h-5 text-primary opacity-40" />
                </div>

                <div className="space-y-8 flex-1">
                   {activities.map((act: ActivityLog, i: number) => (
                      <div key={act.id} className="flex gap-4 relative">
                         {i !== activities.length - 1 && (
                            <div className="absolute left-[22px] top-12 bottom-[-24px] w-[2px] bg-border opacity-50" />
                         )}
                         <div className={`w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center shrink-0 z-10 shadow-sm transition-transform hover:scale-110 duration-300`}>
                            <act.icon className={`w-5 h-5 ${act.color}`} />
                         </div>
                         <div className="space-y-1 pt-1">
                            <p className="text-sm font-black text-foreground/90 leading-tight">
                               {act.text}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                               <Clock className="w-3 h-3" /> {act.time}
                            </div>
                         </div>
                      </div>
                   ))}
                </div>

                <div className="mt-10 pt-8 border-t border-border/50">
                   <Link href="/dashboard/analytics" className="group flex items-center justify-between text-xs font-black uppercase tracking-[0.2em] text-primary hover:text-primary-focus transition-all">
                      Explore Full Intelligence <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                   </Link>
                </div>
             </motion.div>
          </div>

          {/* Second Row Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="bg-card border border-border rounded-[3rem] p-10 shadow-2xl shadow-primary/5">
                <div className="flex items-center gap-4 mb-10">
                   <div className="p-3 bg-blue-500/10 rounded-2xl">
                      <LayoutGrid className="w-5 h-5 text-blue-500" />
                   </div>
                   <h3 className="text-xl font-black uppercase italic tracking-tighter">Market Segmentation</h3>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.jobsByCategory} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" opacity={0.1} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#6b7280' }} width={100} />
                      <Tooltip 
                        cursor={{ fill: '#f3f4f6', opacity: 0.2 }} 
                        contentStyle={{ borderRadius: '1.25rem', border: 'none', backgroundColor: '#1f2937', color: '#fff', padding: '1rem' }} 
                        itemStyle={{ fontWeight: 800, fontSize: '12px', textTransform: 'uppercase' }}
                      />
                      <Bar dataKey="value" fill="#3b82f6" radius={[0, 10, 10, 0]} barSize={28}>
                         {chartData.jobsByCategory.map((entry: { name: string, value: number }, index: number) => (
                           <Cell key={`cell-${index}`} fill={`hsl(217, 91%, ${60 - (index * 5)}%)`} />
                         ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>

             <div className="bg-card border border-border rounded-[3rem] p-10 shadow-2xl shadow-primary/5">
                <div className="flex items-center gap-4 mb-10">
                   <div className="p-3 bg-purple-500/10 rounded-2xl">
                      <PieChartIcon className="w-5 h-5 text-purple-500" />
                   </div>
                   <h3 className="text-xl font-black uppercase italic tracking-tighter">Hiring Pipeline Status</h3>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.appStatus}
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                      >
                        {chartData.appStatus.map((entry: { name: string, value: number, color: string }, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '1.25rem', border: 'none', backgroundColor: '#1f2937', color: '#fff' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', paddingTop: '20px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
             </div>
          </div>
        </div>
      </DataWrapper>
    </ProtectedRoute>
  );
}

// Custom Icons for charts in this page context
function LayoutGrid(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>
    </svg>
  );
}

function PieChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>
    </svg>
  );
}

