'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OptimizeExperienceButtonProps {
  text: string;
  role: string;
  company: string;
  onOptimized: (optimizedText: string) => void;
}

export default function OptimizeExperienceButton({
  text,
  role,
  company,
  onOptimized,
}: OptimizeExperienceButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOptimize = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/optimize-experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, role, company }),
      });

      if (!response.ok) {
        throw new Error('Failed to optimize text');
      }

      const data = await response.json();
      if (data.optimizedText) {
        onOptimized(data.optimizedText);
      }
    } catch (err) {
      setError('Failed to optimize text. Please try again.');
      console.error('Error optimizing text:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleOptimize}
        disabled={isLoading || !text.trim()}
        className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
          ${
            isLoading
              ? 'bg-purple-500/50 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          }
          ${!text.trim() && 'opacity-50 cursor-not-allowed'}
        `}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        )}
        <span className="text-white">
          {isLoading ? 'Optimizing...' : 'Optimize with AI'}
        </span>
      </motion.button>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 mt-2 w-48 p-2 text-sm text-red-500 bg-gray-800 rounded-md shadow-lg"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
