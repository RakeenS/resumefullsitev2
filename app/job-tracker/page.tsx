'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, BriefcaseIcon, BuildingOfficeIcon, CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import AddJobForm from './components/AddJobForm';

type JobApplication = {
  id: string;
  company: string;
  position: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  date_applied: string;
  notes: string;
};

const statusColors = {
  Applied: 'bg-blue-500/10 text-blue-500',
  Interview: 'bg-yellow-500/10 text-yellow-500',
  Offer: 'bg-green-500/10 text-green-500',
  Rejected: 'bg-red-500/10 text-red-500',
};

export default function JobTracker() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('date_applied', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const stats = [
    { name: 'Total Applications', value: applications.length, icon: BriefcaseIcon },
    { name: 'Interviews', value: applications.filter(app => app.status === 'Interview').length, icon: BuildingOfficeIcon },
    { name: 'Success Rate', value: `${Math.round((applications.filter(app => app.status === 'Offer').length / applications.length) * 100 || 0)}%`, icon: ChartBarIcon },
    { name: 'This Week', value: applications.filter(app => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(app.date_applied) > weekAgo;
    }).length, icon: CalendarIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Job Applications Tracker
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400"
          >
            Keep track of your job search journey in one place
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{stat.name}</p>
                  <p className="text-2xl font-semibold text-white mt-1">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-gray-400" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Job Button */}
        <motion.button
          onClick={() => setIsAddingJob(true)}
          className="mb-8 inline-flex items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Application
        </motion.button>

        {/* Applications List */}
        <div className="grid gap-6">
          <AnimatePresence>
            {applications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{app.position}</h3>
                    <p className="text-gray-400 mt-1">{app.company}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[app.status]}`}>
                    {app.status}
                  </span>
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  <p>Applied: {new Date(app.date_applied).toLocaleDateString()}</p>
                  {app.notes && <p className="mt-2">{app.notes}</p>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto" />
            <p className="mt-4 text-gray-400">Loading applications...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && applications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-white">No applications yet</h3>
            <p className="mt-2 text-gray-400">Start by adding your first job application</p>
          </motion.div>
        )}

        {/* Add Job Form Modal */}
        <AnimatePresence>
          {isAddingJob && (
            <AddJobForm
              onClose={() => setIsAddingJob(false)}
              onSuccess={fetchApplications}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
