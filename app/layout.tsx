import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { SupabaseAuthProvider } from '@/components/providers/supabase-auth-provider';
import './globals.css';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/providers/ThemeProvider';
import ClientLayout from '@/components/ClientLayout';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SupabaseAuthProvider>
          <ThemeProvider>
            <ClientLayout>{children}</ClientLayout>
          </ThemeProvider>
          <Toaster />
        </SupabaseAuthProvider>
      </body>
    </html>
  );
}
