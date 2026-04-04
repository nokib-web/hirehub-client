'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Briefcase, Linkedin, 
  Facebook, Mail, 
  Phone, MapPin, ChevronRight,
  Github,
  Signature
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    jobSeekers: [
      { name: 'Browse Jobs', href: '/jobs' },
      { name: 'Companies', href: '/companies' },
      { name: 'Salary Guide', href: '/salary-guide' },
    ],
    employers: [
      { name: 'Post a Job', href: '/dashboard/post-job' },
      { name: 'Search Candidates', href: '/candidates' },
      { name: 'Pricing Plans', href: '/pricing' },
      { name: 'Recruitment Solutions', href: '/solutions' },
      { name: 'Success Stories', href: '/success-stories' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
    ]

  };

  const socialIcons = [
    { icon: <Linkedin className="w-5 h-5 text-gray-500 hover:text-primary transition-colors" />, label: 'LinkedIn', href: 'https://www.linkedin.com/in/nazmulhasan-nokib/' },
    { icon: <Signature className="w-5 h-5 text-gray-500 hover:text-primary transition-colors" />, label: 'Portfolio', href: 'https://nokib.vercel.app/' },
    { icon: <Facebook className="w-5 h-5 text-gray-500 hover:text-primary transition-colors" />, label: 'Facebook', href: 'https://www.facebook.com/NokibHasan.Nazmul' },
    { icon: <Github className="w-5 h-5 text-gray-500 hover:text-primary transition-colors" />, label: 'Github', href: 'https://github.com/nokib-web' },
  ];

  return (
    <footer className="bg-background pt-16 pb-8 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 px-4 py-8">
          {/* Brand & Description */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-1.5 bg-primary rounded-lg">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black text-foreground">HireHub</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-xs font-medium">
              Connecting talent with opportunity across the globe. We help you find your dream job or the perfect candidate to grow your business.
            </p>
            <div className="flex items-center space-x-4">
              {socialIcons.map((social) => (
                <a 
                  key={social.label} 
                  href={social.href} 
                  aria-label={social.label}
                  className="p-2.5 bg-muted rounded-full hover:bg-primary/10 transition-all hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-lg font-black text-foreground mb-6 uppercase tracking-wider text-sm">For Job Seekers</h3>
            <ul className="space-y-4">
              {footerLinks.jobSeekers.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="group flex items-center text-muted-foreground hover:text-primary transition-colors font-semibold"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-black text-foreground mb-6 uppercase tracking-wider text-sm">For Employers</h3>
            <ul className="space-y-4">
              {footerLinks.employers.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="group flex items-center text-muted-foreground hover:text-primary transition-colors font-semibold"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-black text-foreground mb-6 uppercase tracking-wider text-sm">Company</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="group flex items-center text-muted-foreground hover:text-primary transition-colors font-semibold"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact info bar - Extra touch */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-y border-border mb-12 px-6 bg-muted/20 rounded-3xl">
          <div className="flex items-center space-x-3 text-muted-foreground">
            <div className="p-2 bg-background rounded-xl border border-border shadow-sm"><Mail className="w-5 h-5 text-primary" /></div>
            <div>
              <p className="text-xs font-black uppercase text-gray-500">Email Us</p>
              <p className="text-sm font-bold text-foreground">support@hirehub.com</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-muted-foreground">
            <div className="p-2 bg-background rounded-xl border border-border shadow-sm"><Phone className="w-5 h-5 text-primary" /></div>
            <div>
              <p className="text-xs font-black uppercase text-gray-500">Call Us</p>
              <p className="text-sm font-bold text-foreground">+880 1711 111111</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-muted-foreground">
            <div className="p-2 bg-background rounded-xl border border-border shadow-sm"><MapPin className="w-5 h-5 text-primary" /></div>
            <div>
              <p className="text-xs font-black uppercase text-gray-500">Visit Us</p>
              <p className="text-sm font-bold text-foreground">Mohammadpur, Dhaka, Bangladesh</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-muted-foreground text-sm font-bold">
            © {currentYear} <span className="text-primary">HireHub</span>. All rights reserved.
          </p>
          <div className="flex items-center space-x-8 text-sm font-bold">
            <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
