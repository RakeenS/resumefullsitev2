'use client';

import { motion } from 'framer-motion';
import { Job } from '@/types/job';

interface JobColumnProps {
  title: string;
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (jobId: string, newStatus: string) => void;
}

export default function JobColumn({ title, jobs, onEdit, onDelete, onStatusChange }: JobColumnProps) {
  return (
    <div className="bg-gray-800/50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-gray-700/50 p-4 rounded-lg space-y-2 hover:bg-gray-700 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{job.position}</h4>
                <p className="text-sm text-gray-300">{job.company}</p>
                {job.location && (
                  <p className="text-sm text-gray-400">{job.location}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(job)}
                  className="p-1 hover:text-blue-400 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(job.id)}
                  className="p-1 hover:text-red-400 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {job.salary && (
              <p className="text-sm text-gray-400">Salary: {job.salary}</p>
            )}
            {job.notes && (
              <p className="text-sm text-gray-400 line-clamp-2">{job.notes}</p>
            )}
            <p className="text-xs text-gray-500">
              Applied: {new Date(job.date_applied).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
