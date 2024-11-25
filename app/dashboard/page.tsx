'use client';

import { motion } from 'framer-motion';
import StatsCard from '@/components/dashboard/StatsCard';
import ResumeCard from '@/components/dashboard/ResumeCard';

// Mock data - replace with real data later
const mockStats = [
  {
    title: 'Total Resumes',
    value: 12,
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    trend: { value: 20, isPositive: true },
  },
  {
    title: 'Applications Sent',
    value: 48,
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
        />
      </svg>
    ),
    trend: { value: 15, isPositive: true },
  },
  {
    title: 'Interview Rate',
    value: '35%',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    trend: { value: 5, isPositive: true },
  },
  {
    title: 'AI Improvements',
    value: 28,
    icon: (
      <svg
        className="w-6 h-6"
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
    ),
    trend: { value: 40, isPositive: true },
  },
];

const mockResumes = [
  {
    title: 'Software Engineer Resume',
    lastModified: '2 days ago',
    status: 'complete' as const,
    industry: 'Technology',
  },
  {
    title: 'Product Manager Draft',
    lastModified: '5 hours ago',
    status: 'draft' as const,
    industry: 'Product Management',
  },
  {
    title: 'Data Scientist Resume',
    lastModified: '1 week ago',
    status: 'complete' as const,
    industry: 'Data Science',
  },
];

export default function Dashboard() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Create New Resume
          </motion.button>
        </div>

        {/* Stats Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {mockStats.map((stat, index) => (
            <motion.div key={stat.title} variants={item}>
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Recent Activity
          </h2>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="space-y-4">
              {[
                'Updated Software Engineer Resume - 2 hours ago',
                'Created new Product Manager Resume - 1 day ago',
                'Exported Data Scientist Resume as PDF - 3 days ago',
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center text-sm text-gray-400"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                  {activity}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resumes Grid */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Your Resumes</h2>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {mockResumes.map((resume, index) => (
              <motion.div key={resume.title} variants={item}>
                <ResumeCard
                  {...resume}
                  onView={() => console.log('View', resume.title)}
                  onEdit={() => console.log('Edit', resume.title)}
                  onDelete={() => console.log('Delete', resume.title)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
