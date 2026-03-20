import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers';
import LayoutWrapper from '@/components/shared/LayoutWrapper';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HireHub - Find Your Dream Job & Recruitment Platform',
  description: 'Connecting talent with opportunity through a seamless, AI-powered experience. Browse top jobs, build your career, and hire the best candidates.',
  keywords: ['jobs', 'recruitment', 'careers', 'hiring', 'AI job search', 'HireHub'],
  authors: [{ name: 'HireHub Team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased selection:bg-primary/20 selection:text-primary`}>
        <Providers>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
