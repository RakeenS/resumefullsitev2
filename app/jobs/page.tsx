'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import JobColumn from '@/components/jobs/JobColumn';
import { Job } from '@/components/jobs/JobCard';

const JOB_STATUSES = [
  'Applied',
  'Phone Screen',
  'Technical Interview',
  'Final Interview',
  'Offer',
];

export default function JobTracker() {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      company: 'Example Tech',
      position: 'Senior Developer',
      location: 'Remote',
      status: 'Applied',
      dateApplied: '2024-01-15',
      salary: '$120,000 - $150,000',
      notes: 'Applied through company website',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const [newJob, setNewJob] = useState<Partial<Job>>({
    company: '',
    position: '',
    location: '',
    status: 'Applied',
    dateApplied: new Date().toISOString().split('T')[0],
  });

  const handleAddJob = () => {
    if (!newJob.company || !newJob.position) return;

    const job: Job = {
      id: Date.now().toString(),
      company: newJob.company,
      position: newJob.position,
      location: newJob.location || 'Not specified',
      status: newJob.status || 'Applied',
      dateApplied: newJob.dateApplied || new Date().toISOString().split('T')[0],
      salary: newJob.salary,
      notes: newJob.notes,
    };

    setJobs([...jobs, job]);
    setNewJob({
      company: '',
      position: '',
      location: '',
      status: 'Applied',
      dateApplied: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(false);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setNewJob(job);
    setIsModalOpen(true);
  };

  const handleUpdateJob = () => {
    if (!editingJob || !newJob.company || !newJob.position) return;

    const updatedJobs = jobs.map((job) =>
      job.id === editingJob.id
        ? {
            ...job,
            ...newJob,
          }
        : job
    );

    setJobs(updatedJobs);
    setEditingJob(null);
    setNewJob({
      company: '',
      position: '',
      location: '',
      status: 'Applied',
      dateApplied: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(false);
  };

  const handleDeleteJob = (id: string) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

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
                      value={newJob.dateApplied || ''}
                      onChange={(e) =>
                        setNewJob({ ...newJob, dateApplied: e.target.value })
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
