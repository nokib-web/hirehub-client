export const metadata = {
  title: "About Us | HireHub",
  description: "Learn more about our mission, vision, and the team building HireHub.",
};

import React from 'react';
import { Target, Users, Zap, Shield, Trophy, LayoutGrid, Heart, Coffee } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  const values = [
    { title: 'Transparency', icon: <Trophy className="w-8 h-8 text-amber-500" />, desc: 'Open communication and clear processes for both job seekers and employers.' },
    { title: 'Innovation', icon: <Zap className="w-8 h-8 text-blue-500" />, desc: 'Constantly pushing the boundaries of AI integration in modern recruitment.' },
    { title: 'Inclusion', icon: <Heart className="w-8 h-8 text-rose-500" />, desc: 'Building diverse teams by removing typical hiring biases and roadblocks.' },
    { title: 'Excellence', icon: <Shield className="w-8 h-8 text-emerald-500" />, desc: 'Delivering the highest quality service, tools, and talent matches.' },
  ];

  const team = [
    { name: 'Sarah Drasner', role: 'CEO & Founder', color: 'bg-indigo-500' },
    { name: 'Michael Chen', role: 'Chief Technology Officer', color: 'bg-blue-600' },
    { name: 'Amara Rahman', role: 'Head of People', color: 'bg-emerald-600' },
    { name: 'David Smith', role: 'VP of Engineering', color: 'bg-amber-600' },
  ];

  const benefits = [
    { title: 'AI-Powered Matching', desc: 'Our proprietary algorithms connect you with roles that fit your actual skills, not just keywords.', icon: <LayoutGrid/> },
    { title: 'Direct Employer Access', desc: 'Skip the recruiters. Talk directly to the hiring managers and founders looking for talent.', icon: <Users/> },
    { title: 'Verified Companies', desc: 'Every employer on HireHub undergoes a strict vetting process to ensure safe, legitimate open roles.', icon: <Trophy/> },
  ];

  return (
    <div className="bg-background min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary/5 py-24 sm:py-32 border-b border-border">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-blue-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground mb-6">
            Connecting Talent with <span className="text-primary italic">Opportunity</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg leading-8 text-muted-foreground font-medium">
            We're on a mission to completely completely redesign the global hiring process. We believe everyone deserves a career they love, and every company deserves the perfect team.
          </p>
          <div className="mt-10 flex justify-center gap-x-6 gap-y-4 flex-col sm:flex-row">
            <div className="bg-card px-8 py-6 rounded-3xl border border-border shadow-sm flex flex-col items-center">
               <dt className="text-sm font-black text-muted-foreground uppercase tracking-widest">Global Users</dt>
               <dd className="text-4xl font-black text-foreground mt-2">120K+</dd>
            </div>
            <div className="bg-card px-8 py-6 rounded-3xl border border-border shadow-sm flex flex-col items-center">
               <dt className="text-sm font-black text-muted-foreground uppercase tracking-widest">Companies Hiring</dt>
               <dd className="text-4xl font-black text-foreground mt-2">4,500+</dd>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
           <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-black text-foreground">Our Story</h2>
              <div className="prose prose-lg dark:prose-invert text-muted-foreground leading-relaxed">
                <p>HireHub was founded in 2024 out of pure frustration with the traditional hiring process. We noticed brilliant engineers applying to hundreds of jobs without hearing back, while companies struggled for months to fill critical roles.</p>
                <p>Our founding team realized that the disjointed tools, keyword-stuffed resumes, and biased ATS systems were destroying opportunities. We decided to build a platform that strips away the noise and directly connects raw talent with the people making hiring decisions.</p>
                <p>Today, HireHub leverages cutting-edge AI and seamless UI design to automatically match candidates with roles they will thrive in, cutting standard hiring timelines by over 60% globally.</p>
              </div>
           </div>
           
           <div className="flex-1 flex gap-4 w-full justify-center">
              <div className="w-48 h-64 bg-primary/20 rounded-3xl overflow-hidden shadow-2xl translate-y-8 border flex items-center justify-center border-primary/30">
                <Coffee className="w-16 h-16 text-primary" />
              </div>
              <div className="w-48 h-64 bg-blue-500/20 rounded-3xl overflow-hidden shadow-2xl -translate-y-8 border flex items-center justify-center border-blue-500/30">
                <Target className="w-16 h-16 text-blue-500" />
              </div>
           </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/40 py-24 border-y border-border">
         <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
               <h2 className="text-3xl font-black text-foreground">Our Core Values</h2>
               <p className="mt-4 text-muted-foreground font-medium">The principles that guide our team's daily decisions and long-term vision.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {values.map((v, i) => (
                 <div key={i} className="bg-card p-8 rounded-3xl border border-border hover:border-primary/50 transition-colors text-center shadow-sm">
                   <div className="w-16 h-16 mx-auto bg-muted rounded-2xl flex items-center justify-center mb-6">
                     {v.icon}
                   </div>
                   <h3 className="text-xl font-black mb-3 text-foreground">{v.title}</h3>
                   <p className="text-muted-foreground font-medium text-sm leading-relaxed">{v.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Team */}
      <section className="py-24 mx-auto max-w-7xl px-6 lg:px-8">
         <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-foreground">Meet the Leadership</h2>
            <p className="mt-4 text-muted-foreground font-medium">The people making HireHub the best recruitment experience.</p>
         </div>
         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((t, i) => (
              <div key={i} className="group text-center">
                 <div className={`w-40 h-40 mx-auto rounded-full ${t.color} text-white flex items-center justify-center text-4xl font-black shadow-xl border-4 border-card mb-6 group-hover:scale-105 transition-transform`}>
                   {t.name.split(' ').map(n => n.charAt(0)).join('')}
                 </div>
                 <h3 className="text-xl font-black text-foreground">{t.name}</h3>
                 <p className="text-sm text-primary font-bold mt-1 uppercase tracking-wider">{t.role}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-primary text-primary-foreground py-24 border-y border-primary-foreground/10">
         <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
               <h2 className="text-3xl font-black text-white">Why Choose HireHub</h2>
               <p className="mt-4 text-primary-foreground/80 font-medium">Let's compare us to the traditional job boards.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-8 text-center text-white">
               {benefits.map((b, i) => (
                 <div key={i} className="flex flex-col items-center">
                   <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                     {React.cloneElement(b.icon as React.ReactElement, { className: "w-8 h-8 text-white" })}
                   </div>
                   <h3 className="text-xl font-black mb-3">{b.title}</h3>
                   <p className="text-primary-foreground/80 font-medium leading-relaxed max-w-xs">{b.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

    </div>
  );
}
