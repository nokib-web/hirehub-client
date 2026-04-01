'use client';

import React from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { LucideIcon, Users, Briefcase, FileText, CheckCircle2, TrendingUp, TrendingDown, Activity, Clock, ArrowRight, UserPlus, FilePlus, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import DataWrapper from '@/components/dashboard/DataWrapper';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  reviewed: '#3b82f6',
  shortlisted: '#8b5cf6',
  hired: '#10b981',
  rejected: '#ef4444',
};

export default function AdminOverview() {
  const { data: statsData, isLoading: statsLoading, error, refetch } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats');
      return res.data.data;
    }
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['admin-dashboard-charts'],
    queryFn: async () => {
      const res = await api.get('/dashboard/chart-data');
      return res.data.data;
    }
  });

  // Map flat stats response
  const stats = {
    totalUsers: statsData?.totalUsers || 0,
    activeJobs: statsData?.activeJobs || 0,
    totalApplications: statsData?.totalApplications || 0,
    hiredCount: statsData?.hiredCount || 0,
  };

  // Normalize chart data from server response format to chart-ready format
  const monthlyApps = (chartData?.monthlyApplications || []).map((d: any) => ({
    name: d.month,
    apps: d.count,
  }));

  const jobsByCategory = (chartData?.jobsByCategory || []).map((d: any) => ({
    name: d.category || 'Other',
    value: d.count,
  }));

  const appStatus = (chartData?.applicationsByStatus || []).map((d: any) => ({
    name: d.status,
    value: d.count,
    color: STATUS_COLORS[d.status] || '#6b7280',
  }));

  // Recent activity mock (no live endpoint yet)
  const activities = [
    { id: '1', text: 'Platform is actively tracking hiring events', time: 'Just now', icon: Activity, color: 'text-blue-500' },
    { id: '2', text: 'New employer registrations detected', time: 'Live', icon: UserPlus, color: 'text-emerald-500' },
    { id: '3', text: 'Job postings being reviewed', time: 'Ongoing', icon: FilePlus, color: 'text-purple-500' },
    { id: '4', text: 'Applications in hiring pipeline', time: 'Active', icon: BadgeCheck, color: 'text-amber-500' },
  ];

  const StatCard = ({ title, value, icon: Icon, color, idx }: { title: string; value: number; icon: LucideIcon; color: string; idx: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1, duration: 0.5 }}
      className="bg-card rounded-[2rem] p-6 md:p-8 border border-border/40 shadow-xl shadow-primary/5 relative overflow-hidden group hover:border-primary/40 transition-all duration-500"
    >
      <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-10 ${color} blur-3xl group-hover:scale-150 transition-transform duration-1000`} />
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-4">
          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center ${color} text-white shadow-2xl rotate-[10deg] group-hover:rotate-0 transition-all duration-500`}>
            <Icon className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">{title}</p>
            <h3 className="text-3xl md:text-4xl font-black mt-1 text-foreground tracking-tighter italic">{value.toLocaleString()}</h3>
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
        <div className="space-y-8 md:space-y-12 max-w-7xl mx-auto pb-12 md:pb-20">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-wider border border-primary/20">
                <Activity className="w-3 h-3" /> System Intelligence
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-none italic uppercase">Master Console</h1>
              <p className="text-muted-foreground font-medium max-w-lg text-sm md:text-base">Universal platform control. Real-time monitoring of user growth, market liquidity, and hiring velocity.</p>
            </div>

            <div className="flex gap-3 md:gap-4 flex-wrap">
              <Link href="/dashboard/manage-users">
                <Button variant="outline" className="h-12 md:h-14 px-6 md:px-8 rounded-2xl font-black text-[10px] uppercase border-2 hover:bg-muted/50 transition-all">
                  Control Users
                </Button>
              </Link>
              <Link href="/dashboard/manage-jobs">
                <Button className="h-12 md:h-14 px-6 md:px-8 rounded-2xl font-black text-[10px] uppercase bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all">
                  Review Listings
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="bg-blue-600" idx={0} />
            <StatCard title="Active Listings" value={stats.activeJobs} icon={Briefcase} color="bg-emerald-600" idx={1} />
            <StatCard title="Applications" value={stats.totalApplications} icon={FileText} color="bg-purple-600" idx={2} />
            <StatCard title="Hired" value={stats.hiredCount} icon={CheckCircle2} color="bg-orange-600" idx={3} />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
            {/* Monthly Applications Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="xl:col-span-2 bg-card border border-border shadow-2xl shadow-primary/5 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6 md:mb-10">
                <div className="space-y-1">
                  <h3 className="text-lg md:text-2xl font-black italic uppercase tracking-tighter">Growth Dynamics</h3>
                  <p className="text-xs text-muted-foreground font-medium">Monthly application influx over the past year</p>
                </div>
                <Badge variant="outline" className="px-3 py-1 border-primary/20 text-primary bg-primary/5 hidden sm:block">Real-time Data</Badge>
              </div>

              <div className="h-[250px] md:h-[350px] w-full mt-auto">
                {monthlyApps.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyApps}>
                      <defs>
                        <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.15} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#6b7280' }} dy={15} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#6b7280' }} dx={-10} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', padding: '1.5rem', color: '#fff' }}
                        itemStyle={{ fontWeight: 900, fontSize: '14px', textTransform: 'uppercase' }}
                      />
                      <Area type="monotone" dataKey="apps" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorApps)" activeDot={{ r: 8, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm font-bold">No data yet — applications will appear here</div>
                )}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-card border border-border shadow-2xl shadow-primary/5 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6 md:mb-10">
                <div className="space-y-1">
                  <h3 className="text-lg md:text-2xl font-black italic uppercase tracking-tighter">Audit Log</h3>
                  <p className="text-xs text-muted-foreground font-medium">Latest cross-platform operations</p>
                </div>
                <Activity className="w-5 h-5 text-primary opacity-40" />
              </div>

              <div className="space-y-6 flex-1">
                {activities.map((act, i) => (
                  <div key={act.id} className="flex gap-4 relative">
                    {i !== activities.length - 1 && (
                      <div className="absolute left-[22px] top-12 bottom-[-16px] w-[2px] bg-border opacity-50" />
                    )}
                    <div className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center shrink-0 z-10 shadow-sm">
                      <act.icon className={`w-5 h-5 ${act.color}`} />
                    </div>
                    <div className="space-y-1 pt-1">
                      <p className="text-sm font-black text-foreground/90 leading-tight">{act.text}</p>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                        <Clock className="w-3 h-3" /> {act.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-border/50">
                <Link href="/dashboard/analytics" className="group flex items-center justify-between text-xs font-black uppercase tracking-[0.2em] text-primary hover:text-primary transition-all">
                  Explore Full Intelligence <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Jobs by Category */}
            <div className="bg-card border border-border rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl shadow-primary/5">
              <div className="flex items-center gap-4 mb-6 md:mb-10">
                <div className="p-3 bg-blue-500/10 rounded-2xl">
                  <Briefcase className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tighter">Market Segmentation</h3>
              </div>
              <div className="h-[250px] md:h-[300px] w-full">
                {jobsByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={jobsByCategory} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" opacity={0.1} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#6b7280' }} width={90} />
                      <Tooltip
                        cursor={{ fill: '#f3f4f6', opacity: 0.2 }}
                        contentStyle={{ borderRadius: '1.25rem', border: 'none', backgroundColor: '#1f2937', color: '#fff', padding: '1rem' }}
                        itemStyle={{ fontWeight: 800, fontSize: '12px', textTransform: 'uppercase' }}
                      />
                      <Bar dataKey="value" fill="#3b82f6" radius={[0, 10, 10, 0]} barSize={24}>
                        {jobsByCategory.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={`hsl(217, 91%, ${60 - (index * 5)}%)`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm font-bold">No job data available yet</div>
                )}
              </div>
            </div>

            {/* Application Status Breakdown */}
            <div className="bg-card border border-border rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl shadow-primary/5">
              <div className="flex items-center gap-4 mb-6 md:mb-10">
                <div className="p-3 bg-purple-500/10 rounded-2xl">
                  <FileText className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tighter">Hiring Pipeline Status</h3>
              </div>
              <div className="h-[250px] md:h-[300px] w-full">
                {appStatus.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={appStatus}
                        innerRadius={60}
                        outerRadius={95}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                      >
                        {appStatus.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '1.25rem', border: 'none', backgroundColor: '#1f2937', color: '#fff' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', paddingTop: '20px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm font-bold">No application data available yet</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DataWrapper>
    </ProtectedRoute>
  );
}
