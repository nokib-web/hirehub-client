'use client';

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AIChatbot from './AIChatbot';
import { usePathname } from 'next/navigation';

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  
  // Routes where Navbar and Footer should be HIDDEN (Dashboard)
  const isDashboardRoute = pathname?.startsWith('/dashboard');

  return (
    <>
      {!isDashboardRoute && <Navbar />}
      <main className={!isDashboardRoute ? "pt-24" : "min-h-screen"}>
        {children}
      </main>
      {!isDashboardRoute && <AIChatbot />}
      {!isDashboardRoute && <Footer />}
    </>
  );
};

export default LayoutWrapper;
