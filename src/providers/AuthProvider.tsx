'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import api from '@/lib/axios';
import { IUser } from '@/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, redirectTo?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  const logout = useCallback(async () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    
    if (status === 'authenticated') {
      await signOut({ redirect: false });
    }
    
    router.push('/login');
  }, [router, status]);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await api.get('/auth/profile');
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [fetchProfile]);

  const login = useCallback((newToken: string, redirectTo?: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    fetchProfile();
    router.push(redirectTo || '/dashboard');
  }, [fetchProfile, router]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user && !token && !isLoading) {
      const syncGoogleAuth = async () => {
        try {
          if (!session?.user) return;
          const response = await api.post('/auth/google', {
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
          });
          if (response.data?.success && response.data.data?.accessToken) {
            login(response.data.data.accessToken);
          }
        } catch (error) {
          console.error('Failed to sync Google Auth:', error);
        }
      };
      
      syncGoogleAuth();
    }
  }, [status, session, token, isLoading, login]);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
