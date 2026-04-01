import React from 'react';
import { DollarSign, TrendingUp, Briefcase, MapPin, Award, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export const metadata = {
  title: '2024 Salary Guide | HireHub',
  description: 'Explore the latest salary data for top tech roles in the industry for 2024.',
};

export default function SalaryGuide() {
  const salaryData = [
    { role: 'Frontend Developer', entry: '$55k-$75k', mid: '$85k-$110k', senior: '$130k-$160k' },
    { role: 'Backend Developer', entry: '$60k-$80k', mid: '$90k-$120k', senior: '$140k-$170k' },
    { role: 'UI/UX Designer', entry: '$50k-$70k', mid: '$75k-$100k', senior: '$110k-$140k' },
    { role: 'Data Scientist', entry: '$70k-$90k', mid: '$100k-$130k', senior: '$150k-$200k' },
    { role: 'Product Manager', entry: '$75k-$95k', mid: '$110k-$140k', senior: '$160k-$210k' },
    { role: 'DevOps Engineer', entry: '$80k-$100k', mid: '$110k-$140k', senior: '$150k-$190k' },
    { role: 'Mobile Developer', entry: '$65k-$85k', mid: '$95k-$125k', senior: '$140k-$175k' },
    { role: 'Data Analyst', entry: '$55k-$75k', mid: '$80k-$105k', senior: '$120k-$150k' },
  ];

  const factors = [
    { title: 'Location', icon: <MapPin className="w-5 h-5 text-primary" />, content: 'Salaries can vary significantly by city and region due to cost of living and local demand.' },
    { title: 'Experience', icon: <Award className="w-5 h-5 text-primary" />, content: 'The number of years in the field and your track record of success directly impact your earning potential.' },
    { title: 'Skills', icon: <TrendingUp className="w-5 h-5 text-primary" />, content: 'Specializing in high-demand technologies or niche expertise can command substantial salary premiums.' },
  ];

  return (
    <div className="bg-background min-h-screen py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Hero */}
        <div className="text-center mb-20">
          <div className="inline-block p-4 bg-primary/10 rounded-full mb-6 text-primary">
            <DollarSign className="w-12 h-12" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-foreground mb-6">2024 Salary Guide</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stay informed with the most comprehensive salary benchmarks across major tech roles for 2024. Plan your next career move with confidence.
          </p>
        </div>

        {/* Salary Table */}
        <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden mb-20">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-primary/5 text-foreground uppercase tracking-wider text-xs font-black border-b border-border">
                  <th className="px-8 py-5">Role</th>
                  <th className="px-8 py-5">Entry Level</th>
                  <th className="px-8 py-5">Mid Level</th>
                  <th className="px-8 py-5">Senior Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {salaryData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-muted/30 transition-colors">
                    <td className="px-8 py-5 font-bold text-foreground">{item.role}</td>
                    <td className="px-8 py-5 font-semibold text-muted-foreground">{item.entry}</td>
                    <td className="px-8 py-5 font-semibold text-primary">{item.mid}</td>
                    <td className="px-8 py-5 font-bold text-primary">{item.senior}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Factors Affecting Salary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {factors.map((factor, idx) => (
            <div key={idx} className="p-8 bg-card border border-border rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  {factor.icon}
                </div>
                <h2 className="text-xl font-bold text-foreground">{factor.title}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed leading-relaxed">{factor.content}</p>
            </div>
          ))}
        </div>

        {/* Browse Jobs by Salary CTA */}
        <div className="bg-primary text-white rounded-[2rem] p-10 lg:p-16 text-center shadow-2xl shadow-primary/30 relative overflow-hidden">
             {/* Decorative element */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-black mb-6">Ready to reach your target salary?</h2>
                <p className="text-lg opacity-90 mb-10 font-medium">Browse high-paying jobs in your field and start your next professional chapter today.</p>
                <Link href="/jobs">
                  <Button variant="outline" className="bg-white text-primary border-transparent hover:bg-white/90 text-lg py-7 px-10 rounded-2xl h-auto font-black shadow-xl">
                    Browse Jobs by Salary <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
             </div>
        </div>
      </div>
    </div>
  );
}
