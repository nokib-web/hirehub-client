'use client';

import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import FeaturedJobs from '@/components/home/FeaturedJobs';
import CategorySection from '@/components/home/CategorySection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import NewsletterSection from '@/components/home/NewsletterSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <CategorySection />
        <FeaturedJobs />
        <HowItWorksSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}
