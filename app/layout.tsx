import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { SupabaseAuthProvider } from '@/components/providers/supabase-auth-provider';
import './globals.css';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/providers/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Resume Builder',
  description: 'Build your resume with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-white dark:bg-gray-900 transition-colors`}>
        <SupabaseAuthProvider>
          <ThemeProvider>
            <Navbar />
            <main className="pt-16">
              {children}
            </main>
          </ThemeProvider>
          <Toaster />
        </SupabaseAuthProvider>
      </body>
    </html>
  );
}
