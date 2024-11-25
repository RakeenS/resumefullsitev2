'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

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

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                CareerQuestAI
              </span>
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              if (label === 'Job Tracker') {
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                      pathname === '/jobs'
                        ? 'text-blue-500'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <ClipboardDocumentListIcon className="h-4 w-4" />
                    <span>{label}</span>
                  </Link>
                );
              }
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative group"
                >
                  <motion.span
                    whileHover={{ y: -2 }}
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-blue-500'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {label}
                  </motion.span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="text-gray-300 hover:text-white p-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </motion.button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
