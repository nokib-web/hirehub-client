'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { X, Sparkles, Loader2, Send, CheckCircle2, FileText, Globe, DollarSign } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  companyName: string;
}

export default function ApplicationModal({ isOpen, onClose, jobTitle, companyName }: ApplicationModalProps) {
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [isImproving, setIsImproving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const improveCoverLetter = async () => {
    if (!coverLetter || coverLetter.length < 50) {
      toast.error('Please write at least 50 characters before improving.');
      return;
    }

    setIsImproving(true);
    try {
      const response = await axios.post('http://localhost:5000/api/ai/improve-cover-letter', {
        coverLetter,
        jobTitle,
      });
      setCoverLetter(response.data.data.improvedCoverLetter);
      toast.success('Cover letter improved! ✨');
    } catch (error) {
      console.error(error);
      toast.error('Failed to improve cover letter');
    } finally {
      setIsImproving(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!resumeUrl || coverLetter.length < 100) {
      toast.error('Please fill required fields (min 100 chars for cover letter)');
      return;
    }

    setIsSubmitting(true);
    try {
      // API call to submit application
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 3000);
    } catch {
      toast.error('Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border overflow-hidden relative"
          >
            {isSuccess ? (
              <div className="p-12 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 mb-6 scale-125">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Application Submitted! 🎉</h2>
                <p className="text-muted-foreground max-w-sm mb-8 text-lg">
                  Good luck with your application at {companyName}. We&apos;ve notified the hiring manager.
                </p>
                <Button onClick={onClose} variant="outline" className="px-8 mt-4">Close Window</Button>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-foreground">Apply for {jobTitle}</h2>
                    <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5 leading-none">
                      at <span className="text-foreground">{companyName}</span>
                    </p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      Resume URL <span className="text-red-500 font-bold">*</span>
                    </label>
                    <Input 
                      placeholder="Link to your resume (Drive, Dropbox, etc.)"
                      value={resumeUrl}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setResumeUrl(e.target.value)}
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        <Globe className="w-4 h-4 text-primary" />
                        Portfolio URL
                      </label>
                      <Input 
                        placeholder="Link to your projects"
                        value={portfolioUrl}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPortfolioUrl(e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        Expected Salary (Opt)
                      </label>
                      <Input 
                        placeholder="e.g. $120k / year"
                        value={expectedSalary}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setExpectedSalary(e.target.value)}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-semibold">
                        Cover Letter <span className="text-red-500 font-bold">*</span>
                      </label>
                      <button 
                        type="button"
                        onClick={improveCoverLetter}
                        disabled={isImproving || coverLetter.length < 50}
                        className="text-xs font-bold text-primary flex items-center gap-1.5 hover:underline decoration-2 underline-offset-4 disabled:opacity-50 disabled:no-underline px-2 py-1 bg-primary/5 rounded-md border border-primary/10 transition-colors"
                      >
                        {isImproving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        {isImproving ? 'Improving...' : 'Improve with AI'}
                      </button>
                    </div>
                    <textarea 
                      value={coverLetter}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCoverLetter(e.target.value)}
                      placeholder="Tell us why you're a great fit for this role (min 100 characters)..."
                      className="w-full h-44 rounded-xl border border-input bg-background p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none shadow-sm"
                      required
                    />
                    <div className="flex justify-between items-center px-1">
                      <p className={`text-[11px] font-bold ${coverLetter.length < 100 ? 'text-orange-500' : 'text-green-600'}`}>
                        {coverLetter.length} / 100 characters minimum
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="h-11 px-6">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="h-11 px-8 gap-2 group/sub relative overflow-hidden">
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Submit Application
                          <Send className="w-4 h-4 group-hover/sub:translate-x-1 group-hover/sub:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
