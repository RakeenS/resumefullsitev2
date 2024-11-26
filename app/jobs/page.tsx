'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import JobColumn from '@/components/jobs/JobColumn';

const JOB_STATUSES = [
  'Applied',
  'Phone Screen',
  'Technical Interview',
  'Final Interview',
  'Offer',
];

interface Job {
  id: string;
  company: string;
  position: string;
  location: string;
  status: string;
  date_applied: string;
  salary?: string;
  notes?: string;
}

export default function JobTracker() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClientComponentClient();
  const router = useRouter();

  const [newJob, setNewJob] = useState<Partial<Job>>({
    company: '',
    position: '',
    location: '',
    status: 'Applied',
    date_applied: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        const { data: jobs, error } = await supabase
          .from('jobs')
          .select('*')
          .order('date_applied', { ascending: false });

        if (error) throw error;
        setJobs(jobs || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to load jobs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [supabase, router]);

  const handleAddJob = async () => {
    if (!newJob.company || !newJob.position) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('jobs')
        .insert([
          {
            ...newJob,
            user_id: session.user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setJobs([data, ...jobs]);
      setNewJob({
        company: '',
        position: '',
        location: '',
        status: 'Applied',
        date_applied: new Date().toISOString().split('T')[0],
      });
      setIsModalOpen(false);
      toast.success('Job added successfully');
    } catch (error) {
      console.error('Error adding job:', error);
      toast.error('Failed to add job');
    }
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setNewJob(job);
    setIsModalOpen(true);
  };

  const handleUpdateJob = async () => {
    if (!editingJob || !newJob.company || !newJob.position) return;

    try {
      const { error } = await supabase
        .from('jobs')
        .update({
          ...newJob,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingJob.id);

      if (error) throw error;

      setJobs(jobs.map((job) =>
        job.id === editingJob.id
          ? { ...job, ...newJob }
          : job
      ));
      setEditingJob(null);
      setNewJob({
        company: '',
        position: '',
        location: '',
        status: 'Applied',
        date_applied: new Date().toISOString().split('T')[0],
      });
      setIsModalOpen(false);
      toast.success('Job updated successfully');
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Failed to update job');
    }
  };

  const handleDeleteJob = async (id: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setJobs(jobs.filter((job) => job.id !== id));
      toast.success('Job deleted successfully');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', jobId);

      if (error) throw error;

      setJobs(jobs.map((job) =>
        job.id === jobId
          ? { ...job, status: newStatus }
          : job
      ));
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Job Applications</h1>
          <button
            onClick={() => {
              setEditingJob(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Job
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {JOB_STATUSES.map((status) => (
            <div
              key={status}
              className="bg-gray-800/50 p-4 rounded-lg min-h-[24rem]"
            >
              <JobColumn
                title={status}
                jobs={jobs.filter((job) => job.status === status)}
                onEdit={handleEditJob}
                onDelete={handleDeleteJob}
              />
            </div>
          ))}
        </div>

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsModalOpen(false);
              }}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
              >
                <h2 className="text-xl font-semibold mb-4">
                  {editingJob ? 'Edit Job' : 'Add New Job'}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={newJob.company || ''}
                      onChange={(e) =>
                        setNewJob({ ...newJob, company: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Position
                    </label>
                    <input
                      type="text"
                      value={newJob.position || ''}
                      onChange={(e) =>
                        setNewJob({ ...newJob, position: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={newJob.location || ''}
                      onChange={(e) =>
                        setNewJob({ ...newJob, location: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Status
                    </label>
                    <select
                      value={newJob.status || 'Applied'}
                      onChange={(e) =>
                        setNewJob({ ...newJob, status: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {JOB_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Date Applied
                    </label>
                    <input
                      type="date"
                      value={newJob.date_applied || ''}
                      onChange={(e) =>
                        setNewJob({ ...newJob, date_applied: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Salary Range (Optional)
                    </label>
                    <input
                      type="text"
                      value={newJob.salary || ''}
                      onChange={(e) =>
                        setNewJob({ ...newJob, salary: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. $80,000 - $100,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={newJob.notes || ''}
                      onChange={(e) =>
                        setNewJob({ ...newJob, notes: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingJob ? handleUpdateJob : handleAddJob}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingJob ? 'Update' : 'Add'} Job
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
