'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Eye, EyeOff, Mail, Lock, CheckCircle2, 
  Info, Loader2, LogIn, Chrome 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/providers/AuthProvider';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema) as any,
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      login(result.data.accessToken);
      toast.success('Welcome back! 🎉');
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemo = (role: 'jobseeker' | 'employer' | 'admin') => {
    const creds = {
      jobseeker: { email: 'user@example.com', password: '123456' },
      employer: { email: 'employer@example.com', password: '123456' },
      admin: { email: 'admin@example.com', password: '123456' },
    };
    
    setValue('email', creds[role].email);
    setValue('password', creds[role].password);
    toast.success('✓ Credentials filled!', {
      icon: '🔐',
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-muted/30 relative overflow-hidden text-foreground">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] z-10 space-y-6"
      >
        <div className="bg-card p-8 rounded-2xl shadow-xl border border-border">
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="flex justify-center mb-4 text-primary font-bold text-3xl italic tracking-tighter">
              <span className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <LogIn className="w-5 h-5 text-primary" />
                </div>
                HireHub
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground font-medium">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2 px-1">
                <Mail className="w-4 h-4 text-primary" />
                Email Address
              </label>
              <Input 
                {...register('email')}
                placeholder="name@example.com"
                className={`h-11 ${errors.email ? 'border-red-500 bg-red-50/5' : ''}`}
              />
              {errors.email && (
                <p className="text-[11px] font-bold text-red-500 mt-1.5 px-1 leading-none">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Password
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs font-bold text-primary hover:underline underline-offset-4"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group/input">
                <Input 
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`h-11 ${errors.password ? 'border-red-500 bg-red-50/5 pr-10' : 'pr-10'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] font-bold text-red-500 mt-1.5 px-1 leading-none">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2 px-1">
              <input 
                {...register('remember')}
                type="checkbox" 
                id="remember"
                className="w-4 h-4 rounded border-input ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 checked:bg-primary accent-primary cursor-pointer mt-0.5" 
              />
              <label htmlFor="remember" className="text-sm font-medium leading-none cursor-pointer text-muted-foreground select-none">
                Remember me
              </label>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-11 font-bold gap-2 mt-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/95 transition-all active:scale-[0.98]"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>Sign In</>
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground font-bold tracking-widest text-[10px]">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={() => signIn('google')}
            className="w-full h-11 font-bold gap-3 border-border hover:bg-muted/50 transition-colors"
          >
            <Chrome className="w-4 h-4" />
            Continue with Google
          </Button>

          <p className="mt-8 text-center text-sm font-medium text-muted-foreground leading-none">
            Don't have an account?{' '}
            <Link 
              href="/register" 
              className="text-primary font-bold hover:underline underline-offset-4 decoration-2"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Demo Section */}
        <div className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-4 h-4 text-primary" />
            <h2 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground">Quick Demo Login</h2>
          </div>
          <div className="flex gap-2">
            {[
              { id: 'jobseeker' as const, label: 'Seeker' },
              { id: 'employer' as const, label: 'Employer' },
              { id: 'admin' as const, label: 'Admin' },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => fillDemo(btn.id)}
                className="flex-1 px-1 py-2.5 text-[10px] font-extrabold bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg transition-all border border-border hover:border-primary/30 active:scale-95 uppercase tracking-tighter"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
