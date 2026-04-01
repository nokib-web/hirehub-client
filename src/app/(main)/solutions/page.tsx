import React from 'react';
import { Briefcase, CheckCircle2, Star, Zap, Users, BarChart3, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export const metadata = {
  title: 'Recruitment Solutions | HireHub',
  description: 'Discover how HireHub can help your business find the best talent faster.',
};

export default function RecruitmentSolutions() {
  const solutions = [
    {
      title: 'Basic',
      icon: <Zap className="w-8 h-8 text-primary" />,
      description: 'The foundation for growing teams with targeted visibility.',
      features: ['Post up to 5 jobs', '30-day listing', 'Standard search visibility', 'Basic candidate tracking'],
      link: '/dashboard/post-job'
    },
    {
      title: 'Professional',
      icon: <Star className="w-8 h-8 text-primary" />,
      description: 'For companies that need advanced tools and higher impact.',
      features: ['Post up to 20 jobs', 'Featured listing', 'Advanced analytics', 'Candidate matching AI', '30-day listing extension'],
      link: '/dashboard/post-job'
    },
    {
      title: 'Enterprise',
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      description: 'Scaling at pace? Get custom solutions and dedicated support.',
      features: ['Unlimited jobs', 'Dedicated support', 'API access', 'Employer branding support', 'Priority support & onboarding'],
      link: '/dashboard/post-job'
    }
  ];

  return (
    <div className="bg-background min-h-screen py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black text-foreground mb-8 leading-tight">Hire Smarter with HireHub</h1>
          <p className="text-xl text-muted-foreground leading-relaxed font-medium">
            Tailored recruitment solutions for organizations of all sizes. From startups to enterprises, we help you find the talent that makes a difference.
          </p>
        </div>

        {/* Solution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-24">
          {solutions.map((plan, idx) => (
            <div key={idx} className="bg-card border border-border rounded-[2.5rem] p-10 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 group flex flex-col justify-between">
              <div>
                <div className="p-4 bg-primary/10 rounded-3xl inline-block mb-8 group-hover:rotate-6 transition-transform">
                  {plan.icon}
                </div>
                <h2 className="text-3xl font-black text-foreground mb-4">{plan.title}</h2>
                <p className="text-muted-foreground mb-8 font-medium">{plan.description}</p>
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center space-x-3 text-foreground font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href={plan.link}>
                <Button variant="primary" className="w-full text-lg font-black py-6 rounded-2xl shadow-lg shadow-primary/20">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-24 px-4 lg:px-0">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-foreground mb-4">Deep feature comparison</h2>
            <p className="text-muted-foreground font-medium">Detailed breakdown of what each solution offers your team.</p>
          </div>
          <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-primary/5 border-b border-border text-xs font-black uppercase tracking-widest text-muted-foreground">
                   <th className="px-8 py-5">Feature</th>
                   <th className="px-8 py-5">Basic</th>
                   <th className="px-8 py-5">Professional</th>
                   <th className="px-8 py-5">Enterprise</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border">
                 {[
                   { name: 'Priority Support', b: 'No', p: 'Business Hours', e: '24/7 Dedicated' },
                   { name: 'AI Matching', b: 'No', p: 'Yes', e: 'Yes (Custom trained)' },
                   { name: 'Candidate Search', b: 'Limited', p: 'Unlimited', e: 'Advanced + AI' },
                   { name: 'Analytics', b: 'Basic', p: 'Advanced', e: 'Custom Reports' },
                   { name: 'Branding Tool', b: 'No', p: 'Yes', e: 'Yes' }
                 ].map((row, rIdx) => (
                   <tr key={rIdx} className="hover:bg-muted/30 transition-colors">
                     <td className="px-8 py-5 font-bold text-foreground">{row.name}</td>
                     <td className="px-8 py-5 text-muted-foreground font-medium">{row.b}</td>
                     <td className="px-8 py-5 text-primary font-bold">{row.p}</td>
                     <td className="px-8 py-5 text-primary font-black">{row.e}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>

        {/* Final CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-muted/30 p-10 lg:p-20 border border-border rounded-[3rem] items-center">
             <div>
                <h3 className="text-4xl font-black text-foreground mb-6">Need something more custom?</h3>
                <p className="text-lg text-muted-foreground font-medium mb-8">Talk to our solutions experts to design a recruitment package that perfectly aligns with your specific hiring needs.</p>
                <Link href="/contact">
                  <Button variant="outline" className="px-10 py-6 h-auto text-lg font-bold rounded-2xl border-2">Contact Sales</Button>
                </Link>
             </div>
             <div className="grid grid-cols-2 gap-4">
                 {[
                   { icon: <Users className="w-6 h-6 text-primary" />, title: '5,000+', desc: 'Employers' },
                   { icon: <BarChart3 className="w-6 h-6 text-primary" />, title: '98%', desc: 'Retention' },
                   { icon: <Globe className="w-6 h-6 text-primary" />, title: '120+', desc: 'Countries' },
                   { icon: <Zap className="w-6 h-6 text-primary" />, title: '48hr', desc: 'Avg. Response' }
                 ].map((stat, sIdx) => (
                   <div key={sIdx} className="bg-card border border-border rounded-3xl p-6 text-center shadow-sm">
                      <div className="mb-2 flex justify-center">{stat.icon}</div>
                      <div className="text-2xl font-black text-foreground">{stat.title}</div>
                      <div className="text-xs font-bold uppercase text-muted-foreground">{stat.desc}</div>
                   </div>
                 ))}
             </div>
        </div>
      </div>
    </div>
  );
}
