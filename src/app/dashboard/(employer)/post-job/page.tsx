'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/providers/AuthProvider';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Sparkles, MapPin, Briefcase, ChevronRight, ChevronLeft, CheckCircle2, DollarSign, Calendar, Rocket, FileText, ListTodo, Wrench, HeartHandshake } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

const jobSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  company: z.string().min(2, 'Company is required'),
  location: z.string().min(2, 'Location is required'),
  locationType: z.enum(['Remote', 'On-site', 'Hybrid']),
  type: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance']),
  experience: z.enum(['Entry Level', 'Mid Level', 'Senior Level', 'Executive']),
  deadline: z.string().min(1, 'Deadline is required'),
  category: z.enum(['Technology', 'Marketing', 'Design', 'Finance', 'Healthcare', 'Education', 'Sales', 'Engineering', 'HR', 'Legal']),
  salaryMin: z.coerce.number().min(0, 'Minimum salary must be positive'),
  salaryMax: z.coerce.number().min(0, 'Maximum salary must be positive'),
  currency: z.string().default('USD'),
  period: z.enum(['hourly', 'monthly', 'yearly']),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  requirements: z.array(z.string()).min(1, 'Add at least one requirement'),
  responsibilities: z.array(z.string()).min(1, 'Add at least one responsibility'),
  skills: z.array(z.string()).min(1, 'Add at least one skill'),
  benefits: z.array(z.string()).optional(),
});

type JobFormValues = z.infer<typeof jobSchema>;

