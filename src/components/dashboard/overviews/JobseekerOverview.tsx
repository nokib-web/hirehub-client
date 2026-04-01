'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { motion } from 'framer-motion';
import { 
  FileText, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  BarChart3,
  TrendingUp,
  Briefcase,
  Sparkles,
  ArrowRight,
  ChevronRight,
  AlertCircle
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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function JobseekerOverview() {
  const { data: statsData, isLoading: statsLoading, error: statsError, refetch: statsRefetch } = useQuery({
    queryKey: ['jobseeker-stats'],
    queryFn: async () => {
      const response = await api.get('/dashboard/stats');
      return response.data.data;
    }
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['jobseeker-chart'],
    queryFn: async () => {
      const response = await api.get('/dashboard/chart-data');
      return response.data.data;
    }
  });

  const stats = [
    { 
      label: 'Applications', 
      value: statsData?.totalApplications || 0, 
      icon: FileText, 
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    { 
      label: 'Pending', 
      value: statsData?.pendingApplications || 0, 
      icon: Clock, 
      color: 'text-amber-500', 
      bg: 'bg-amber-500/10',
    },
    { 
      label: 'Shortlisted', 
      value: statsData?.shortlistedCount || 0, 
      icon: TrendingUp, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10',
    },
    { 
      label: 'Success Rate', 
      value: statsData?.hiredCount ? `${Math.round((statsData.hiredCount / (statsData.totalApplications || 1)) * 100)}%` : '0%', 
      icon: CheckCircle2, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10',
    },
  ];

  const statusData = chartData?.applicationsByStatus?.map((item: any) => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: item.count
  })) || [];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <DataWrapper 
      isLoading={statsLoading || chartLoading} 
      error={statsError} 
      retry={statsRefetch}
      loadingMessage="Analyzing your career progression..."
    >
      <div className="space-y-12 max-w-7xl mx-auto pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-wider border border-primary/20">
              <BarChart3 className="w-3 h-3" /> Career Dashboard
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tight leading-tight uppercase italic">Journey Overview</h1>
            <p className="text-muted-foreground font-medium max-w-md text-sm">Track your applications, monitor status updates, and discover new opportunities.</p>
          </div>
          
          <div className="flex items-center gap-4">
             <Link href="/jobs">
               <Button className="h-16 px-10 rounded-2xl font-black text-xs uppercase tracking-widest bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/20 border-none transition-all flex items-center gap-2">
                 <Sparkles className="w-4 h-4" /> Explore Jobs
               </Button>
             </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-card border border-border/60 rounded-[2.5rem] p-8 shadow-xl shadow-primary/5 group hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
            >
              <div className="flex items-center gap-6">
                 <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl transition-transform duration-500 group-hover:scale-110`}>
                    <stat.icon className="w-6 h-6" />
                 </div>
                 <div className="space-y-0.5">
                    <h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</h3>
                    <div className="text-3xl font-black text-foreground tracking-tight">{stat.value}</div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* History Chart */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             className="lg:col-span-2 bg-card border border-border rounded-[3rem] p-10 shadow-2xl shadow-primary/5 flex flex-col"
          >
             <div className="space-y-1 mb-12">
                <h2 className="text-2xl font-black text-foreground uppercase italic leading-none">Application Activity</h2>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.1em]">Your timeline of career milestones</p>
             </div>

             <div className="flex-1 min-h-[350px]">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData?.monthlyApplications || []}>
                   <defs>
                     <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                       <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="var(--border)" opacity={0.5} />
                   <XAxis 
                     dataKey="month" 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{ fontSize: 10, fontWeight: 900, fill: 'var(--muted-foreground)' }}
                     dy={10}
                   />
                   <Tooltip 
                     content={({ active, payload }) => {
                       if (active && payload && payload.length) {
                         return (
                           <div className="bg-background border border-border p-4 rounded-2xl shadow-2xl ring-4 ring-primary/5">
                             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{payload[0].payload.month}</p>
                             <p className="text-lg font-black text-primary">{payload[0].value} Applications</p>
                           </div>
                         );
                       }
                       return null;
                     }}
                   />
                   <Area type="step" dataKey="count" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </motion.div>

          {/* Distribution Pie */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-card border border-border rounded-[3rem] p-10 shadow-2xl shadow-primary/5 flex flex-col items-center justify-center text-center"
          >
             <div className="w-full text-left mb-12">
                <h2 className="text-2xl font-black text-foreground uppercase italic leading-none">Pipeline Status</h2>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.1em]">Current phase distribution</p>
             </div>

             <div className="flex-1 min-h-[300px] w-full relative h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={statusData}
                     cx="50%"
                     cy="50%"
                     innerRadius={80}
                     outerRadius={120}
                     paddingAngle={12}
                     dataKey="value"
                     stroke="none"
                   >
                     {statusData.map((entry: any, index: number) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip 
                     content={({ active, payload }) => {
                       if (active && payload && payload.length) {
                         return (
                           <div className="bg-background border border-border p-4 rounded-2xl shadow-2xl ring-4 ring-primary/5">
                             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{payload[0].name}</p>
                             <p className="text-lg font-black" style={{ color: payload[0].payload.fill }}>{payload[0].value} Times</p>
                           </div>
                         );
                       }
                       return null;
                     }}
                   />
                 </PieChart>
               </ResponsiveContainer>
               {/* Center Label */}
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Progression</span>
                  <span className="text-4xl font-black text-foreground">{statsData?.totalApplications || 0}</span>
               </div>
             </div>

             <div className="w-full mt-8 grid grid-cols-2 gap-4">
                {statusData.slice(0, 4).map((item: any, idx: number) => (
                  <div key={item.name} className="flex items-center gap-3 p-3 bg-muted/20 border border-border/40 rounded-xl">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <div className="flex flex-col text-left">
                       <span className="text-[8px] font-black text-muted-foreground uppercase">{item.name}</span>
                       <span className="text-xs font-black text-foreground">{item.value}</span>
                    </div>
                  </div>
                ))}
             </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {/* Large Action Cards */}
           <Link href="/dashboard/my-applications" className="lg:col-span-2">
              <div className="bg-gradient-to-br from-primary/95 to-primary p-12 rounded-[3.5rem] shadow-2xl shadow-primary/20 text-white group h-full cursor-pointer overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-32 -mt-32 transform group-hover:scale-125 transition-transform duration-700" />
                 <div className="relative z-10 space-y-8">
                    <div className="p-5 bg-white/10 rounded-2xl w-fit border border-white/20 backdrop-blur-md">
                       <FileText className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-4xl font-black tracking-tight italic uppercase">View Dossiers</h3>
                       <p className="text-primary-foreground/90 font-medium max-w-sm">Manage your active applications and track real-time employer reviews.</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest bg-white text-primary px-6 py-4 rounded-2xl w-fit group-hover:gap-5 transition-all">
                       Go to Applications <ChevronRight className="w-4 h-4" />
                    </div>
                 </div>
              </div>
           </Link>

           <div className="space-y-8">
              <Link href="/dashboard/profile">
                 <div className="bg-card border border-border/60 p-8 rounded-[2.5rem] shadow-xl shadow-primary/5 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all group cursor-pointer h-full flex flex-col justify-between">
                    <div className="space-y-6">
                       <div className="p-4 bg-muted/50 rounded-2xl border border-border/40 w-fit">
                          <Sparkles className="w-6 h-6 text-primary" />
                       </div>
                       <h3 className="text-2xl font-black uppercase italic leading-none">Smart Profile</h3>
                       <p className="text-muted-foreground text-sm font-medium">Keep your credentials up to date to increase your match score.</p>
                    </div>
                    <div className="pt-8 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-primary">
                       Update Details <ArrowUpRight className="w-4 h-4" />
                    </div>
                 </div>
              </Link>
              <div className="bg-amber-500/5 border border-amber-500/20 p-8 rounded-[2.5rem] space-y-4">
                 <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Career Tip</span>
                 </div>
                 <p className="text-xs text-amber-600/80 font-bold leading-relaxed italic">
                    &quot;A tailored cover letter increases your chances of land an interview by up to 2.5x. Use our AI Assistant to get started!&quot;
                 </p>
              </div>
           </div>
        </div>
      </div>
    </DataWrapper>
  );
}
