'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  User, Mail, Lock, CheckCircle2, 
  Loader2, UserPlus, Chrome, Building2, 
  ChevronRight, LayoutGrid, Check, Info
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/providers/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['jobseeker', 'employer']),
  company: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, 'You must agree to terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.role === 'employer' && !data.company) return false;
  return true;
}, {
  message: "Company name is required for employers",
  path: ["company"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'None', color: 'bg-muted' });
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'jobseeker',
      terms: false,
    }
  });

  const selectedRole = watch('role');
  const password = watch('password');

  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, label: 'None', color: 'bg-muted' });
      return;
    }

    let score = 0;
    if (password.length >= 6) score = 1; // Weak
    if (password.length >= 6 && /[a-z]/.test(password) && /[0-9]/.test(password)) score = 2; // Fair/Good
    if (password.length >= 8 && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score = 3; // Strong

    const strengths = [
      { score: 0, label: 'Too Short', color: 'bg-red-500/20' },
      { score: 1, label: 'Weak', color: 'bg-red-500' },
      { score: 2, label: 'Good', color: 'bg-amber-500' },
      { score: 3, label: 'Strong', color: 'bg-green-500' },
    ];
    setPasswordStrength(strengths[score]);
  }, [password]);

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      login(result.data.accessToken);
      toast.success('Account created successfully! 🚀');
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-muted/30 relative overflow-hidden text-foreground">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[460px] z-10 py-10"
      >
        <div className="bg-card p-8 rounded-3xl shadow-2xl border border-border">
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="flex justify-center mb-4 text-primary font-bold text-3xl italic tracking-tighter">
              <span className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-primary" />
                </div>
                HireHub
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground font-medium">
              Join thousands of professionals today
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role Selector */}
            <div className="p-1.5 bg-muted rounded-2xl grid grid-cols-2 gap-2 mb-6 shadow-inner">
              <button
                type="button"
                onClick={() => setValue('role', 'jobseeker')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  selectedRole === 'jobseeker' 
                    ? 'bg-card text-primary shadow-sm ring-1 ring-border' 
                    : 'text-muted-foreground hover:bg-card/40'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() => setValue('role', 'employer')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  selectedRole === 'employer' 
                    ? 'bg-card text-primary shadow-sm ring-1 ring-border' 
                    : 'text-muted-foreground hover:bg-card/40'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Employer
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> Full Name
              </label>
              <Input 
                {...register('name')}
                placeholder="John Doe"
                className={`h-11 ${errors.name ? 'border-red-500 focus:ring-red-500/10' : ''}`}
              />
              {errors.name && (
                <p className="text-[10px] font-extrabold text-red-500 mt-1 px-1">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> Email Address
              </label>
              <Input 
                {...register('email')}
                placeholder="john@example.com"
                className={`h-11 ${errors.email ? 'border-red-500 focus:ring-red-500/10' : ''}`}
              />
              {errors.email && (
                <p className="text-[10px] font-extrabold text-red-500 mt-1 px-1">{errors.email.message}</p>
              )}
            </div>

            {/* Conditional Field */}
            <AnimatePresence mode="wait">
              {selectedRole === 'employer' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-xs font-bold uppercase tracking-widest text-primary px-1 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5" /> Company Name
                  </label>
                  <Input 
                    {...register('company')}
                    placeholder="Enter your company name"
                    className={`h-11 ${errors.company ? 'border-red-500' : 'border-primary/20 bg-primary/5'}`}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2 text-foreground">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" /> Create Password
              </label>
              <Input 
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className={`h-11 ${errors.password ? 'border-red-500 focus:ring-red-500/10' : ''}`}
              />
              
              {/* Strength Indicator */}
              <div className="px-1 pt-1 space-y-1.5 opacity-100">
                <div className="flex justify-between items-center h-4">
                   <div className="flex gap-1 flex-1 h-1.5 px-0.5">
                      {[1, 2, 3].map((step) => (
                        <div 
                          key={step} 
                          className={`h-full flex-1 rounded-full transition-all duration-500 ${
                            passwordStrength.score >= step ? passwordStrength.color : 'bg-muted border border-border/50'
                          }`} 
                        />
                      ))}
                   </div>
                   <span className={`text-[10px] font-bold px-2 uppercase tracking-tighter transition-colors duration-500 ${
                     passwordStrength.score > 0 ? 'text-foreground' : 'text-muted-foreground'
                   }`}>
                     {passwordStrength.label}
                   </span>
                </div>
              </div>
              
              {errors.password && (
                <p className="text-[10px] font-extrabold text-red-500 mt-1 px-1">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Password
              </label>
              <Input 
                {...register('confirmPassword')}
                type="password"
                placeholder="••••••••"
                className={`h-11 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500/10' : ''}`}
              />
              {errors.confirmPassword && (
                <p className="text-[10px] font-extrabold text-red-500 mt-1 px-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex items-start space-x-2 px-1 pt-2">
              <div className="pt-0.5">
                <input 
                  {...register('terms')}
                  type="checkbox" 
                  id="terms"
                  className="w-4 h-4 rounded border-input ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 checked:bg-primary accent-primary cursor-pointer transition-all" 
                />
              </div>
              <label htmlFor="terms" className="text-xs font-medium text-muted-foreground select-none leading-relaxed">
                I agree to the <Link href="/terms" className="text-primary font-bold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary font-bold hover:underline">Privacy Policy</Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-[10px] font-extrabold text-red-500 px-1 leading-none -mt-3 capitalize">{errors.terms.message}</p>
            )}

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-12 font-bold gap-2 mt-4 shadow-xl shadow-primary/20 bg-primary hover:bg-primary/95 transition-all text-sm tracking-wide"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Create Account</>
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-card px-3 text-muted-foreground font-bold text-[10px]">Or join with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={() => signIn('google')}
            className="w-full h-11 font-bold gap-3 border-border hover:bg-muted/50 transition-colors"
          >
            <Chrome className="w-4 h-4" />
            Sign up with Google
          </Button>

          <p className="mt-8 text-center text-sm font-medium text-muted-foreground select-none">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="text-primary font-extrabold hover:underline underline-offset-4 decoration-2"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
