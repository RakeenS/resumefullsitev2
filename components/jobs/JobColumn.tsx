'use client';

import { motion } from 'framer-motion';
import { Job } from './JobCard';
import JobCard from './JobCard';

interface JobColumnProps {
  title: string;
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

export default function JobColumn({
  title,
  jobs,
  onEdit,
  onDelete,
}: JobColumnProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          {title}
          <span className="ml-2 px-2 py-1 text-sm bg-gray-700 rounded-full text-gray-300">
            {jobs.length}
          </span>
        </h3>
      </div>
      <div className="flex-1 space-y-4">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
