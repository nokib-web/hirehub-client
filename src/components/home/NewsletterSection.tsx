'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type FormData = z.infer<typeof schema>;

const NewsletterSection = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
  });

  const onSubmit = async (data: FormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Newsletter subscription:', data.email);
    toast.success('Successfully subscribed to job alerts!', {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    reset();
  };

  return (
    <section className="py-24 bg-zinc-950 dark:bg-zinc-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] -ml-48 -mb-48" />

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[40px] p-8 md:p-16 text-center shadow-2xl overflow-hidden relative">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')]" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20 backdrop-blur-md">
              <Send className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Get Job Alerts Delivered to Your Inbox
            </h2>
            
            <p className="text-blue-100/70 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
              Join 50,000+ job seekers getting weekly alerts. Stay informed about the latest opportunities and career advice.
            </p>
            
            <form 
              onSubmit={handleSubmit(onSubmit)}
              className="max-w-md mx-auto space-y-4"
            >
              <div className="relative">
                <input 
                  {...register('email')}
                  type="text" 
                  placeholder="name@example.com"
                  className={`w-full px-6 py-4 rounded-2xl bg-white border-2 focus:ring-4 focus:ring-blue-500/20 text-zinc-900 placeholder:text-zinc-400 transition-all ${
                    errors.email ? 'border-red-400' : 'border-transparent'
                  }`}
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-300 text-xs mt-2 text-left px-2 font-medium"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              
              <Button 
                isLoading={isSubmitting}
                type="submit"
                size="lg"
                className="w-full py-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg shadow-lg hover:shadow-emerald-500/20 transition-all border-none"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
              </Button>
              
              <div className="flex items-center justify-center gap-2 text-white/40 text-sm mt-6">
                <CheckCircle size={14} />
                <span>No spam, unsubscribe anytime. Your data is safe with us.</span>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
