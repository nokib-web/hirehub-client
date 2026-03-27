'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Star, Sparkles, MessageSquare, Briefcase, GraduationCap, Building2, LayoutGrid, Info, ChevronRight, Loader2 } from 'lucide-react';
import { IJob } from '@/types/job';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface JobTabsProps {
  job: IJob;
}

const TABS = ['Overview', 'Requirements', 'Company', 'Reviews'];

export default function JobTabs({ job }: JobTabsProps) {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [aiReviewSummary, setAiReviewSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const generateAISummary = async () => {
    setIsSummarizing(true);
    try {
      const response = await axios.post('https://hirehub-server-ydm5.onrender.com/api/ai/review-summary', {
        companyId: job.company, // Assuming company name used as proxy or id
      });
      setAiReviewSummary(response.data.data);
      toast.success('AI summary generated! ✨');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate AI summary');
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
      {/* Tab Navigation */}
      <div className="flex border-b border-border space-x-8 overflow-x-auto no-scrollbar scroll-smooth">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm sm:text-base font-bold transition-all relative whitespace-nowrap px-1 ${
              activeTab === tab 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTabOutline"
                className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full shadow-[0_0_12px_rgba(var(--primary),0.3)]"
              />
            )}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'Overview' && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            {/* About the role */}
            <section className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2.5">
                <Info className="w-5 h-5 text-primary" />
                About the role
              </h3>
              <p className="text-foreground/80 leading-relaxed text-base sm:text-lg">
                {job.description}
              </p>
            </section>

            {/* Key Responsibilities */}
            <section className="space-y-5">
              <h3 className="text-xl font-bold flex items-center gap-2.5">
                <LayoutGrid className="w-5 h-5 text-primary" />
                Key Responsibilities
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {job.responsibilities.map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-muted/30 border border-border/40 hover:border-primary/20 transition-colors group">
                     <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                     <p className="text-foreground/80 font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </section>

             {/* Required Skills */}
             <section className="space-y-4">
               <h3 className="text-xl font-bold flex items-center gap-2.5">
                 <Briefcase className="w-5 h-5 text-primary" />
                 Required Skills
               </h3>
               <div className="flex flex-wrap gap-2.5">
                 {job.skills.map(skill => (
                   <Badge key={skill} variant="secondary" className="px-5 py-2 text-sm font-bold bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10 transition-colors pointer-events-none rounded-xl">
                     {skill}
                   </Badge>
                 ))}
               </div>
             </section>

             {/* Benefits */}
             {job.benefits && job.benefits.length > 0 && (
               <section className="space-y-5">
                 <h3 className="text-xl font-bold flex items-center gap-2.5">
                   <Star className="w-5 h-5 text-primary" />
                   Benefits & Perks
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {job.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card hover:shadow-md transition-all group">
                         <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary transition-colors group-hover:text-white">
                           <LayoutGrid className="w-5 h-5" />
                         </div>
                         <span className="font-bold text-foreground/80">{benefit}</span>
                      </div>
                    ))}
                 </div>
               </section>
             )}
          </motion.div>
        )}

        {activeTab === 'Requirements' && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
             <section className="space-y-5">
              <h3 className="text-xl font-bold flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Who are we looking for?
              </h3>
              <div className="space-y-4">
                {job.requirements.map((req, i) => (
                  <div key={i} className="flex gap-4 items-start pb-4 border-b border-border/40 last:border-0 group">
                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold text-sm shrink-0 mt-1 group-hover:bg-primary group-hover:text-white transition-all">
                      {i + 1}
                    </div>
                    <p className="text-foreground/80 font-medium pt-2 leading-relaxed">{req}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-5">
               <h3 className="text-xl font-bold flex items-center gap-2.5">
                 <GraduationCap className="w-5 h-5 text-primary" />
                 Education & Qualifications
               </h3>
               <div className="bg-card border border-border/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-foreground/80 font-medium leading-relaxed">
                    Minimum Bachelor&apos;s degree in Computer Science, engineering or equivalent experience in the relevant field. 
                    Advanced certifications in cloud or modern frameworks is a huge plus.
                  </p>
               </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'Company' && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2.5">
                    <Building2 className="w-5 h-5 text-primary" />
                    Company Profiles
                  </h3>
                  <div className="space-y-3 bg-card border border-border p-6 rounded-2xl shadow-sm">
                     <div className="flex justify-between text-sm py-2 border-b border-border/40">
                        <span className="text-muted-foreground font-medium">Industry</span>
                        <span className="text-foreground font-bold">Tech / SaaS</span>
                     </div>
                     <div className="flex justify-between text-sm py-2 border-b border-border/40">
                        <span className="text-muted-foreground font-medium">Company size</span>
                        <span className="text-foreground font-bold">250 - 500 Employees</span>
                     </div>
                     <div className="flex justify-between text-sm py-2 border-b border-border/40">
                        <span className="text-muted-foreground font-medium">Type</span>
                        <span className="text-foreground font-bold">Private Limited</span>
                     </div>
                     <div className="flex justify-between text-sm py-2">
                        <span className="text-muted-foreground font-medium">Founded</span>
                        <span className="text-foreground font-bold">2016 (8 years ago)</span>
                     </div>
                  </div>
               </div>

               <div className="space-y-4 pt-1">
                  <h4 className="text-lg font-bold text-foreground/80">About {job.company}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {job.company} is a leading innovator in the space. We&apos;re on a mission to reshape the industry with technology that empowers millions of people worldwide. Join our world-class team.
                  </p>
                  <Button variant="ghost" className="p-0 text-primary font-bold hover:bg-transparent decoration-2 h-auto gap-2">
                    Visit Website
                    <ChevronRight className="w-4 h-4" />
                  </Button>
               </div>
            </section>

            <section className="bg-primary/5 p-8 rounded-2xl border border-primary/10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 text-primary/10 -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-32 h-32" />
               </div>
               <div className="relative z-10 space-y-4 max-w-lg">
                 <h3 className="text-2xl font-black text-foreground">Why join us?</h3>
                 <p className="text-muted-foreground font-medium leading-relaxed">
                   We believe in fostering a culture of ownership and innovation. We provide top-tier health benefits, competitive compensation, and a clear path for career growth. 
                   Our remote-first culture ensures a healthy work-life balance for all our team members.
                 </p>
               </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'Reviews' && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            {/* Reviews Summary Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 bg-card border border-border rounded-3xl shadow-sm">
               <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-5xl font-black text-foreground">4.8</div>
                    <div className="flex items-center justify-center gap-0.5 mt-2 text-amber-500">
                       <Star className="w-4 h-4 fill-current" />
                       <Star className="w-4 h-4 fill-current" />
                       <Star className="w-4 h-4 fill-current" />
                       <Star className="w-4 h-4 fill-current" />
                       <Star className="w-4 h-4 fill-current opacity-50" />
                    </div>
                  </div>
                  <div className="space-y-2 hidden xs:block">
                     <p className="text-sm font-bold text-foreground">Excellent Rating</p>
                     <p className="text-xs text-muted-foreground font-medium">Based on 124 reviews</p>
                  </div>
               </div>

               <Button 
                onClick={generateAISummary}
                disabled={isSummarizing || !!aiReviewSummary}
                className="gap-2.5 h-12 px-6 rounded-2xl font-bold group relative overflow-hidden active:scale-95 transition-all w-full sm:w-auto"
              >
                {isSummarizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                {isSummarizing ? 'Analyzing...' : aiReviewSummary ? 'AI Summary Updated' : 'AI Review Summary'}
              </Button>
            </div>

            {/* AI Review Summary Card */}
            <AnimatePresence>
               {aiReviewSummary && (
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="p-8 bg-gradient-to-br from-primary/10 via-background to-primary/5 rounded-3xl border border-primary/20 shadow-xl relative group overflow-hidden"
                 >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                       <Sparkles className="w-24 h-24 text-primary" />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                       <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white scale-90">
                          <Sparkles className="w-4 h-4" />
                       </div>
                       <h4 className="text-lg font-black text-primary uppercase tracking-wider">AI Insights</h4>
                    </div>
                    <p className="text-foreground/90 font-medium text-lg leading-relaxed first-letter:text-3xl first-letter:font-black first-letter:mr-1 first-letter:text-primary">
                      {aiReviewSummary}
                    </p>
                 </motion.div>
               )}
            </AnimatePresence>

            {/* Review List */}
            <div className="space-y-8">
               <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black flex items-center gap-2.5 uppercase tracking-tight">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Latest Reviews
                  </h3>
                  <Button variant="outline" className="text-xs font-bold uppercase rounded-lg">Write a Review</Button>
               </div>

               <div className="space-y-6">
                 {[1, 2].map((review) => (
                   <div key={review} className="p-8 bg-card border border-border/60 rounded-3xl hover:border-primary/20 transition-all hover:shadow-lg relative overflow-hidden group">
                      <div className="flex justify-between items-start mb-6">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center font-bold text-muted-foreground/80 text-xl uppercase border-2 border-border/40">J</div>
                            <div>
                               <p className="font-black text-foreground">John Doe</p>
                               <p className="text-xs text-muted-foreground font-semibold">Senior Developer • 2 weeks ago</p>
                            </div>
                         </div>
                         <div className="px-3 py-1 bg-green-500/10 text-green-600 rounded-lg text-xs font-black flex items-center gap-1.5 border border-green-500/20 shadow-sm">
                            <Star className="w-3 h-3 fill-current" /> 4.5
                         </div>
                      </div>

                      <h4 className="text-lg font-black text-foreground mb-3 leading-tight">&quot;A truly innovative place with great people and growth&quot;</h4>
                      <p className="text-foreground/70 font-medium leading-relaxed mb-6">
                        I&apos;ve been working here for over 2 years and the culture is amazing. The challenges we face keep us engaged and the leadership truly cares about individual growth. 
                        Best benefits package I&apos;ve ever had in my career.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10 hover:bg-green-500/10 transition-colors">
                            <p className="text-xs font-black text-green-700 uppercase mb-2">Pros</p>
                            <p className="text-sm font-medium text-foreground/80 italic">Remote work, Great salary, Innovation, Team culture.</p>
                         </div>
                         <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-colors">
                            <p className="text-xs font-black text-red-700 uppercase mb-2">Cons</p>
                            <p className="text-sm font-medium text-foreground/80 italic">Meetings across timezones, High pressure environment occasionally.</p>
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
