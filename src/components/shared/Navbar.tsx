'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { 
  Menu, X, Briefcase, Bell, ChevronDown, 
  User, Settings, LogOut, LayoutDashboard, 
  FileText, Building2, 
  Laptop, BarChart, PenTool, HeartPulse, 
  Hammer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import ThemeToggle from './ThemeToggle';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Handle scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Find Jobs', href: '/jobs' },
    { name: 'Companies', href: '/companies' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const categories = [
    { name: 'Technology', icon: <Laptop className="w-4 h-4" /> },
    { name: 'Marketing', icon: <BarChart className="w-4 h-4" /> },
    { name: 'Design', icon: <PenTool className="w-4 h-4" /> },
    { name: 'Finance', icon: <Briefcase className="w-4 h-4" /> },
    { name: 'Healthcare', icon: <HeartPulse className="w-4 h-4" /> },
    { name: 'Engineering', icon: <Hammer className="w-4 h-4" /> },
  ];

  const jobTypes = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'];

  const isActive = (path: string) => pathname === path;

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b",
        isScrolled 
          ? "bg-background/80 backdrop-blur-md border-border py-2 shadow-sm" 
          : "bg-background border-transparent py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Brand */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-primary rounded-xl group-hover:rotate-6 transition-transform">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              HireHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Mega Menu Toggle */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('browse')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 px-4 py-2 hover:text-primary font-medium transition-colors">
                <span>Browse Jobs</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform", activeDropdown === 'browse' && "rotate-180")} />
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'browse' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full -left-20 w-[600px] bg-card border border-border rounded-2xl shadow-2xl p-6 overflow-hidden z-[200]"
                  >
                    <div className="grid grid-cols-3 gap-8">
                      {/* Categories */}
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Categories</h3>
                        <div className="space-y-3">
                          {categories.map((cat) => (
                            <Link 
                              key={cat.name} 
                              href={`/jobs?category=${cat.name}`}
                              className="flex items-center space-x-3 group/item hover:text-primary transition-colors"
                            >
                              <div className="p-1.5 bg-muted rounded-md group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors">
                                {cat.icon}
                              </div>
                              <span className="text-sm font-medium">{cat.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Job Types */}
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Job Types</h3>
                        <div className="space-y-1">
                          {jobTypes.map((type) => (
                            <Link 
                              key={type} 
                              href={`/jobs?type=${type}`}
                              className="block px-3 py-2 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                              {type}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Featured Section */}
                      <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                        <h3 className="text-sm font-bold text-primary mb-3">🔥 Top Companies</h3>
                        <div className="space-y-3">
                          {['TechFlow Inc', 'GrowthHQ', 'Creative Studio'].map((company) => (
                            <div key={company} className="flex items-center space-x-2 text-sm font-medium">
                              <Building2 className="w-4 h-4 text-primary/60" />
                              <span>{company}</span>
                            </div>
                          ))}
                        </div>
                        <Link href="/companies" className="mt-4 inline-block text-xs font-bold text-primary hover:underline">
                          View all companies →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "px-4 py-2 font-medium transition-colors hover:text-primary relative",
                  isActive(link.href) ? "text-primary" : "text-foreground/70"
                )}
              >
                {link.name}
                {isActive(link.href) && (
                  <motion.div 
                    layoutId="activeLink"
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            ))}
            
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className={cn(
                  "px-4 py-2 font-medium transition-colors hover:text-primary",
                  isActive('/dashboard') ? "text-primary font-bold" : "text-foreground/70"
                )}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />
            
            {!isAuthenticated ? (
              <>
                <Link href="/login">
                  <Button variant="outline" className="rounded-xl font-bold">Login</Button>
                </Link>
                <Link href="/jobs/new">
                  <Button variant="primary" className="rounded-xl font-bold shadow-lg shadow-primary/20">Post a Job</Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button className="relative p-2 text-foreground/70 hover:text-primary transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-background" />
                </button>
                
                {/* Profile Avatar Dropdown */}
                <div 
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown('profile')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center space-x-2 p-1 pl-4 rounded-full border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                    <span className="text-sm font-bold truncate max-w-[100px]">{user?.name}</span>
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white ring-2 ring-background">
                      {user?.avatar ? (
                         <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt="" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {activeDropdown === 'profile' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-2xl p-2 z-[110]"
                      >
                        <div className="px-4 py-3 border-b border-border/50">
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest uppercase mb-1">Signed in as</p>
                          <p className="text-sm font-bold truncate">{user?.email}</p>
                          <p className="text-[10px] inline-block px-1.5 py-0.5 bg-primary/10 text-primary rounded font-black uppercase mt-2">{user?.role}</p>
                        </div>
                        
                        <div className="p-1 space-y-1 mt-2">
                          <Link href="/profile" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium hover:bg-primary/10 hover:text-primary rounded-xl transition-colors">
                            <User className="w-4 h-4" /> <span>My Profile</span>
                          </Link>
                          <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium hover:bg-primary/10 hover:text-primary rounded-xl transition-colors">
                            <LayoutDashboard className="w-4 h-4" /> <span>Dashboard</span>
                          </Link>
                          
                          {user?.role === 'jobseeker' && (
                            <Link href="/dashboard/applications" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium hover:bg-primary/10 hover:text-primary rounded-xl transition-colors">
                              <FileText className="w-4 h-4" /> <span>My Applications</span>
                            </Link>
                          )}
                          {user?.role === 'employer' && (
                            <Link href="/dashboard/jobs" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium hover:bg-primary/10 hover:text-primary rounded-xl transition-colors">
                              <Briefcase className="w-4 h-4" /> <span>My Job Posts</span>
                            </Link>
                          )}
                          
                          <Link href="/settings" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium hover:bg-primary/10 hover:text-primary rounded-xl transition-colors">
                            <Settings className="w-4 h-4" /> <span>Settings</span>
                          </Link>
                        </div>
                        
                        <div className="p-1 mt-2 pt-2 border-t border-border/50">
                          <button 
                            onClick={logout}
                            className="flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                          >
                            <LogOut className="w-4 h-4" /> <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="lg:hidden flex items-center space-x-2">
             <ThemeToggle />
             <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground focus:outline-none"
             >
              {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-background border-t overflow-hidden"
          >
            <div className="px-4 py-8 space-y-4">
              <div className="grid grid-cols-2 gap-4 pb-6 border-b">
                 {!isAuthenticated ? (
                   <>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full font-bold py-3">Login</Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <Button variant="primary" className="w-full font-bold py-3 shadow-lg">Post a Job</Button>
                    </Link>
                   </>
                 ) : (
                   <div className="col-span-2 flex items-center space-x-4 p-4 bg-muted/30 rounded-2xl">
                     <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-lg font-bold">
                       {user?.name?.[0].toUpperCase()}
                     </div>
                     <div>
                       <p className="font-bold text-lg">{user?.name}</p>
                       <p className="text-sm text-muted-foreground">{user?.email}</p>
                     </div>
                   </div>
                 )}
              </div>

              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block p-4 text-lg font-bold rounded-2xl transition-all",
                      isActive(link.href) ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                
                {isAuthenticated && (
                   <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block p-4 text-lg font-bold rounded-2xl transition-all mt-6",
                      isActive('/dashboard') ? "bg-primary/10 text-primary" : "hover:bg-muted bg-primary text-white"
                    )}
                  >
                    Go to Dashboard
                  </Link>
                )}
              </div>

              {isAuthenticated && (
                <div className="pt-6 border-t">
                  <button 
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="flex items-center space-x-3 w-full p-4 text-lg font-bold text-rose-500 rounded-2xl hover:bg-rose-500/5 transition-colors"
                  >
                    <LogOut className="w-6 h-6" /> <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
