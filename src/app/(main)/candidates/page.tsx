import React from 'react';
import { Search, Filter, MapPin, Briefcase, User, Star, StarOff, Globe, ArrowRight, ShieldCheck, Mail, Users } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export const metadata = {
  title: 'Find Your Perfect Candidate | HireHub',
  description: 'Search through thousands of high-quality candidates across all tech industries.',
};

export default function CandidatesPage() {
  const candidates = [
    { name: 'Alex Thompson', role: 'Full Stack Engineer', skills: ['React', 'Node.js', 'Typescript'], location: 'Austin, TX', locationIcon: <Globe className="w-4 h-4" /> },
    { name: 'Maria Garcia', role: 'Lead UI/UX Designer', skills: ['Figma', 'Prototyping', 'User Research'], location: 'San Francisco, CA', locationIcon: <MapPin className="w-4 h-4" /> },
    { name: 'Sameer Khan', role: 'DevOps & Site Reliability', skills: ['AWS', 'Kubernetes', 'Terraform'], location: 'London, UK', locationIcon: <Globe className="w-4 h-4" /> },
    { name: 'Emily Chen', role: 'Data Scientist', skills: ['Python', 'PyTorch', 'SQL'], location: 'New York, NY', locationIcon: <MapPin className="w-4 h-4" /> },
    { name: 'Liam Murphy', role: 'Product Manager', skills: ['Agile', 'Strategy', 'Jira'], location: 'Dublin, Ireland', locationIcon: <Globe className="w-4 h-4" /> },
    { name: 'Sophie Dubois', role: 'Senior Mobile Developer', skills: ['Swift', 'Flutter', 'React Native'], location: 'Paris, France', locationIcon: <Globe className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-background min-h-screen py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Hero */}
        <div className="text-center mb-24 max-w-2xl mx-auto">
          <div className="inline-block p-4 bg-primary/10 rounded-full mb-6">
            <Users className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-foreground mb-8 tracking-tight">Find Your Perfect Candidate</h1>
          <p className="text-xl text-muted-foreground font-medium mb-10">Access a pool of pre-vetted, high-quality talent ready to bring their expertise to your team.</p>
        </div>

        {/* Search Bar + Filters */}
        <div className="bg-card border border-border shadow-2xl rounded-[2.5rem] p-6 lg:p-10 mb-20">
             <div className="flex flex-col lg:flex-row gap-6">
                <div className="relative flex-1">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6" />
                  <input type="text" placeholder="Search by role or name..." className="w-full pl-16 pr-6 py-6 bg-muted/30 border-2 border-transparent focus:border-primary/30 rounded-2xl outline-none font-bold text-lg transition-all" />
                </div>
                <div className="flex flex-wrap gap-4 lg:w-1/3">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input type="text" placeholder="Location" className="w-full pl-14 pr-6 py-6 bg-muted/30 border-2 border-transparent focus:border-primary/30 rounded-2xl outline-none font-bold text-lg transition-all" />
                  </div>
                  <Button variant="outline" className="p-6 h-auto rounded-2xl border-2"><Filter className="w-6 h-6" /></Button>
                  <Button variant="primary" className="px-10 h-auto rounded-2xl font-black text-lg shadow-lg shadow-primary/20">Search</Button>
                </div>
             </div>
        </div>

        {/* Candidate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-20">
          {candidates.map((candidate, idx) => (
            <div key={idx} className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all hover:scale-[1.02] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-8">
                  <div className="w-20 h-20 bg-primary/5 border border-primary/20 rounded-3xl flex items-center justify-center text-primary text-3xl font-black">{candidate.name[0]}</div>
                  <div className="flex flex-col items-end">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center mb-2">
                       <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />
                       Open to work
                    </span>
                    <div className="flex space-x-0.5">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <StarOff className="w-4 h-4 text-muted-foreground/30" />
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-black text-foreground mb-1 leading-tight">{candidate.name}</h3>
                  <p className="text-primary font-bold">{candidate.role}</p>
                  <div className="flex items-center text-muted-foreground space-x-2 mt-4 text-sm font-medium">
                    {candidate.locationIcon}
                    <span>{candidate.location}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-10">
                  {candidate.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="px-3 py-1 bg-muted rounded-xl text-xs font-bold text-foreground transition-colors hover:bg-primary/10 hover:text-primary">{skill}</span>
                  ))}
                </div>
              </div>

              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full py-5 rounded-2xl font-black text-lg border-2 hover:bg-primary hover:text-white transition-all">View Profile <ArrowRight className="ml-2 w-5 h-5" /></Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Employer Banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-[3rem] p-10 lg:p-20 text-center shadow-sm max-w-5xl mx-auto overflow-hidden relative">
             <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 -translate-y-12 translate-x-12 scale-150"><ShieldCheck className="w-32 h-32 text-primary" /></div>
             <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-black text-foreground mb-6">Login as Employer to contact candidates</h2>
                <p className="text-lg text-muted-foreground font-medium mb-12">Unlock full access to candidate profiles, direct messaging, and advanced hiring tools with an Employer account.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/login">
                    <Button variant="primary" className="px-12 py-6 h-auto text-xl font-black rounded-2xl shadow-xl shadow-primary/20">Login Now <Mail className="ml-2 w-5 h-5" /></Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="outline" className="px-12 py-6 h-auto text-xl font-bold rounded-2xl border-2">Post a Job</Button>
                  </Link>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
}
