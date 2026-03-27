'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Bookmark, 
  User, 
  Settings,
  PlusSquare,
  BarChart3,
  Users
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const roleConfigs = {
    jobseeker: [
      { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { name: 'My Applications', href: '/dashboard/my-applications', icon: FileText },
      { name: 'Saved Jobs', href: '/dashboard/saved-jobs', icon: Bookmark },
      { name: 'Profile', href: '/dashboard/profile', icon: User },
    ],
    employer: [
      { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Post a Job', href: '/dashboard/post-job', icon: PlusSquare },
      { name: 'My Jobs', href: '/dashboard/my-jobs', icon: Briefcase },
      { name: 'Applications', href: '/dashboard/applications', icon: Users },
    ],
    admin: [
      { name: 'Overview', href: '/dashboard/admin/overview', icon: LayoutDashboard },
      { name: 'Manage Users', href: '/dashboard/admin/manage-users', icon: Users },
      { name: 'Manage Jobs', href: '/dashboard/admin/manage-jobs', icon: Briefcase },
      { name: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
    ],
  };

  const menuItems = user ? roleConfigs[user.role as keyof typeof roleConfigs] : [];

  return (
    <div className="bg-background flex flex-col pt-8 pb-4 h-full">
      <div className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-md font-medium transition-colors',
                isActive 
                  ? 'bg-primary text-white' 
                  : 'text-foreground/70 hover:bg-card hover:text-primary'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
      
      <div className="px-4 border-t border-border pt-4">
        <Link
          href="/settings"
          className="flex items-center space-x-3 px-3 py-2 rounded-md font-medium text-foreground/70 hover:bg-card hover:text-primary transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
