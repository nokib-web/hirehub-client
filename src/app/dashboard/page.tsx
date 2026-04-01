'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { Loader2 } from 'lucide-react';

export default function DashboardRedirect() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard/overview');
    }
  }, [user, isLoading, router]);

  return (
    <ProtectedRoute>
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    </ProtectedRoute>
  );
}
