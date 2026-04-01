import React from 'react';
import { Shield, Lock, Eye, Bell, UserCheck, Globe } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | HireHub',
  description: 'Understand how HireHub collects, uses, and protects your personal data.',
};

export default function PrivacyPolicy() {
  const lastUpdated = 'March 29, 2026';

  const sections = [
    {
      title: 'Information We Collect',
      icon: <UserCheck className="w-6 h-6 text-primary" />,
      content: 'We collect information you provide directly to us when you create an account, upload a resume, or apply for a job. This includes your name, email address, phone number, employment history, and educational background. We also automatically collect certain information when you use our platform, such as your IP address and device information.'
    },
    {
      title: 'How We Use Your Information',
      icon: <Eye className="w-6 h-6 text-primary" />,
      content: 'Your information is used to provide and improve our services, including matching candidates with job openings, facilitating communication between employers and seekers, and personalizing your user experience. We also use data for analytical purposes to enhance platform performance and security.'
    },
    {
      title: 'Data Security',
      icon: <Lock className="w-6 h-6 text-primary" />,
      content: 'We implement robust technical and organizational measures to protect your personal data against unauthorized access, loss, or alteration. This includes encryption of sensitive data, regular security audits, and strict access controls for our employees and service providers.'
    },
    {
      title: 'Cookies Policy',
      icon: <Globe className="w-6 h-6 text-primary" />,
      content: 'We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.'
    },
    {
      title: 'Your Rights',
      icon: <Shield className="w-6 h-6 text-primary" />,
      content: 'Depending on your location, you may have certain rights regarding your personal data, including the right to access, correct, or delete your information, and the right to object to or restrict certain processing activities. You can manage your privacy settings directly through your dashboard.'
    },
    {
      title: 'Contact Information',
      icon: <Bell className="w-6 h-6 text-primary" />,
      content: 'If you have any questions or concerns about this Privacy Policy or our data practices, please contact our Data Protection Officer at privacy@hirehub.com or through our contact page.'
    }
  ];

  return (
    <div className="bg-background min-h-screen py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-black text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground font-medium">Last updated: {lastUpdated}</p>
        </div>

        <div className="prose prose-blue dark:prose-invert max-w-none mb-16 text-muted-foreground leading-relaxed">
          <p className="text-lg">
            At HireHub, we take your privacy seriously. This Policy explains how we handle your personal information across our platform and services. By using HireHub, you agree to the practices described in this document.
          </p>
        </div>

        <div className="grid gap-12">
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

        <div className="mt-20 p-8 bg-primary/5 rounded-3xl border border-primary/10 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Questions about your data?</h2>
          <p className="text-muted-foreground mb-8 text-lg">Our privacy team is here to help you understand your rights and our obligations.</p>
          <a href="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
