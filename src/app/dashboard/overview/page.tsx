'use client';

import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import AdminOverview from '@/components/dashboard/overviews/AdminOverview';
import EmployerOverview from '@/components/dashboard/overviews/EmployerOverview';
import JobseekerOverview from '@/components/dashboard/overviews/JobseekerOverview';
import { Loader2 } from 'lucide-react';

export default function OverviewPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const renderOverview = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminOverview />;
      case 'employer':
        return <EmployerOverview />;
      case 'jobseeker':
        return <JobseekerOverview />;
      default:
        return <div>User role not recognized.</div>;
    }
  };

  return (
    <ProtectedRoute>
      {renderOverview()}
    </ProtectedRoute>
  );
}
