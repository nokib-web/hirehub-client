'use client';

import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturedJobs from '@/components/home/FeaturedJobs';
import CategorySection from '@/components/home/CategorySection';
import StatsSection from '@/components/home/StatsSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import TopCompanies from '@/components/home/TopCompanies';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BlogSection from '@/components/home/BlogSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import FAQSection from '@/components/home/FAQSection';

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* 
         Sections are already wrapped with framer-motion in-view animations.
         Navbar and Footer are handled by LayoutWrapper.
      */}
      <HeroSection />
      <FeaturedJobs />
      <CategorySection />
      <StatsSection />
      <HowItWorksSection />
      <TopCompanies />
      <TestimonialsSection />
      <BlogSection />
      <NewsletterSection />
      <FAQSection />
    </div>
  );
}
