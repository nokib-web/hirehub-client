import React from 'react';
import { Globe, Settings, Lock, CheckCircle, Info, Cookie, BarChart } from 'lucide-react';

export const metadata = {
  title: 'Cookie Policy | HireHub',
  description: 'Understand how we use cookies and tracking technologies to optimize your experience.',
};

export default function CookiePolicy() {
  const lastUpdated = 'March 29, 2026';

  const sections = [
    {
      title: 'What Are Cookies?',
      icon: <Info className="w-6 h-6 text-primary" />,
      content: 'Cookies are small text files placed on your device to collect standard internet log information and visitor behavior information. When you visit our website, we may collect information from you automatically through cookies or similar technology. For further information, visit allaboutcookies.org.'
    },
    {
      title: 'Essential Cookies',
      icon: <Lock className="w-6 h-6 text-primary" />,
      content: 'These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the services, you cannot refuse them without impacting how our website functions.'
    },
    {
      title: 'Analytics Cookies',
      icon: <BarChart className="w-6 h-6 text-primary" />,
      content: 'We use analytics cookies to understand how our visitors use the platform. This helps us improve the platform content and the overall user experience. All analytics data is anonymized and used for statistical purposes only.'
    },
    {
      title: 'How to Manage Cookies',
      icon: <Settings className="w-6 h-6 text-primary" />,
      content: 'You can set your browser to not accept cookies, and the website above tells you how to remove cookies from your browser. However, in a few cases, some of our website features may not function as a result.'
    }
  ];

  return (
    <div className="bg-background min-h-screen py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-block p-4 bg-primary/10 rounded-full mb-6">
            <Cookie className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-foreground mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground font-medium">Last updated: {lastUpdated}</p>
        </div>

        <div className="prose prose-blue dark:prose-invert max-w-none mb-16 text-muted-foreground leading-relaxed text-lg">
          <p>
            At HireHub, we use cookies and similar technologies to ensure that we give you the best experience on our website. This Cookie Policy explains how and why we do this.
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

        <div className="mt-20 p-8 bg-muted rounded-3xl border border-border text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Acceptance of Cookies</h2>
            <p className="text-muted-foreground mb-8 text-lg">By continuing to use our platform, you consent to our use of cookies according to this policy.</p>
            <div className="flex justify-center space-x-4">
              <div className="flex items-center space-x-2 text-primary font-bold">
                <CheckCircle className="w-5 h-5" />
                <span>Cookies Enabled</span>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
