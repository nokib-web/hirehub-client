'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { motion } from 'framer-motion';
import { 
  Users, 
  Briefcase, 
  FileText, 
  CheckCircle2, 
  TrendingUp, 
  ArrowUpRight, 
  BarChart3,
  Server,
  Activity,
  Globe
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
  Cell,
  PieChart,
  Pie
} from 'recharts';

export default function AdminOverview() {
  const { data: statsData, isLoading: statsLoading, error: statsError, refetch: statsRefetch } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await api.get('/dashboard/stats');
      return response.data.data;
    }
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['admin-charts'],
    queryFn: async () => {
      const response = await api.get('/dashboard/chart-data');
      return response.data.data;
    }
  });

  const stats = [
    { 
      label: 'Total Residents', 
      value: statsData?.totalUsers || 0, 
      icon: Users, 
      color: 'text-primary',
      bg: 'bg-primary/10',
      trend: '+12%',
      trendUp: true
    },
    { 
      label: 'Live Listings', 
      value: statsData?.activeJobs || 0, 
      icon: Briefcase, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10',
      trend: '+5%',
      trendUp: true
    },
    { 
      label: 'Global Submissions', 
      value: statsData?.totalApplications || 0, 
      icon: FileText, 
      color: 'text-amber-500', 
      bg: 'bg-amber-500/10',
      trend: '+18%',
      trendUp: true
    },
    { 
      label: 'Hiring Success', 
      value: statsData?.hiredCount || 0, 
      icon: CheckCircle2, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10',
      trend: '+24%',
      trendUp: true
    },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <DataWrapper 
      isLoading={statsLoading || chartLoading} 
      error={statsError} 
      retry={statsRefetch}
      loadingMessage="Synchronizing platform core metrics..."
    >
      <div className="space-y-12 max-w-7xl mx-auto pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-wider border border-primary/20">
              <Server className="w-3 h-3" /> System Console v4.0
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tight leading-tight uppercase italic">Platform Overview</h1>
            <p className="text-muted-foreground font-medium max-w-md text-sm">Real-time surveillance of ecosystem health, user growth, and market liquidity.</p>
          </div>
          
          <div className="flex items-center gap-6 bg-card border border-border p-4 rounded-3xl shadow-xl shadow-primary/5">
             <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-card bg-muted flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-4 border-card bg-primary flex items-center justify-center text-[10px] font-black text-white">
                  +12
                </div>
             </div>
             <div className="text-left">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">New Residents</p>
                <p className="text-sm font-black text-foreground">In last 24 hours</p>
             </div>
          </div>
        </div>

        {/* Dynamic Stats Grid */}
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
                 <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black uppercase">
                    <TrendingUp className="w-3 h-3" /> {stat.trend}
                 </div>
              </div>
              
              <div className="space-y-1">
                 <h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</h3>
                 <div className="text-4xl font-black text-foreground tracking-tight">{stat.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Analytics Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Growth Area */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             className="lg:col-span-2 bg-card border border-border rounded-[3rem] p-10 shadow-2xl shadow-primary/5 flex flex-col"
          >
             <div className="flex items-center justify-between mb-12">
                <div className="space-y-1">
                   <h2 className="text-2xl font-black text-foreground uppercase italic leading-none">Ecosystem Growth</h2>
                   <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.1em]">User registration velocity per month</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                   <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-primary" /> Jobseekers</div>
                   <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Employers</div>
                </div>
             </div>

             <div className="flex-1 min-h-[350px]">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData?.userGrowth || []}>
                   <defs>
                     <linearGradient id="colorJ" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                       <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorE" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                       <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
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
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 border-b border-border pb-2">{payload[0].payload.month}</p>
                              <div className="space-y-2">
                                <p className="text-sm font-black text-primary flex items-center justify-between gap-8">{payload[0].value} Jobseekers <ArrowUpRight className="w-3 h-3" /></p>
                                <p className="text-sm font-black text-emerald-500 flex items-center justify-between gap-8">{payload[1]?.value || 0} Employers <ArrowUpRight className="w-3 h-3" /></p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                     }}
                   />
                   <Area type="monotone" dataKey="jobseekers" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorJ)" />
                   <Area type="monotone" dataKey="employers" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorE)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </motion.div>

          {/* Market Sentiment / Status */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-card border border-border rounded-[3rem] p-10 shadow-2xl shadow-primary/5 flex flex-col"
          >
             <div className="space-y-1 mb-12">
                <h2 className="text-2xl font-black text-foreground uppercase italic leading-none">Liquidity</h2>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.1em]">Application Status Distribution</p>
             </div>

             <div className="flex-1 min-h-[300px] mb-8 relative">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                  <Pie
                    data={chartData?.applicationsByStatus?.map((item: any) => ({ name: item.status, value: item.count })) || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData?.applicationsByStatus?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Total</span>
                  <span className="text-3xl font-black text-foreground">{statsData?.totalApplications || 0}</span>
               </div>
             </div>

             <div className="space-y-4">
                {chartData?.applicationsByStatus?.slice(0, 3).map((item: any, idx: number) => (
                  <div key={item.status} className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-border/40">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                       <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{item.status}</span>
                    </div>
                    <span className="text-xs font-black text-primary">{item.count}</span>
                  </div>
                ))}
             </div>
          </motion.div>
        </div>

        {/* Global Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
           {/* Industry Mix */}
           <div className="bg-card border border-border rounded-[3rem] p-10 shadow-2xl shadow-primary/5 space-y-8 flex flex-col">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black uppercase italic leading-none">Sector Mix</h3>
                 <Globe className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 space-y-6">
                 {chartData?.jobsByCategory?.slice(0, 5).map((cat: any, idx: number) => (
                   <div key={cat.category} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                         <span>{cat.category}</span>
                         <span className="text-primary">{cat.count}</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }} 
                           animate={{ width: `${(cat.count / (statsData?.totalJobs || 1)) * 100}%` }} 
                           className="h-full bg-primary" 
                           style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                         />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Performance metrics */}
           <div className="bg-card border border-border rounded-[3rem] p-10 shadow-2xl shadow-primary/5 flex flex-col justify-between">
              <div className="space-y-6">
                 <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 w-fit">
                    <Activity className="w-6 h-6 text-primary" />
                 </div>
                 <h2 className="text-3xl font-black uppercase italic leading-none">Operational Speed</h2>
                 <p className="text-muted-foreground font-medium text-sm">Average platform velocity for hiring cycle completion.</p>
              </div>
              
              <div className="pt-10 space-y-4">
                 <div className="flex items-center justify-between border-b border-border/60 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ave. Time to Hire</span>
                    <span className="text-lg font-black text-foreground">14 Days</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">System Uptime</span>
                    <span className="text-lg font-black text-emerald-500">99.98%</span>
                 </div>
              </div>
           </div>

           {/* Top Performers */}
           <div className="bg-card border border-border rounded-[3rem] p-10 shadow-2xl shadow-primary/5 space-y-8">
              <h3 className="text-xl font-black uppercase italic leading-none">Liquidity Leaders</h3>
              <div className="space-y-6">
                 {chartData?.topCompanies?.map((comp: any) => (
                   <div key={comp.company} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center font-black text-sm text-primary">
                            {comp.company.charAt(0)}
                         </div>
                         <div className="flex flex-col">
                            <span className="text-sm font-black text-foreground">{comp.company}</span>
                            <span className="text-[9px] font-black text-muted-foreground uppercase">{comp.applications} Interactions</span>
                         </div>
                      </div>
                      <div className="text-emerald-500"><TrendingUp className="w-4 h-4" /></div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </DataWrapper>
  );
}
