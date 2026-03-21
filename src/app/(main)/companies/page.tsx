export const metadata = {
  title: "Companies | HireHub",
  description: "Discover top tech companies and startups hiring on HireHub.",
};

import React from 'react';
import { Search, MapPin, Users, Briefcase } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function CompaniesPage() {
  const companies = [
    { name: 'Acme Corp', industry: 'Software', location: 'San Francisco, CA', size: '500-1000', openJobs: 12, color: 'bg-blue-500' },
    { name: 'Globex UI', industry: 'Design', location: 'Remote', size: '50-200', openJobs: 4, color: 'bg-purple-500' },
    { name: 'Soylent Health', industry: 'Healthcare', location: 'New York, NY', size: '1000-5000', openJobs: 34, color: 'bg-emerald-500' },
    { name: 'Initech', industry: 'Finance', location: 'London, UK', size: '200-500', openJobs: 8, color: 'bg-indigo-500' },
    { name: 'Umbrella Tech', industry: 'Cybersecurity', location: 'Austin, TX', size: '10-50', openJobs: 2, color: 'bg-rose-500' },
    { name: 'Massive Dynamic', industry: 'Robotics', location: 'Boston, MA', size: '5000+', openJobs: 145, color: 'bg-orange-500' },
    { name: 'Hooli Cloud', industry: 'Cloud Computing', location: 'Seattle, WA', size: '500-1000', openJobs: 23, color: 'bg-sky-500' },
    { name: 'Stark Industries', industry: 'Engineering', location: 'Los Angeles, CA', size: '1000-5000', openJobs: 67, color: 'bg-red-600' },
    { name: 'Wayne Enterprises', industry: 'Logistics', location: 'Chicago, IL', size: '5000+', openJobs: 89, color: 'bg-slate-800' },
    { name: 'Cyberdyne', industry: 'Artificial Intelligence', location: 'Remote', size: '200-500', openJobs: 15, color: 'bg-zinc-600' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 min-h-[80vh]">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
          Discover Top <span className="text-primary">Companies</span>
        </h1>
        <p className="text-lg text-muted-foreground font-medium">
          Find your next career opportunity at leading technology companies and innovative startups around the globe.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto mb-12">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search companies by name or keywords..." 
            className="w-full h-14 pl-12 pr-4 bg-card border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 shadow-sm text-sm font-medium"
          />
        </div>
        <select className="h-14 bg-card border border-border px-6 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 shadow-sm text-sm font-bold md:w-64 cursor-pointer">
          <option>All Industries</option>
          <option>Software</option>
          <option>Healthcare</option>
          <option>Finance</option>
          <option>Design</option>
        </select>
        <Button className="h-14 px-8 rounded-2xl font-black shadow-lg shadow-primary/20">Search</Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company, i) => (
          <div key={i} className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
             <div className="flex items-start justify-between mb-6">
               <div className={`w-16 h-16 rounded-2xl ${company.color} flex items-center justify-center text-white font-black text-2xl shadow-lg`}>
                 {company.name.charAt(0)}
               </div>
               <Badge variant="secondary" className="bg-muted text-muted-foreground font-bold">{company.industry}</Badge>
             </div>
             
             <h3 className="text-2xl font-black text-foreground mb-4 group-hover:text-primary transition-colors">{company.name}</h3>
             
             <div className="space-y-3 mb-8">
               <div className="flex items-center gap-3 text-sm text-muted-foreground font-semibold">
                 <MapPin className="w-4 h-4" /> {company.location}
               </div>
               <div className="flex items-center gap-3 text-sm text-muted-foreground font-semibold">
                 <Users className="w-4 h-4" /> {company.size} employees
               </div>
               <div className="flex items-center gap-3 text-sm text-emerald-600 font-bold bg-emerald-50 w-max px-3 py-1 rounded-lg">
                 <Briefcase className="w-4 h-4" /> {company.openJobs} Open Positions
               </div>
             </div>

             <Button variant="outline" className="w-full h-12 rounded-xl border-border hover:bg-primary hover:text-white hover:border-primary transition-colors group/btn">
               View Profile
             </Button>
          </div>
        ))}
      </div>

    </div>
  );
}
