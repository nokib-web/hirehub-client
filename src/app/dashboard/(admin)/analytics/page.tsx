'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, Briefcase, FileText, 
  BarChart3, Calendar, Filter, Download, Zap, BrainCircuit, Globe,
  ArrowRight, ShieldAlert, BadgeCheck, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import DataWrapper from '@/components/dashboard/DataWrapper';
import Badge from '@/components/ui/Badge';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30d');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-analytics', timeRange],
    queryFn: async () => {
      const res = await api.get('/admin/analytics', { params: { range: timeRange } });
      return res.data.data;
    }
  });

  const metrics = data?.metrics || {
    platformGrowth: [
       { name: 'W1', users: 400, jobs: 240, apps: 2400 },
       { name: 'W2', users: 600, jobs: 300, apps: 3200 },
       { name: 'W3', users: 800, jobs: 420, apps: 4100 },
       { name: 'W4', users: 1100, jobs: 580, apps: 5300 },
    ],
    marketLiquiditySnapshot: [
       { name: 'Engineering', depth: 85, vol: 1200 },
       { name: 'Design', depth: 62, vol: 800 },
       { name: 'Marketing', depth: 45, vol: 500 },
       { name: 'Finance', depth: 38, vol: 350 },
       { name: 'Sales', depth: 55, vol: 600 },
    ],
    geoDistribution: [
       { name: 'North America', value: 45 },
       { name: 'Europe', value: 30 },
       { name: 'Asia Pacific', value: 15 },
       { name: 'Middle East', value: 7 },
       { name: 'Africa', value: 3 },
    ]
  };

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DataWrapper 
        isLoading={isLoading} 
        error={error} 
        retry={refetch}
        loadingMessage="Synthesizing platform-wide intelligence..."
      >
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
             <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-wider border border-primary/20">
                  <BrainCircuit className="w-3 h-3" /> Advanced Telemetry
                </div>
                <h1 className="text-5xl font-black text-foreground tracking-tight leading-none italic uppercase">Platform Intelligence</h1>
                <p className="text-muted-foreground font-medium max-w-lg">Deep-dive synchronization of cross-platform metrics. Monitor hiring velocity, market depth, and ecosystem maturity.</p>
             </div>

             <div className="flex items-center gap-4 bg-muted/20 p-2 rounded-2xl border border-border/40">
                {['7d', '30d', '90d', 'All'].map(range => (
                  <button 
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === range ? 'bg-background shadow-xl text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {range}
                  </button>
                ))}
             </div>
          </div>

          {/* Main Growth Graph */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border shadow-2xl shadow-primary/5 rounded-[4rem] p-12 relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10" />
             
             <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 mb-16">
                <div className="space-y-2">
                   <h2 className="text-3xl font-black uppercase italic tracking-tighter">Ecosystem Influx</h2>
                   <p className="text-sm font-bold text-muted-foreground opacity-60">Comparative analysis of user acquisition vs job liquidity over time</p>
                </div>
                
                <div className="flex flex-wrap gap-8">
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <div className="space-y-1">
                         <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">Citizens</p>
                         <p className="text-xl font-black italic">+2,401</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 border-l border-border/60 pl-8">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <div className="space-y-1">
                         <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">Listings</p>
                         <p className="text-xl font-black italic">+842</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 border-l border-border/60 pl-8">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <div className="space-y-1">
                         <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">Hired</p>
                         <p className="text-xl font-black italic">+156</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="h-[450px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={metrics.platformGrowth}>
                      <defs>
                         <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                         </linearGradient>
                         <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#374151" opacity={0.1} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900, fill: '#6b7280' }} dy={15} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900, fill: '#6b7280' }} dx={-15} />
                      <Tooltip 
                        cursor={{ stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '10 10' }}
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          borderRadius: '2rem', 
                          border: 'none', 
                          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', 
                          padding: '2rem',
                          color: '#fff'
                        }} 
                        itemStyle={{ fontWeight: 900, fontSize: '14px', padding: '0.25rem 0' }}
                      />
                      <Area type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={6} fillOpacity={1} fill="url(#colorUsers)" />
                      <Area type="monotone" dataKey="jobs" stroke="#3b82f6" strokeWidth={6} fillOpacity={1} fill="url(#colorJobs)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </motion.div>

          {/* Secondary Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             <div className="bg-card border border-border rounded-[3rem] p-10 shadow-xl shadow-primary/5">
                <div className="flex items-center gap-4 mb-10">
                   <div className="p-3 bg-primary/10 rounded-2xl">
                      <Zap className="w-5 h-5 text-primary" />
                   </div>
                   <h3 className="text-xl font-black uppercase italic tracking-tighter">Sector Market Maturity</h3>
                </div>
                <div className="h-[350px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metrics.marketLiquiditySnapshot}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                         <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} dy={10} />
                         <YAxis axisLine={false} tickLine={false} hide />
                         <Tooltip cursor={{ fill: '#f3f4f6', opacity: 0.1 }} contentStyle={{ borderRadius: '1.5rem', border: 'none', backgroundColor: '#1f2937' }} />
                         <Bar dataKey="depth" fill="#8b5cf6" radius={[15, 15, 0, 0]} barSize={40} />
                         <Bar dataKey="vol" fill="#3b82f6" radius={[15, 15, 0, 0]} barSize={40} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>

             <div className="bg-card border border-border rounded-[3rem] p-10 shadow-xl shadow-primary/5">
                <div className="flex items-center gap-4 mb-10">
                   <div className="p-3 bg-emerald-500/10 rounded-2xl">
                      <Globe className="w-5 h-5 text-emerald-500" />
                   </div>
                   <h3 className="text-xl font-black uppercase italic tracking-tighter">Terminal Geo-Distribution</h3>
                </div>
                <div className="h-[350px] w-full flex items-center justify-center">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie
                            data={metrics.geoDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={120}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                         >
                            {metrics.geoDistribution.map((entry: { name: string, value: number }, index: number) => (
                               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                         </Pie>
                         <Tooltip contentStyle={{ borderRadius: '1.25rem', border: 'none', backgroundColor: '#1f2937' }} />
                         <Legend iconType="circle" layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ paddingLeft: '30px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }} />
                      </PieChart>
                   </ResponsiveContainer>
                </div>
             </div>
          </div>

          {/* Core Analytics Export */}
          <div className="bg-foreground text-background rounded-[4rem] p-12 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-foreground/20">
             <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-background/10 text-background rounded-full text-[10px] font-black uppercase tracking-wider border border-background/20">
                  <Download className="w-3 h-3" /> System Export
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter leading-none">Download Intelligence Core</h2>
                <p className="text-background/60 font-bold max-w-sm">Generate a comprehensive YAML/JSON snapshot of current platform maturity metrics.</p>
             </div>
             <Button className="h-20 px-12 rounded-[2rem] bg-background text-foreground font-black text-lg shadow-2xl hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-4 group">
                Request Protocol Snapshot <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
             </Button>
          </div>
        </div>
      </DataWrapper>
    </ProtectedRoute>
  );
}