export default function PostJob() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors }, trigger } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema) as any,
    defaultValues: {
      company: user?.company || '',
      currency: 'USD',
      period: 'yearly',
      requirements: [],
      responsibilities: [],
      skills: [],
      benefits: [],
      locationType: 'Remote',
      type: 'Full-time',
      experience: 'Mid Level',
      category: 'Technology'
    }
  });

  const formData = watch();

  const handleNext = async () => {
    let fieldsToValidate: (keyof JobFormValues)[] = [];
    if (step === 1) {
      fieldsToValidate = ['title', 'company', 'location', 'locationType', 'type', 'experience', 'deadline'];
    } else if (step === 2) {
      fieldsToValidate = ['category', 'salaryMin', 'salaryMax', 'currency', 'period', 'description', 'requirements', 'responsibilities', 'skills'];
    }
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep(step + 1);
    else toast.error('Please fix the errors before continuing');
  };

  const handleAI = async () => {
    const { title, company, type } = formData;
    if (!title || !company) {
      toast.error('Title and Company are required for AI generation');
      return;
    }
    setIsAiLoading(true);
    try {
      const res = await api.post('/ai/generate-job-description', {
        title, company, type
      });
      if (res.data.success) {
         setValue('description', res.data.data.description || '');
         setValue('requirements', res.data.data.requirements || []);
         setValue('responsibilities', res.data.data.responsibilities || []);
         setValue('skills', res.data.data.skills || []);
         toast.success('AI magic complete! ✨');
      }
    } catch {
      toast.error('AI Generation failed. Please try again.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const ArrayInput = ({ name, label, icon: Icon }: { name: "requirements" | "responsibilities" | "skills" | "benefits", label: string, icon: any }) => {
    const list = (watch(name) as string[]) || [];
    const [input, setInput] = useState('');
    
    const add = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && input.trim()) {
        e.preventDefault();
        if (!list.includes(input.trim())) {
          setValue(name, [...list, input.trim()]);
        }
        setInput('');
      }
    };
    const remove = (val: string) => setValue(name, list.filter(i => i !== val));

    return (
      <div className="space-y-3">
        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
          <Icon className="w-3 h-3" /> {label}
          <span className="text-[9px] font-normal lowercase tracking-normal">(Enter to add)</span>
        </label>
        <div className="p-4 bg-muted/20 border border-border/40 rounded-2xl min-h-[60px] flex flex-wrap gap-2 focus-within:bg-background focus-within:ring-4 focus-within:ring-primary/10 transition-all">
          {list.map(item => (
            <span key={item} className="px-3 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-xl border border-primary/20 flex items-center gap-2 group shadow-sm">
              {item} 
              <button type="button" onClick={() => remove(item)} className="hover:text-rose-500 transition-colors">×</button>
            </span>
          ))}
          <input 
            type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={add}
            className="flex-1 bg-transparent border-none outline-none text-sm font-bold placeholder:font-medium placeholder:text-muted-foreground/40 min-w-[120px] px-2"
            placeholder={`Add ${label.toLowerCase()}...`}
          />
        </div>
        {errors[name] && <p className="text-[10px] text-rose-500 font-bold ml-1">{(errors[name] as { message?: string })?.message}</p>}
      </div>
    );
  };

  const onSubmit = async (data: JobFormValues, status: 'active' | 'draft') => {
    setIsPublishing(true);
    try {
      const payload = {
        ...data,
        status,
        salary: {
          min: data.salaryMin,
          max: data.salaryMax,
          currency: data.currency,
          period: data.period
        }
      };
      await api.post('/jobs', payload);
      
      if (status === 'active') {
        toast.success(`Published! ${data.title} is now live 🚀`, {
          duration: 5000,
          icon: '✨',
          style: { borderRadius: '1rem', fontWeight: 'bold' }
        });
      } else {
        toast.success('Draft saved successfully');
      }
      
      router.push('/dashboard/my-jobs');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['employer']}>
      <div className="max-w-5xl mx-auto py-10 space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-wider border border-primary/20">
                <Rocket className="w-3 h-3" /> Talent Acquisition
              </div>
              <h1 className="text-4xl font-black text-foreground tracking-tight leading-none italic">Recruit Top Talent</h1>
              <p className="text-muted-foreground font-medium max-w-md">Find the perfect match for your team with our precision hiring tools.</p>
           </div>
        </div>

        {/* Progress Stepper */}
        <div className="flex items-center justify-between max-w-2xl mx-auto mb-16 relative px-4">
          <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-muted rounded-full -z-10" />
          <div className="absolute left-8 top-1/2 -translate-y-1/2 h-1 bg-primary transition-all duration-700 ease-out rounded-full -z-10 shadow-[0_0_15px_rgba(var(--primary),0.3)]" style={{ width: `${Math.max(0, ((step - 1) / 2) * (100 - (step > 1 ? 0 : 0)))}%` }} />
          {[
            { s: 1, label: 'Basics' },
            { s: 2, label: 'Details' },
            { s: 3, label: 'Review' }
          ].map(({ s, label }) => (
            <div key={s} className="flex flex-col items-center gap-3">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black transition-all duration-500 border-4 ${step >= s ? 'bg-primary border-primary text-white scale-110 shadow-2xl shadow-primary/30' : 'bg-card border-border text-muted-foreground'}`}>
                {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border shadow-[0_32px_128px_-12px_rgba(0,0,0,0.1)] rounded-[3rem] p-8 md:p-14 min-h-[600px] flex flex-col relative overflow-hidden ring-1 ring-primary/5">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.4 }} className="space-y-10 flex-1">
                <div className="flex items-center gap-4 border-b border-border/60 pb-8">
                   <div className="p-4 bg-muted/50 rounded-[1.5rem] border border-border/40">
                      <Briefcase className="w-6 h-6 text-primary" />
                   </div>
                   <div>
                      <h2 className="text-2xl font-black">Core Information</h2>
                      <p className="text-sm text-muted-foreground font-medium">Define the fundamental aspects of the position.</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Job Title</label>
                    <Input {...register('title')} placeholder="e.g. Lead Software Engineer" className="h-16 px-6 font-bold rounded-[1.25rem] bg-muted/20 border-border/40 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all" />
                    {errors.title && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.title.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Company Entity</label>
                    <Input {...register('company')} placeholder="Official company name" className="h-16 px-6 font-bold rounded-[1.25rem] bg-muted/20 border-border/40 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all" />
                    {errors.company && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.company.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Geographical Location</label>
                    <div className="relative group">
                       <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                       <Input {...register('location')} placeholder="e.g. San Francisco, CA" className="h-16 pl-14 pr-6 font-bold rounded-[1.25rem] bg-muted/20 border-border/40 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all" />
                    </div>
                    {errors.location && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.location.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Work Layout</label>
                    <select {...register('locationType')} className="w-full rounded-[1.25rem] border border-border/40 bg-muted/20 px-6 h-16 text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-primary/10 focus:bg-background transition-all appearance-none cursor-pointer">
                      <option value="Remote">Remote Only</option>
                      <option value="On-site">Strictly On-site</option>
                      <option value="Hybrid">Hybrid Workspace</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Employment Type</label>
                    <select {...register('type')} className="w-full rounded-[1.25rem] border border-border/40 bg-muted/20 px-6 h-16 text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-primary/10 focus:bg-background transition-all appearance-none cursor-pointer">
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contractual</option>
                      <option value="Internship">Internship</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Seniority Level</label>
                    <select {...register('experience')} className="w-full rounded-[1.25rem] border border-border/40 bg-muted/20 px-6 h-16 text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-primary/10 focus:bg-background transition-all appearance-none cursor-pointer">
                      <option value="Entry Level">Entry Level</option>
                      <option value="Mid Level">Mid Level</option>
                      <option value="Senior Level">Senior Level</option>
                      <option value="Executive">Executive / Director</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Posting Deadline</label>
                    <div className="relative group">
                       <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                       <Input type="date" {...register('deadline')} className="h-16 pl-14 pr-6 font-bold rounded-[1.25rem] bg-muted/20 border-border/40 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all custom-calendar-picker" />
                    </div>
                    {errors.deadline && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.deadline.message}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.4 }} className="space-y-10 flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/60 pb-8">
                  <div className="flex items-center gap-4">
                     <div className="p-4 bg-muted/50 rounded-[1.5rem] border border-border/40">
                        <FileText className="w-6 h-6 text-primary" />
                     </div>
                     <div>
                        <h2 className="text-2xl font-black">Strategic Details</h2>
                        <p className="text-sm text-muted-foreground font-medium">Add depth and clarity using AI-assisted generation.</p>
                     </div>
                  </div>
                  <Button type="button" onClick={handleAI} isLoading={isAiLoading} className="h-14 px-8 gap-3 bg-foreground text-background font-black rounded-2xl shadow-xl shadow-foreground/10 hover:scale-[1.02] active:scale-95 transition-all">
                    <Sparkles className="w-5 h-5 text-amber-400" /> 
                    <span>{isAiLoading ? 'Generating Content...' : 'Auto-Generate with AI'}</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Industry Category</label>
                    <select {...register('category')} className="w-full rounded-[1.25rem] border border-border/40 bg-muted/20 px-6 h-16 text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-primary/10 focus:bg-background transition-all appearance-none cursor-pointer">
                      <option>Technology</option><option>Marketing</option><option>Design</option><option>Finance</option><option>Healthcare</option>
                      <option>Education</option><option>Sales</option><option>Engineering</option><option>HR</option><option>Legal</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Min Salary</label>
                    <div className="relative group">
                       <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                       <Input type="number" {...register('salaryMin')} className="h-16 pl-12 pr-6 font-bold rounded-[1.25rem] bg-muted/20 border-border/40 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all text-center" />
                    </div>
                    {errors.salaryMin && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.salaryMin.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Max Salary</label>
                    <div className="relative group">
                       <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                       <Input type="number" {...register('salaryMax')} className="h-16 pl-12 pr-6 font-bold rounded-[1.25rem] bg-muted/20 border-border/40 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all text-center" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Payment Interval</label>
                    <select {...register('period')} className="w-full rounded-[1.25rem] border border-border/40 bg-muted/20 px-6 h-16 text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-primary/10 focus:bg-background transition-all appearance-none cursor-pointer text-center">
                      <option value="hourly">Hourly Rate</option>
                      <option value="monthly">Monthly Salary</option>
                      <option value="yearly">Per Annum</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Comprehensive Job Description</label>
                  <textarea {...register('description')} rows={8} className="w-full rounded-[2rem] border border-border/40 bg-muted/20 p-8 text-sm font-medium shadow-sm outline-none focus:ring-4 focus:ring-primary/10 focus:bg-background transition-all placeholder:text-muted-foreground/40 leading-relaxed" placeholder="Clearly articulate the role, expectations, and unique opportunities..."></textarea>
                  {errors.description && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <ArrayInput name="requirements" label="Strict Requirements" icon={ListTodo} />
                  <ArrayInput name="responsibilities" label="Daily Responsibilities" icon={ListTodo} />
                  <ArrayInput name="skills" label="Technical Stack / Skills" icon={Wrench} />
                  <ArrayInput name="benefits" label="Perks & Benefits" icon={HeartHandshake} />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.4 }} className="space-y-12 flex-1">
                <div className="flex items-center gap-4 border-b border-border/60 pb-8">
                   <div className="p-4 bg-muted/50 rounded-[1.5rem] border border-border/40">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                   </div>
                   <div>
                      <h2 className="text-2xl font-black">Final Review</h2>
                      <p className="text-sm text-muted-foreground font-medium">Verify your posting before it goes live to millions of candidates.</p>
                   </div>
                </div>
                
                <div className="bg-muted/10 rounded-[2.5rem] p-10 border border-border shadow-inner space-y-10">
                   <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                      <div className="w-24 h-24 rounded-3xl bg-primary/10 text-primary flex items-center justify-center font-black text-4xl border border-primary/20 shrink-0 shadow-xl shadow-primary/5">
                        {formData.company ? formData.company.charAt(0).toUpperCase() : 'H'}
                      </div>
                      <div className="space-y-2">
                        <div className="px-3 py-1 bg-primary/5 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest inline-block border border-primary/10 mb-1">
                           Preview Mode
                        </div>
                        <h3 className="text-4xl font-black tracking-tight leading-tight">{formData.title || 'Untitled Role'}</h3>
                        <div className="flex items-center gap-3">
                           <span className="text-md font-bold text-muted-foreground">{formData.company}</span>
                           <div className="w-1.5 h-1.5 rounded-full bg-border" />
                           <span className="text-md font-bold text-muted-foreground">{formData.location}</span>
                        </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-border/50">
                     <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Industry</p>
                        <p className="font-bold text-foreground">{formData.category}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Type</p>
                        <p className="font-bold text-foreground">{formData.type} / {formData.locationType}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Salary Package</p>
                        <p className="font-bold text-emerald-600">${formData.salaryMin.toLocaleString()} - ${formData.salaryMax.toLocaleString()} <span className="text-[10px] font-black text-muted-foreground">/{formData.period}</span></p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Apply By</p>
                        <p className="font-bold text-rose-500">{new Date(formData.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                     </div>
                   </div>

                   <div className="space-y-4">
                     <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Role Summary</p>
                     <p className="text-md font-medium text-foreground/80 leading-relaxed max-w-3xl line-clamp-4 bg-muted/30 p-6 rounded-2xl border border-border/40 italic">
                        &quot;{formData.description || 'No description provided yet.'}&quot;
                     </p>
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 pt-6 mt-auto">
                   <Button onClick={handleSubmit((d) => onSubmit(d, 'active'))} isLoading={isPublishing} className="w-full sm:flex-1 h-20 rounded-[1.5rem] font-black text-xl bg-primary hover:bg-primary/90 shadow-[0_20px_40px_-10px_rgba(var(--primary),0.3)] hover:scale-[1.02] active:scale-95 transition-all text-white border-none">
                     Launch Position Live 🚀
                   </Button>
                   <Button onClick={handleSubmit((d) => onSubmit(d, 'draft'))} isLoading={isPublishing} variant="outline" className="w-full sm:w-auto h-20 px-10 rounded-[1.5rem] font-black text-lg border-4 border-primary/5 hover:bg-primary/5 transition-all">
                     Save Draft
                   </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="pt-10 border-t border-border mt-14 flex justify-between items-center z-10">
            <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 1 || isPublishing} className="gap-3 h-12 px-6 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-muted/50">
              <ChevronLeft className="w-4 h-4" /> Go Back
            </Button>
            {step < 3 && (
              <Button onClick={handleNext} disabled={isAiLoading} className="h-14 px-10 gap-3 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all font-black text-xs uppercase tracking-widest">
                Safe & Continue <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

      </div>
    </ProtectedRoute>
  );
}
