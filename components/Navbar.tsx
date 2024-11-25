'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { useDeviceType } from '@/hooks/useDeviceType';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const deviceType = useDeviceType();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/builder', label: 'Resume Builder' },
    { href: '/jobs', label: 'Job Tracker' },
    { href: '/job-tools', label: 'Job Tools' },
  ];

  const getContainerClasses = () => {
    switch (deviceType) {
      case 'mobile':
        return 'px-4';
      case 'tablet':
        return 'px-6';
      case 'desktop':
        return 'px-8';
      default:
        return 'px-4';
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className={`max-w-7xl mx-auto ${getContainerClasses()}`}>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                CareerQuestAI
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              if (label === 'Job Tracker') {
                return (
                  <Link
                    key={href}
                    href={href}
                    className="group relative flex items-center space-x-1 text-sm font-medium transition-colors"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center space-x-1 ${
                        pathname === '/jobs'
                          ? 'text-blue-500'
                          : 'text-gray-600 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400'
                      }`}
                    >
                      <ClipboardDocumentListIcon className="h-4 w-4" />
                      <span>{label}</span>
                    </motion.div>
                  </Link>
                );
              }
              return (
                <Link
                  key={href}
                  href={href}
                  className="group relative"
                >
                  <motion.span
                    whileHover={{ y: -2 }}
                    className={`relative text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-blue-500'
                        : 'text-gray-600 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400'
                    }`}
                  >
                    {label}
                  </motion.span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500"
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <UserMenu />
            {deviceType === 'mobile' && <MobileMenu navLinks={navLinks} />}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
