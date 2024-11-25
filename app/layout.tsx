'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { SupabaseAuthProvider } from '@/components/providers/supabase-auth-provider';
import './globals.css';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { useDeviceType } from '@/hooks/useDeviceType';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Resume Builder',
  description: 'Build your resume with AI',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const deviceType = useDeviceType();

  const getContainerClasses = () => {
    switch (deviceType) {
      case 'mobile':
        return 'px-4 w-full';
      case 'tablet':
        return 'px-6 w-full max-w-5xl';
      case 'desktop':
        return 'px-8 w-full';
      default:
        return 'px-4 w-full';
    }
  };

  return (
    <body className={`${inter.className} min-h-screen bg-white dark:bg-gray-900 transition-colors overflow-x-hidden`}>
      <SupabaseAuthProvider>
        <ThemeProvider>
          <Navbar />
          <main className={`pt-16 mx-auto ${getContainerClasses()}`}>
            {children}
          </main>
        </ThemeProvider>
        <Toaster />
      </SupabaseAuthProvider>
    </body>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <RootLayoutContent>{children}</RootLayoutContent>
    </html>
  );
}
