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
import { Sparkles, Building2, MapPin, DollarSign, Briefcase, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
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
  salaryMin: z.coerce.number().min(0),
  salaryMax: z.coerce.number().min(0),
  currency: z.string().default('USD'),
  period: z.enum(['hourly', 'monthly', 'yearly']),
  description: z.string().min(50, 'Description must be at least 50 chars'),
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  };

  const handleAI = async () => {
    const { title, company, type } = formData;
    if (!title || !company) {
      toast.error('Please fill Title and Company to use AI');
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
         toast.success('Generated successfully! ✨');
      }
    } catch (err) {
      toast.error('AI Generation failed');
    } finally {
      setIsAiLoading(false);
    }
  };

  const ArrayInput = ({ name, label }: { name: "requirements" | "responsibilities" | "skills" | "benefits", label: string }) => {
    const list = (watch(name) as string[]) || [];
    const [input, setInput] = useState('');
    
    const add = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && input.trim()) {
        e.preventDefault();
        setValue(name, [...list, input.trim()]);
        setInput('');
      }
    };
    const remove = (val: string) => setValue(name, list.filter(i => i !== val));

    return (
      <div className="space-y-2">
        <label className="text-sm font-bold text-foreground">{label} (Press Enter)</label>
        <div className="p-3 bg-muted/30 border border-input rounded-xl min-h-[50px] flex flex-wrap gap-2 focus-within:ring-1 focus-within:ring-ring">
          {list.map(item => (
            <span key={item} className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg flex items-center gap-1">
              {item} <button type="button" onClick={() => remove(item)}>×</button>
            </span>
          ))}
          <input 
            type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={add}
            className="flex-1 bg-transparent border-none outline-none text-sm min-w-[100px]"
            placeholder={`Add ${label.toLowerCase()}...`}
          />
        </div>
        {errors[name] && <p className="text-xs text-rose-500 font-bold">{(errors[name] as any)?.message}</p>}
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
      toast.success(status === 'active' ? 'Job Published!' : 'Draft Saved!');
      router.push('/dashboard/my-jobs');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['employer']}>
      <div className="max-w-4xl mx-auto py-6">
        <h1 className="text-3xl font-black mb-8 flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-primary" /> Post a new job
        </h1>

        {/* Progress */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border -z-10" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary transition-all duration-500 -z-10" style={{ width: `${((step - 1) / 2) * 100}%` }} />
          {[1, 2, 3].map(s => (
            <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 ${step >= s ? 'bg-primary border-primary text-white scale-110 shadow-lg' : 'bg-card border-border text-muted-foreground'}`}>
              {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
            </div>
          ))}
        </div>

        <div className="bg-card border border-border shadow-sm rounded-3xl p-6 md:p-10 min-h-[500px] flex flex-col relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 flex-1">
                <h2 className="text-xl font-bold border-b border-border pb-4 mb-6">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold mb-1.5 block">Job Title</label>
                    <Input {...register('title')} placeholder="e.g. Senior Product Designer" />
                    {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-bold mb-1.5 block">Company Name</label>
                    <Input {...register('company')} placeholder="Your company name" />
                    {errors.company && <p className="text-xs text-rose-500 mt-1">{errors.company.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-sm font-bold mb-1.5 block flex items-end gap-1"><MapPin className="w-4 h-4"/> Location</label>
                    <Input {...register('location')} placeholder="e.g. New York, NY" />
                    {errors.location && <p className="text-xs text-rose-500 mt-1">{errors.location.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-bold mb-1.5 block">Location Type</label>
                    <select {...register('locationType')} className="w-full rounded-xl border border-input bg-muted/30 px-4 h-12 text-sm shadow-sm outline-none focus:ring-1 focus:ring-primary">
                      <option>Remote</option><option>On-site</option><option>Hybrid</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-bold mb-1.5 block">Job Type</label>
                    <select {...register('type')} className="w-full rounded-xl border border-input bg-muted/30 px-4 h-12 text-sm shadow-sm outline-none focus:ring-1 focus:ring-primary">
                      <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option><option>Freelance</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold mb-1.5 block">Experience</label>
                    <select {...register('experience')} className="w-full rounded-xl border border-input bg-muted/30 px-4 h-12 text-sm shadow-sm outline-none focus:ring-1 focus:ring-primary">
                      <option>Entry Level</option><option>Mid Level</option><option>Senior Level</option><option>Executive</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold mb-1.5 block">Application Deadline</label>
                    <Input type="date" {...register('deadline')} />
                    {errors.deadline && <p className="text-xs text-rose-500 mt-1">{errors.deadline.message}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 flex-1">
                <div className="flex justify-between items-center border-b border-border pb-4 mb-6">
                  <h2 className="text-xl font-bold">Job Details & Description</h2>
                  <Button type="button" size="sm" onClick={handleAI} isLoading={isAiLoading} className="gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full shadow-lg shadow-purple-500/30">
                    <Sparkles className="w-4 h-4" /> Generate with AI
                  </Button>
                </div>

                {isAiLoading && (
                  <div className="absolute inset-0 z-50 bg-card/80 backdrop-blur-sm flex flex-col items-center justify-center">
                    <Sparkles className="w-10 h-10 text-purple-500 animate-bounce mb-4" />
                    <p className="font-bold text-lg animate-pulse">AI is writing your job description...</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="text-sm font-bold mb-1.5 block">Category</label>
                    <select {...register('category')} className="w-full rounded-xl border border-input bg-muted/30 px-4 h-12 text-sm shadow-sm outline-none focus:ring-1 focus:ring-primary">
                      <option>Technology</option><option>Marketing</option><option>Design</option><option>Finance</option><option>Healthcare</option>
                      <option>Education</option><option>Sales</option><option>Engineering</option><option>HR</option><option>Legal</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold mb-1.5 block text-center">Min Salary</label>
                    <Input type="number" {...register('salaryMin')} className="text-center" />
                    {errors.salaryMin && <p className="text-xs text-rose-500">{errors.salaryMin.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-bold mb-1.5 block text-center">Max Salary</label>
                    <Input type="number" {...register('salaryMax')} className="text-center" />
                  </div>
                  <div>
                    <label className="text-sm font-bold mb-1.5 block text-center">Period</label>
                    <select {...register('period')} className="w-full rounded-xl border border-input bg-muted/30 px-4 h-12 text-sm shadow-sm outline-none focus:ring-1 focus:ring-primary text-center">
                      <option>hourly</option><option>monthly</option><option>yearly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold mb-1.5 block">Job Description</label>
                  <textarea {...register('description')} rows={6} className="w-full rounded-xl border border-input bg-muted/30 p-4 text-sm shadow-sm outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50" placeholder="Describe the role in detail..."></textarea>
                  {errors.description && <p className="text-xs text-rose-500">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ArrayInput name="requirements" label="Requirements" />
                  <ArrayInput name="responsibilities" label="Responsibilities" />
                  <ArrayInput name="skills" label="Skills" />
                  <ArrayInput name="benefits" label="Benefits (Optional)" />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 flex-1">
                <h2 className="text-xl font-bold border-b border-border pb-4 mb-6">Review & Publish</h2>
                
                <div className="bg-muted/30 rounded-2xl p-6 border border-border">
                   <div className="flex gap-4 items-start mb-6">
                      <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-2xl border border-primary/20 shrink-0">
                        {formData.company.charAt(0) || 'C'}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black">{formData.title || 'Untitled'}</h3>
                        <p className="text-muted-foreground font-bold">{formData.company}</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pt-6 border-t border-border/50">
                     <div><p className="text-xs text-muted-foreground uppercase font-black">Location</p><p className="font-bold">{formData.location} ({formData.locationType})</p></div>
                     <div><p className="text-xs text-muted-foreground uppercase font-black">Type</p><p className="font-bold">{formData.type}</p></div>
                     <div><p className="text-xs text-muted-foreground uppercase font-black">Salary</p><p className="font-bold">${formData.salaryMin} - ${formData.salaryMax} / {formData.period}</p></div>
                     <div><p className="text-xs text-muted-foreground uppercase font-black">Deadline</p><p className="font-bold">{formData.deadline}</p></div>
                   </div>

                   <div className="space-y-4">
                     <p className="text-xs text-muted-foreground uppercase font-black">Description Snippet</p>
                     <p className="text-sm line-clamp-3 text-foreground/80">{formData.description || 'No description provided.'}</p>
                   </div>
                </div>

                <div className="flex items-center gap-4 pt-6 mt-auto">
                   <Button onClick={handleSubmit((d) => onSubmit(d, 'active'))} isLoading={isPublishing} className="flex-1 h-14 rounded-2xl font-black text-lg bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20">
                     Publish Job Live 🚀
                   </Button>
                   <Button onClick={handleSubmit((d) => onSubmit(d, 'draft'))} isLoading={isPublishing} variant="outline" className="flex-1 h-14 rounded-2xl font-black text-lg">
                     Save as Draft
                   </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="pt-6 border-t border-border mt-8 flex justify-between items-center z-10">
            <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 1 || isPublishing} className="gap-2">
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            {step < 3 && (
              <Button onClick={handleNext} disabled={isAiLoading} className="gap-2 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                Continue <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

      </div>
    </ProtectedRoute>
  );
}
