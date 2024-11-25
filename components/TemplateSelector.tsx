'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { resumeTemplates, ResumeTemplate } from './resume-templates';

interface TemplateSelectorProps {
  onSelect: (template: ResumeTemplate) => void;
  selectedTemplateId?: string;
}

export default function TemplateSelector({
  onSelect,
  selectedTemplateId,
}: TemplateSelectorProps) {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Choose a Template</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {resumeTemplates.map((template) => (
          <motion.div
            key={template.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative rounded-lg overflow-hidden cursor-pointer transition-all ${
              selectedTemplateId === template.id
                ? 'ring-2 ring-blue-500 ring-offset-2'
                : 'hover:shadow-xl'
            }`}
            onMouseEnter={() => setHoveredTemplate(template.id)}
            onMouseLeave={() => setHoveredTemplate(null)}
            onClick={() => onSelect(template)}
          >
            {/* Template Preview Image */}
            <div className="relative aspect-[3/4] bg-gray-100">
              <Image
                src={template.preview}
                alt={template.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Template Info Overlay */}
            <AnimatePresence>
              {hoveredTemplate === template.id && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute inset-0 bg-black/70 p-4 flex flex-col justify-end"
                >
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {template.name}
                  </h3>
                  <p className="text-gray-200 text-sm">{template.description}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Selected Indicator */}
            {selectedTemplateId === template.id && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
