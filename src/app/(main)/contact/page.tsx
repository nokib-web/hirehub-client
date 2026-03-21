'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSent, setIsSent] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500));
    console.log(data);
    setIsSent(true);
  };

  return (
    <div className="min-h-[85vh] bg-background">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
             <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Get in <span className="text-primary">Touch</span></h1>
             <p className="mt-4 text-lg text-muted-foreground font-medium">Have a question about HireHub? Want to partner with us? Reach out and our team will get back to you shortly.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
             
             {/* Left side Form */}
             <div className="lg:col-span-3 bg-card border border-border p-8 md:p-10 rounded-3xl shadow-xl shadow-primary/5 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {!isSent ? (
                    <motion.form 
                      key="form"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col relative z-10"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-bold text-foreground mb-1.5 block">Full Name</label>
                          <Input {...register('name')} placeholder="John Doe" className="h-12 bg-muted/50 rounded-xl" />
                          {errors.name && <p className="text-xs text-rose-500 mt-1 font-bold">{errors.name.message}</p>}
                        </div>
                        <div>
                          <label className="text-sm font-bold text-foreground mb-1.5 block">Email Address</label>
                          <Input {...register('email')} placeholder="john@example.com" type="email" className="h-12 bg-muted/50 rounded-xl" />
                          {errors.email && <p className="text-xs text-rose-500 mt-1 font-bold">{errors.email.message}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-bold text-foreground mb-1.5 block">Subject</label>
                        <select 
                          {...register('subject')} 
                          className="w-full h-12 bg-muted/50 border border-input rounded-xl px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background"
                        >
                          <option value="">Select a topic...</option>
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Technical Support">Technical Support</option>
                          <option value="Billing Question">Billing Question</option>
                          <option value="Partnerships">Partnerships</option>
                        </select>
                        {errors.subject && <p className="text-xs text-rose-500 mt-1 font-bold">{errors.subject.message}</p>}
                      </div>

                      <div>
                        <label className="text-sm font-bold text-foreground mb-1.5 block">Message</label>
                        <textarea 
                          {...register('message')} 
                          rows={6} 
                          placeholder="How can we help you today?" 
                          className="w-full bg-muted/50 border border-input rounded-xl p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background resize-none"
                        />
                        {errors.message && <p className="text-xs text-rose-500 mt-1 font-bold">{errors.message.message}</p>}
                      </div>

                      <Button type="submit" isLoading={isSubmitting} className="w-full h-14 rounded-2xl font-black text-lg gap-2 mt-4 flex items-center justify-center">
                        <Send className="w-5 h-5" /> Send Message
                      </Button>
                    </motion.form>
                  ) : (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="min-h-[400px] flex flex-col items-center justify-center text-center space-y-4"
                    >
                      <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mb-4 animate-bounce">
                        <CheckCircle2 className="w-12 h-12" />
                      </div>
                      <h3 className="text-3xl font-black text-foreground">Message Sent!</h3>
                      <p className="text-muted-foreground font-medium max-w-xs leading-relaxed">
                        Thanks for reaching out. A member of our team will get back to you within 24 hours.
                      </p>
                      <Button variant="outline" onClick={() => setIsSent(false)} className="mt-8 rounded-xl h-12 px-6 font-bold">
                        Send another message
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>

             {/* Right side Info Cards */}
             <div className="lg:col-span-2 space-y-6">
                
                <div className="p-8 bg-card border border-border rounded-3xl flex gap-5 hover:border-primary/50 transition-colors shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/50">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-foreground mb-1">Email Support</h4>
                    <p className="text-sm text-muted-foreground font-medium mb-2">Our team is ready to help.</p>
                    <a href="mailto:support@hirehub.com" className="font-bold text-primary hover:underline">support@hirehub.com</a>
                  </div>
                </div>

                <div className="p-8 bg-card border border-border rounded-3xl flex gap-5 hover:border-primary/50 transition-colors shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/50">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                     <h4 className="text-lg font-black text-foreground mb-1">Phone Inquiry</h4>
                     <p className="text-sm text-muted-foreground font-medium mb-2">Call us for immediate tech support.</p>
                     <p className="font-bold text-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="p-8 bg-card border border-border rounded-3xl flex gap-5 hover:border-primary/50 transition-colors shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-500 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-900/50">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                     <h4 className="text-lg font-black text-foreground mb-1">Office Hub</h4>
                     <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                       123 Innovation Drive<br/>
                       Suite 400<br/>
                       San Francisco, CA 94105
                     </p>
                  </div>
                </div>

                <div className="p-8 bg-card border border-border rounded-3xl flex gap-5 hover:border-primary/50 transition-colors shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center shrink-0 border border-orange-100 dark:border-orange-900/50">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                     <h4 className="text-lg font-black text-foreground mb-1">Business Hours</h4>
                     <p className="text-sm font-bold text-foreground">Mon - Fri <span className="text-muted-foreground">9:00 AM - 6:00 PM PST</span></p>
                     <p className="text-sm font-bold text-foreground mt-1">Sat - Sun <span className="text-muted-foreground">Closed</span></p>
                  </div>
                </div>

             </div>

          </div>
       </div>
    </div>
  );
}
