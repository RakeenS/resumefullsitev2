'use client';

import { useDeviceType } from '@/hooks/useDeviceType';
import Navbar from './Navbar';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const deviceType = useDeviceType();

  const getContainerClasses = () => {
    switch (deviceType) {
      case 'mobile':
        return 'px-2 w-full';
      case 'tablet':
        return 'px-4 w-full';
      case 'desktop':
        return 'px-6 w-full';
      default:
        return 'px-2 w-full';
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors duration-200">
      <Navbar />
      <main className={`pt-16 ${getContainerClasses()}`}>
        {children}
      </main>
    </div>
  );
}
