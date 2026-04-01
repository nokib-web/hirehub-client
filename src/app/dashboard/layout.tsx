'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { 
  Menu, X, Briefcase, Bell, Search, 
  User, Settings, LogOut, LayoutDashboard, 
  FileText, Sparkles, PlusCircle, Users, 
  BarChart, Bookmark, ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/shared/ThemeToggle';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on path change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = {
    jobseeker: [
      { name: 'Overview', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
      { name: 'My Profile', href: '/dashboard/profile', icon: <User className="w-5 h-5" /> },
      { name: 'My Applications', href: '/dashboard/my-applications', icon: <FileText className="w-5 h-5" /> },
      { name: 'Saved Jobs', href: '/dashboard/saved-jobs', icon: <Bookmark className="w-5 h-5" /> },
      { name: 'AI Career Path', href: '/dashboard/ai-assistant', icon: <Sparkles className="w-5 h-5" /> },
    ],
    employer: [
      { name: 'Overview', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
      { name: 'Post a Job', href: '/dashboard/post-job', icon: <PlusCircle className="w-5 h-5" /> },
      { name: 'My Jobs', href: '/dashboard/my-jobs', icon: <Briefcase className="w-5 h-5" /> },
      { name: 'Applications', href: '/dashboard/applications', icon: <Users className="w-5 h-5" /> },
    ],
    admin: [
      { name: 'Console', href: '/dashboard/overview', icon: <LayoutDashboard className="w-5 h-5" /> },
      { name: 'Citizens', href: '/dashboard/manage-users', icon: <Users className="w-5 h-5" /> },
      { name: 'Listings', href: '/dashboard/manage-jobs', icon: <Briefcase className="w-5 h-5" /> },
      { name: 'Submissions', href: '/dashboard/manage-applications', icon: <FileText className="w-5 h-5" /> },
      { name: 'Analytics', href: '/dashboard/analytics', icon: <BarChart className="w-5 h-5" /> },
    ],
  };

  const getRoleLinks = () => {
    const role = user?.role || 'jobseeker';
    return navLinks[role as keyof typeof navLinks] || navLinks.jobseeker;
  };

  const currentLinks = getRoleLinks();
  const pageTitle = currentLinks.find(link => link.href === pathname)?.name || 'Dashboard';

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* desktop sidebar */}
      <aside 
        className={cn(
          "hidden lg:flex flex-col fixed inset-y-0 left-0 bg-card border-r border-border transition-all duration-300 z-50",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-16 flex items-center px-6 border-b border-border transition-all">
          <Link href="/" className="flex items-center space-x-2">
            <div className="p-1.5 bg-primary rounded-lg shrink-0">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            {isSidebarOpen && (
              <span className="text-xl font-black text-foreground tracking-tight transition-opacity duration-300 animate-in fade-in">
                HireHub
              </span>
            )}
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {currentLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all font-bold text-sm group",
                  active 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                <div className={cn("shrink-0 transition-transform", active ? "scale-100" : "group-hover:scale-110")}>
                  {link.icon}
                </div>
                {isSidebarOpen && <span className="animate-in slide-in-from-left-4 duration-200">{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border mt-auto">
          <div className={cn(
            "p-3 rounded-2xl bg-muted/50 border border-border flex items-center transition-all",
            isSidebarOpen ? "space-x-3" : "justify-center px-0"
          )}>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shrink-0">
              {user?.name?.[0].toUpperCase() || 'U'}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-sm font-black truncate">{user?.name}</p>
                <p className="text-[10px] uppercase font-black text-primary px-1.5 py-0.5 bg-primary/10 rounded-md inline-block mt-0.5">
                  {user?.role}
                </p>
              </div>
            )}
          </div>
          <button 
            onClick={logout}
            className={cn(
              "mt-4 flex items-center transition-all w-full text-sm font-black p-2.5 rounded-xl text-rose-500 hover:bg-rose-500/10",
              isSidebarOpen ? "space-x-3" : "justify-center"
            )}
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>

        {/* collapse toggle toggle button desktop only */}
        <button 
           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
           className="absolute -right-3 top-20 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-2 border-background hover:scale-110 active:scale-95 transition-all"
        >
          {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </aside>

      {/* Mobile Sidebar/Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="lg:hidden fixed inset-y-0 left-0 w-72 bg-card z-[110] p-6 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-8 pb-4 border-b">
                 <Link href="/" className="flex items-center space-x-2">
                    <div className="p-1.5 bg-primary rounded-lg shrink-0">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-black text-foreground">HireHub</span>
                 </Link>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-muted rounded-full">
                   <X className="w-5 h-5" />
                 </button>
              </div>
              
              <nav className="flex-1 space-y-2">
                 {currentLinks.map((link) => {
                   const active = pathname === link.href;
                   return (
                     <Link
                       key={link.name}
                       href={link.href}
                       className={cn(
                         "flex items-center space-x-4 px-4 py-3.5 rounded-2xl font-bold transition-all",
                         active ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                       )}
                     >
                       {link.icon} <span>{link.name}</span>
                     </Link>
                   );
                 })}
              </nav>

              <div className="mt-auto p-4 bg-muted/30 rounded-3xl border border-border">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-lg font-bold ring-2 ring-primary/20">
                    {user?.name?.[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <button onClick={logout} className="w-full flex items-center justify-center space-x-2 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold transition-all">
                  <LogOut className="w-5 h-5" /> <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        )}
      >
        {/* Dashboard Top Navbar */}
        <header className="h-16 sticky top-0 bg-background/80 backdrop-blur-md border-b border-border z-40 px-4 md:px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 bg-muted rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg md:text-xl font-black text-foreground capitalize transition-all">
               {pageTitle}
            </h1>
          </div>

          <div className="flex items-center space-x-2 md:space-x-6">
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-muted/50 border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background focus:border-primary/30 w-64 transition-all"
              />
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <ThemeToggle />
              <button className="relative p-2 text-foreground/70 hover:text-primary bg-muted/50 rounded-xl transition-all hover:scale-105 active:scale-95 group">
                <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-background" />
              </button>
              
              <div className="h-8 w-px bg-border hidden sm:block mx-1" />

              <div className="relative group">
                <button className="flex items-center space-x-2 p-1 pl-1 md:pl-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-all active:scale-95">
                  <span className="text-sm font-bold truncate max-w-[100px] hidden sm:block">{user?.name}</span>
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white ring-2 ring-background text-xs font-bold">
                    {user?.name?.[0].toUpperCase()}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="flex-1 p-4 md:p-8">
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
           >
             {children}
           </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
