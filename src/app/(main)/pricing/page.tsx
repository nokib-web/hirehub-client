'use client';

import React, { useState } from 'react';
import { 
  Check, 
  HelpCircle, 
  ChevronDown, 
  ToggleLeft, 
  ToggleRight, 
  Zap, 
  Star, 
  Briefcase, 
  Building2, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Free (Job Seekers)',
      price: '$0',
      description: 'Find your next career move without any costs.',
      icon: <Briefcase className="w-8 h-8 text-primary" />,
      features: ['Browse all job listings', 'Apply to unlimited jobs', 'Save favorite jobs', 'Email job alerts', 'Basic resume tips', 'Search companies'],
      cta: 'Start Free',
      href: '/register',
      highlight: false
    },
    {
      name: 'Employer Basic',
      price: isAnnual ? '$39' : '$49',
      description: 'Ideal for small startups and niche hiring needs.',
      icon: <Building2 className="w-8 h-8 text-primary" />,
      features: ['5 job posts per month', '30-day listing duration', 'Basic candidate tracking', 'Standard search ranking', 'Company profile page', 'Email support'],
      cta: 'Choose Basic',
      href: '/register',
      highlight: true
    },
    {
      name: 'Employer Pro',
      price: isAnnual ? '$119' : '$149',
      description: 'Scale your team with advanced hiring capability.',
      icon: <ShieldCheck className="w-8 h-8 text-white" />,
      features: ['Unlimited job posts', 'Featured job listings', 'Advanced hiring analytics', 'AI Candidate matching', 'Priority 24/7 support', 'CSV data exports'],
      cta: 'Choose Pro',
      href: '/register',
      highlight: false,
      isDark: true
    }
  ];

  const faqs = [
    { q: 'How does the free tier work?', a: 'Job seekers can browse and apply to jobs for free. We do not charge candidates for searching or applying for roles.' },
    { q: 'Can I cancel my employer subscription anytime?', a: 'Yes, you can cancel or change your plan at any time through your dashboard settings. No long-term contracts required.' },
    { q: 'Is there a discount for annual billing?', a: 'Yes! Choosing annual billing saves you 20% on all employer plans compared to monthly billing.' },
    { q: 'Does "Pro" include AI tools?', a: 'Absolutely. Pro users get access to our advanced candidate matching AI, which recommends the best candidates based on their listed skills and experience.' }
  ];

  return (
    <div className="bg-background min-h-screen py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Toggle & Title */}
        <div className="text-center mb-24 max-w-2xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black text-foreground mb-10 tracking-tight">Simple Pricing</h1>
          <div className="flex items-center justify-center space-x-6">
            <span className={`text-lg font-bold transition-colors ${!isAnnual ? 'text-primary' : 'text-muted-foreground'}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative p-1 bg-muted rounded-full w-20 h-10 border border-border shadow-inner transition-colors focus:ring-2 focus:ring-primary/20 outline-none"
            >
               <div className={`absolute top-1 left-1 bg-primary rounded-full w-8 h-8 transition-transform duration-300 transform ${isAnnual ? 'translate-x-10' : ''}`} />
            </button>
            <div className="flex items-center space-x-2">
              <span className={`text-lg font-bold transition-colors ${isAnnual ? 'text-primary' : 'text-muted-foreground'}`}>Annual</span>
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase rounded tracking-widest">Save 20%</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 mb-24">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative bg-card border border-border rounded-[2.5rem] p-10 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-2 flex flex-col justify-between overflow-hidden ${plan.isDark ? 'bg-primary border-primary' : 'bg-card'}`}
            >
              {plan.highlight && <div className="absolute top-0 right-0 bg-primary/10 text-primary px-6 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest">Best Value</div>}
              {plan.isDark && <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />}
              
              <div className="relative z-10">
                <div className={`p-4 rounded-3xl inline-block mb-10 ${plan.isDark ? 'bg-white/20' : 'bg-primary/10'}`}>
                  {plan.icon}
                </div>
                <h3 className={`text-2xl font-black mb-2 ${plan.isDark ? 'text-white' : 'text-foreground'}`}>{plan.name}</h3>
                <p className={`text-sm mb-10 font-medium h-12 leading-relaxed ${plan.isDark ? 'text-white/80' : 'text-muted-foreground'}`}>{plan.description}</p>
                <div className="flex items-baseline space-x-2 mb-10">
                  <span className={`text-5xl lg:text-6xl font-black ${plan.isDark ? 'text-white' : 'text-foreground'}`}>{plan.price}</span>
                  <span className={`text-lg font-bold ${plan.isDark ? 'text-white/60' : 'text-muted-foreground'}`}>/month</span>
                </div>
                <ul className="space-y-4 mb-12">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center space-x-3">
                      <div className={`p-1 rounded-full ${plan.isDark ? 'bg-white' : 'bg-primary'}`}>
                        <Check className={`w-3 h-3 ${plan.isDark ? 'text-primary' : 'text-white'}`} strokeWidth={4} />
                      </div>
                      <span className={`text-sm font-bold ${plan.isDark ? 'text-white' : 'text-foreground'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href={plan.href} className="relative z-10">
                 <Button 
                    variant={plan.isDark ? 'outline' : 'primary'} 
                    className={`w-full py-7 h-auto rounded-2xl text-lg font-bold shadow-lg transition-transform hover:scale-[1.02] ${plan.isDark ? 'bg-white text-primary border-transparent' : 'shadow-primary/20'}`}
                 >
                   {plan.cta}
                 </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto px-4 lg:px-0">
          <div className="text-center mb-16">
            <div className="inline-block p-4 bg-muted rounded-full mb-6">
              <HelpCircle className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-4xl font-black text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground font-medium">Everything you need to know about our pricing and services.</p>
          </div>
          <div className="grid gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-card border border-border rounded-3xl p-8 hover:border-primary/40 transition-colors shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-4">{faq.q}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed leading-relaxed font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA Banner */}
        <div className="mt-24 bg-muted/40 p-10 lg:p-16 border border-border rounded-[3rem] flex flex-col md:flex-row items-center justify-between shadow-sm">
           <div className="mb-8 md:mb-0 max-w-xl text-center md:text-left">
              <h2 className="text-3xl font-black text-foreground mb-4">Need a custom plan?</h2>
              <p className="text-muted-foreground text-lg leading-relaxed font-medium">If your organization has unique requirements, reach out to our team for a personalized enterprise solution.</p>
           </div>
           <Link href="/contact">
              <Button variant="outline" className="px-10 py-6 h-auto text-lg font-black border-2 rounded-2xl shadow-sm transition-all hover:shadow-lg">Talk to Sales <ArrowRight className="ml-2 w-5 h-5" /></Button>
           </Link>
        </div>
      </div>
    </div>
  );
}
