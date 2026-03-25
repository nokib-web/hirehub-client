'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "Is HireHub free to use for job seekers?",
    answer: "Yes, HireHub is completely free for job seekers. You can create a profile, browse jobs, and apply to openings at no cost. We also offer premium features like AI-powered resume analysis and career coaching for a small fee."
  },
  {
    question: "How do I post a job as an employer?",
    answer: "Employers can post jobs by creating a company profile and selecting a job posting package. Once your account is set up, you can easily create and manage job listings, track applications, and communicate with candidates through our platform."
  },
  {
    question: "How long does it take to get hired?",
    answer: "The time it takes to get hired depends on various factors, including your industry, experience, and the current job market. On average, job seekers who actively use HireHub and optimize their profiles find a job within 4-8 weeks."
  },
  {
    question: "Can I apply to multiple jobs at once?",
    answer: "Yes, you can apply to multiple jobs on HireHub. We recommend tailoring your resume and cover letter to each position to increase your chances of success. Our platform makes it easy to track all your applications in one place."
  },
  {
    question: "How does the AI career assistant work?",
    answer: "Our AI career assistant uses advanced algorithms to analyze your profile and job preferences. It then provides personalized job recommendations, resume enhancement tips, and interview preparation advice to help you succeed in your career."
  },
  {
    question: "Is my data safe and secure?",
    answer: "Data security is our top priority. HireHub uses industry-standard encryption and security protocols to protect your personal information. We never share your data with third parties without your explicit consent."
  }
];

const AccordionItem = ({ question, answer, isOpen, onClick }: { question: string; answer: string, isOpen: boolean; onClick: () => void }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow mb-4">
      <button 
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 md:p-8 text-left group"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-xl border border-zinc-100 dark:border-zinc-800 transition-colors ${isOpen ? 'bg-blue-600 border-blue-600 text-white' : 'bg-zinc-50 dark:bg-zinc-800 text-blue-600 opacity-50'}`}>
            <HelpCircle size={20} />
          </div>
          <span className={`text-xl font-bold transition-colors ${isOpen ? 'text-blue-600' : 'text-zinc-900 dark:text-zinc-100'}`}>
            {question}
          </span>
        </div>
        <div className={`p-2 rounded-full transition-transform duration-300 ${isOpen ? 'rotate-180 bg-blue-100 dark:bg-blue-900/40 text-blue-600' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-400'}`}>
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 md:px-8 pb-8 pt-2">
              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6">
                <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
                  {answer}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white dark:bg-zinc-950">
      <div className="container px-4 mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-zinc-100 mb-4"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 dark:text-zinc-400 text-lg"
          >
            Have questions? We have answers. If you can&apos;t find what you&apos;re looking for, feel free to contact us.
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <AccordionItem 
                question={faq.question} 
                answer={faq.answer} 
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
