'use client';

import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/dashboard/Sidebar';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 border-r border-border min-h-screen">
             <Sidebar />
          </aside>
          
          {/* Main Content */}
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
