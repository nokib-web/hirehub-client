'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { motion } from 'framer-motion';
import { 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  BarChart3,
  TrendingUp,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import DataWrapper from '@/components/dashboard/DataWrapper';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function EmployerOverview() {
  const { data: statsData, isLoading: statsLoading, error: statsError, refetch: statsRefetch } = useQuery({
    queryKey: ['employer-stats'],
    queryFn: async () => {
      const response = await api.get('/dashboard/stats');
      return response.data.data;
    }
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['employer-chart'],
    queryFn: async () => {
      const response = await api.get('/dashboard/chart-data');
      return response.data.data;
    }
  });

  const stats = [
    { 
      label: 'Total Openings', 
      value: statsData?.totalJobs || 0, 
      icon: Briefcase, 
      color: 'text-primary',
      bg: 'bg-primary/10',
      trend: '+12%',
      trendUp: true
    },
    { 
      label: 'Active Applications', 
      value: statsData?.totalApplications || 0, 
      icon: Users, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10',
      trend: '+8%',
      trendUp: true
    },
    { 
      label: 'Hired Candidates', 
      value: statsData?.hiredCount || 0, 
      icon: CheckCircle2, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10',
      trend: '+24%',
      trendUp: true
    },
    { 
      label: 'Pending Review', 
      value: statsData?.pendingApplications || 0, 
      icon: Clock, 
      color: 'text-amber-500', 
      bg: 'bg-amber-500/10',
      trend: '-5%',
      trendUp: false
    },
  ];

  const categoryData = chartData?.jobsByCategory?.map((item: any) => ({
    name: item.category,
    value: item.count
  })) || [];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <DataWrapper 
      isLoading={statsLoading || chartLoading} 
      error={statsError} 
      retry={statsRefetch}
      loadingMessage="Compiling recruitment analytics..."
    >
      <div className="space-y-12 max-w-7xl mx-auto pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-wider border border-primary/20">
              <TrendingUp className="w-3 h-3" /> Talent Acquisition Insights
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tight leading-tight uppercase italic">Recruitment Performance</h1>
            <p className="text-muted-foreground font-medium max-w-md text-sm">Monitor your hiring pipeline and optimize your talent acquisition strategy with real-time data.</p>
          </div>
          
          <div className="flex items-center gap-4">
             <Link href="/dashboard/post-job">
               <Button className="h-16 px-10 rounded-2xl font-black text-xs uppercase tracking-widest bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/20 border-none transition-all flex items-center gap-2">
                 <Sparkles className="w-4 h-4" /> Expand Workspace
               </Button>
             </Link>
          </div>
        </div>

        {/* Core Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-card border border-border/60 rounded-[2.5rem] p-8 shadow-xl shadow-primary/5 group hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 -z-10" />
              
              <div className="flex justify-between items-start mb-6">
                 <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl transition-transform duration-500 group-hover:scale-110`}>
                    <stat.icon className="w-6 h-6" />
                 </div>
                 <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${stat.trendUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    <TrendingUp className={`w-3 h-3 ${!stat.trendUp && 'rotate-180'}`} /> {stat.trend}
                 </div>
              </div>
              
              <div className="space-y-1">
                 <h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</h3>
                 <div className="text-4xl font-black text-foreground tracking-tight">{stat.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Application Flow Chart */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             className="lg:col-span-2 bg-card border border-border rounded-[3rem] p-10 shadow-2xl shadow-primary/5 flex flex-col"
          >
             <div className="flex items-center justify-between mb-12">
                <div className="space-y-1">
                   <h2 className="text-2xl font-black text-foreground uppercase italic leading-none">Application Volume</h2>
                   <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.1em]">Total candidates across your active listings</p>
                </div>
                <div className="flex bg-muted/30 p-1 rounded-xl border border-border/40">
                   <button className="px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-background shadow-md text-primary">Overview</button>
                   <button className="px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-muted-foreground">Detailed</button>
                </div>
             </div>

             <div className="flex-1 min-h-[350px] relative">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData?.monthlyApplications || []}>
                   <defs>
                     <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                       <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                   <XAxis 
                     dataKey="month" 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{ fontSize: 10, fontWeight: 900, fill: 'var(--muted-foreground)' }}
                     dy={10}
                   />
                   <YAxis hide />
                   <Tooltip 
                     content={({ active, payload }) => {
                       if (active && payload && payload.length) {
                         return (
                           <div className="bg-background border border-border p-4 rounded-2xl shadow-2xl ring-4 ring-primary/5">
                             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{payload[0].payload.month}</p>
                             <p className="text-lg font-black text-primary">{payload[0].value} Candidates</p>
                           </div>
                         );
                       }
                       return null;
                     }}
                   />
                   <Area type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </motion.div>

          {/* Distribution Chart */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-card border border-border rounded-[3rem] p-10 shadow-2xl shadow-primary/5 flex flex-col"
          >
             <div className="space-y-1 mb-12">
                <h2 className="text-2xl font-black text-foreground uppercase italic leading-none">Job Distribution</h2>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.1em]">By Industry Category</p>
             </div>

             <div className="flex-1 min-h-[350px]">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={categoryData} layout="vertical" margin={{ left: 0, right: 30 }}>
                   <XAxis type="number" hide />
                   <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: 'var(--foreground)' }} width={80} />
                   <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      content={({ active, payload }) => {
                         if (active && payload && payload.length) {
                           return (
                             <div className="bg-background border border-border p-4 rounded-2xl shadow-2xl ring-4 ring-primary/5">
                               <p className="text-sm font-black text-primary">{payload[0].value} Positions</p>
                             </div>
                           );
                         }
                         return null;
                      }}
                   />
                   <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={24}>
                     {categoryData.map((entry: any, index: number) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>

             <div className="mt-8 pt-8 border-t border-border/40 space-y-4">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Top Category</span>
                   <span className="text-xs font-black text-primary">{categoryData[0]?.name || 'N/A'}</span>
                </div>
                <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} className="h-full bg-primary" />
                </div>
             </div>
          </motion.div>
        </div>

        {/* Quick Actions Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
           <Link href="/dashboard/my-jobs">
              <div className="p-10 bg-gradient-to-br from-card to-muted/20 border border-border/60 rounded-[3rem] hover:border-primary/40 hover:shadow-2xl transition-all group cursor-pointer relative overflow-hidden">
                 <div className="absolute top-10 right-10 p-4 bg-primary/10 rounded-2xl text-primary transition-transform group-hover:translate-x-2 group-hover:-translate-y-2">
                    <ArrowUpRight className="w-6 h-6" />
                 </div>
                 <h3 className="text-2xl font-black text-foreground mb-3 leading-none italic uppercase">Active Postings</h3>
                 <p className="text-muted-foreground font-medium text-sm max-w-xs mb-8">Manage your existing listings and review applicant dossiers.</p>
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                    Manage Positions <ArrowRight className="w-3 h-3" />
                 </div>
              </div>
           </Link>
           <Link href="/dashboard/applications">
              <div className="p-10 bg-gradient-to-br from-card to-muted/20 border border-border/60 rounded-[3rem] hover:border-blue-500/40 hover:shadow-2xl transition-all group cursor-pointer relative overflow-hidden">
                 <div className="absolute top-10 right-10 p-4 bg-blue-500/10 rounded-2xl text-blue-500 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2">
                    <ArrowUpRight className="w-6 h-6" />
                 </div>
                 <h3 className="text-2xl font-black text-foreground mb-3 leading-none italic uppercase">Recruitment Hub</h3>
                 <p className="text-muted-foreground font-medium text-sm max-w-xs mb-8">Process candidates through your custom recruitment funnel.</p>
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500">
                    View Pipelines <ArrowRight className="w-3 h-3" />
                 </div>
              </div>
           </Link>
        </div>
      </div>
    </DataWrapper>
  );
}
