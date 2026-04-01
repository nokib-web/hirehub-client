import React from 'react';
import { Gavel, CheckCircle, UserPlus, Briefcase, AlertTriangle, ShieldCheck, Scale } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | HireHub',
  description: 'Review the conditions for using our platform and our service obligations to you.',
};

export default function TermsOfService() {
  const lastUpdated = 'March 29, 2026';

  const sections = [
    {
      title: 'Acceptance of Terms',
      icon: <CheckCircle className="w-6 h-6 text-primary" />,
      content: 'By accessing or using the HireHub website and service, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.'
    },
    {
      title: 'Use of Service',
      icon: <Gavel className="w-6 h-6 text-primary" />,
      content: 'HireHub grants you a limited, non-exclusive, non-transferable license to access and use the platform for professional purposes. This includes browsing jobs, submitting applications, and for employers, posting job openings and searching for candidates.'
    },
    {
      title: 'User Accounts',
      icon: <UserPlus className="w-6 h-6 text-primary" />,
      content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when creating your account and to update it as necessary.'
    },
    {
      title: 'Job Postings',
      icon: <Briefcase className="w-6 h-6 text-primary" />,
      content: 'Employers must ensure all job postings are accurate, professional, and comply with all applicable employment laws. HireHub reserves the right to remove any posting that is deemed inappropriate, misleading, or in violation of these terms.'
    },
    {
      title: 'Prohibited Activities',
      icon: <AlertTriangle className="w-6 h-6 text-primary" />,
      content: 'You agree not to use the platform for any illegal purpose, or to upload any content that is defamatory, obscene, or infringing on intellectual property. Harassment of other users and automated scraping of platform data are strictly prohibited.'
    },
    {
      title: 'Limitation of Liability',
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      content: 'HireHub is provided on an "as is" and "as available" basis. To the maximum extent permitted by law, HireHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.'
    },
    {
      title: 'Governing Law',
      icon: <Scale className="w-6 h-6 text-primary" />,
      content: 'These terms and conditions are governed by and construed in accordance with the laws of the State of New York, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.'
    }
  ];

  return (
    <div className="bg-background min-h-screen py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-black text-foreground mb-4">Terms of Service</h1>
          <p className="text-muted-foreground font-medium">Last updated: {lastUpdated}</p>
        </div>

        <div className="prose prose-blue dark:prose-invert max-w-none mb-16 text-muted-foreground leading-relaxed text-lg">
          <p>
            Welcome to HireHub. These terms outline the rules and regulations for the use of our platform. By using our services, you accept these terms in full.
          </p>
        </div>

        <div className="space-y-12">
          {sections.map((section, index) => (
            <div key={index} className="bg-card border border-border rounded-3xl p-8 lg:p-10 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 border border-border rounded-3xl text-sm text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} HireHub. All rights reserved. Your use of this service constitutes acceptance of our conditions.</p>
        </div>
      </div>
    </div>
  );
}
