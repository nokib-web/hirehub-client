import React from 'react';
import { Star, Quote, ArrowRight, UserCheck, Briefcase, Award, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export const metadata = {
  title: 'Success Stories | HireHub',
  description: 'Read how HireHub helped these professionals land their dream roles.',
};

export default function SuccessStories() {
  const stories = [
    {
      name: 'Sarah Jenkins',
      role: 'Senior Frontend Engineer',
      company: 'VeloTech Systems',
      prevRole: 'Junior Developer',
      timeToHire: 'Hired in 2 weeks',
      quote: 'HireHub changed my career trajectory. The UI was so intuitive and I landed a senior role at a top tech firm faster than I imagined.',
      rating: 5,
      initials: 'SJ'
    },
    {
      name: 'Mark Thompson',
      role: 'DevOps Lead',
      company: 'CloudFlow Dynamics',
      prevRole: 'System Admin',
      timeToHire: 'Hired in 3 weeks',
      quote: 'The job matches were highly accurate. HireHub recommended roles that perfectly aligned with my cloud scaling expertise.',
      rating: 5,
      initials: 'MT'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Product Designer',
      company: 'PixelPerfect Agency',
      prevRole: 'Freelance Artist',
      timeToHire: 'Hired in 10 days',
      quote: 'The platform is beautiful and efficient. I was able to showcase my portfolio and land a dream creative role effortlessly.',
      rating: 5,
      initials: 'ER'
    },
    {
      name: 'James Wilson',
      role: 'Backend Architect',
      company: 'ScaleUp Financial',
      prevRole: 'Mid-level Developer',
      timeToHire: 'Hired in 4 weeks',
      quote: 'HireHub curated the best fintech roles. I found a company that value my architectural experience and offers great benefits.',
      rating: 4,
      initials: 'JW'
    },
    {
      name: 'Chloe Watson',
      role: 'Marketing Manager',
      company: 'BrandPulse Media',
      prevRole: 'Social Media Specialist',
      timeToHire: 'Hired in 2 weeks',
      quote: 'The employer insights on HireHub helped me prepare for interviews with confidence. A truly game-changing recruitment tool.',
      rating: 5,
      initials: 'CW'
    },
    {
      name: 'David Kim',
      role: 'Data Scientist',
      company: 'Insight Analytics',
      prevRole: 'Mathematics Teacher',
      timeToHire: 'Hired in 5 weeks',
      quote: 'Transitioning into tech was tough until I used HireHub. Their AI tools and personalized job alerts were exactly what I needed.',
      rating: 5,
      initials: 'DK'
    }
  ];

  return (
    <div className="bg-background min-h-screen py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <div className="inline-block p-4 bg-primary/10 rounded-full mb-6">
            <Award className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-foreground mb-8 tracking-tight">Our Success Stories</h1>
          <p className="text-xl text-muted-foreground font-medium mb-12">
            Real stories from real people who found their next professional chapter through HireHub. Join thousands who have transformed their careers.
          </p>
          <div className="flex justify-center space-x-12 px-6 py-8 bg-muted/30 rounded-3xl border border-border/60">
             <div className="text-center">
                <p className="text-3xl font-black text-foreground">15k+</p>
                <p className="text-xs uppercase tracking-widest font-black text-muted-foreground">Placements</p>
             </div>
             <div className="text-center border-l border-border pl-12">
                <p className="text-3xl font-black text-foreground">94%</p>
                <p className="text-xs uppercase tracking-widest font-black text-muted-foreground">Satisfaction</p>
             </div>
             <div className="text-center border-l border-border pl-12">
                <p className="text-3xl font-black text-foreground">500+</p>
                <p className="text-xs uppercase tracking-widest font-black text-muted-foreground">Top Companies</p>
             </div>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-24">
          {stories.map((story, idx) => (
            <div key={idx} className="bg-card border border-border rounded-[2.5rem] p-10 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-primary/20">{story.initials}</div>
                  <div>
                    <h3 className="text-xl font-black text-foreground">{story.name}</h3>
                    <p className="text-sm font-bold text-primary">{story.role}</p>
                    <p className="text-xs font-medium text-muted-foreground">@ {story.company}</p>
                  </div>
                </div>
                
                <div className="mb-6 flex space-x-1">
                  {Array.from({ length: 5 }).map((_, sIdx) => (
                    <Star key={sIdx} className={`w-4 h-4 ${sIdx < story.rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/30'}`} />
                  ))}
                </div>

                <div className="relative mb-10">
                  <Quote className="w-8 h-8 text-primary/10 absolute -top-4 -left-4" />
                  <p className="text-foreground/90 font-medium italic relative z-10 leading-relaxed text-lg">"{story.quote}"</p>
                </div>
              </div>

              <div className="pt-8 border-t border-border mt-auto">
                 <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">
                    <Briefcase className="w-4 h-4" />
                    <span>Previous: {story.prevRole}</span>
                 </div>
                 <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-primary">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{story.timeToHire}</span>
                 </div>
              </div>
            </div>
          ))}
        </div>

        {/* Start Your Story CTA */}
        <div className="bg-primary text-white rounded-[3rem] p-10 lg:p-20 text-center shadow-2xl shadow-primary/30 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-50" />
             <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-4xl lg:text-5xl font-black mb-8">Ready to write your own success story?</h2>
                <p className="text-xl opacity-90 mb-12 font-medium">Join HireHub today and let us help you find the opportunity you've been waiting for.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/register">
                    <Button variant="outline" className="bg-white text-primary border-transparent px-10 py-7 h-auto text-xl font-black rounded-2xl shadow-2xl hover:bg-white/95">Register Now</Button>
                  </Link>
                  <Link href="/jobs">
                    <Button variant="outline" className="bg-transparent border-white/40 text-white px-10 py-7 h-auto text-xl font-bold rounded-2xl hover:bg-white/10 transition-colors">Browse Jobs</Button>
                  </Link>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
}
