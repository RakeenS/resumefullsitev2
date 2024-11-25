'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

interface MobileMenuProps {
  navLinks: Array<{ href: string; label: string }>;
}

export default function MobileMenu({ navLinks }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="p-2 text-gray-300 hover:text-white focus:outline-none"
        aria-label="Toggle mobile menu"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={toggleMenu}
            />

            {/* Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-64 bg-gray-900 z-50 shadow-xl"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-end p-4">
                  <button
                    onClick={toggleMenu}
                    className="p-2 text-gray-300 hover:text-white focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <nav className="px-4 py-2">
                  {navLinks.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={toggleMenu}
                      className={`block py-3 px-4 text-base font-medium rounded-lg transition-colors ${
                        pathname === href
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {label === 'Job Tracker' && (
                          <ClipboardDocumentListIcon className="h-5 w-5" />
                        )}
                        <span>{label}</span>
                      </div>
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
