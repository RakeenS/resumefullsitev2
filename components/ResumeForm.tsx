'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import OptimizeButton from './OptimizeButton';
import OptimizeExperienceButton from './OptimizeExperienceButton';
import UploadResumeButton from './UploadResumeButton';

interface ResumeFormProps {
  resumeData: any;
  onUpdateResume: (section: string, data: any) => void;
}

export default function ResumeForm({ resumeData, onUpdateResume }: ResumeFormProps) {
  const [activeSection, setActiveSection] = useState('personalInfo');

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdateResume('personalInfo', {
      ...resumeData.personalInfo,
      [name]: value
    });
  };

  const handleAddExperience = () => {
    onUpdateResume('experience', [
      ...resumeData.experience,
      { company: '', position: '', startDate: '', endDate: '', description: '' }
    ]);
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const newExperience = [...resumeData.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    onUpdateResume('experience', newExperience);
  };

  const handleRemoveExperience = (index: number) => {
    onUpdateResume('experience', resumeData.experience.filter((_: any, i: number) => i !== index));
  };

  const handleAddSkill = (skill: string) => {
    if (skill.trim() && !resumeData.skills.includes(skill.trim())) {
      onUpdateResume('skills', [...resumeData.skills, skill.trim()]);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    onUpdateResume('skills', resumeData.skills.filter((s: string) => s !== skill));
  };

  return (
    <div className="space-y-8">
      {/* Section Navigation */}
      <nav className="flex space-x-2 overflow-x-auto pb-2">
        {['personalInfo', 'experience', 'education', 'skills'].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === section
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Personal Information Section */}
          {activeSection === 'personalInfo' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={resumeData.personalInfo.fullName}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={resumeData.personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={resumeData.personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="(123) 456-7890"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={resumeData.personalInfo.location}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="City, Country"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300">Professional Title</label>
                  <input
                    type="text"
                    name="title"
                    value={resumeData.personalInfo.title}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Software Engineer"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300">Professional Summary</label>
                  <textarea
                    name="summary"
                    value={resumeData.personalInfo.summary}
                    onChange={handlePersonalInfoChange}
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Brief professional summary..."
                  />
                  <div className="mt-2 flex justify-end">
                    <OptimizeButton
                      text={resumeData.personalInfo.summary}
                      onOptimized={(optimizedText) =>
                        handlePersonalInfoChange({
                          target: {
                            name: 'summary',
                            value: optimizedText,
                          },
                        } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Experience Section */}
          {activeSection === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Work Experience</h2>
                <button
                  onClick={handleAddExperience}
                  className="inline-flex items-center px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Experience
                </button>
              </div>
              
              <div className="space-y-6">
                {resumeData.experience.map((exp: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 relative"
                  >
                    <button
                      onClick={() => handleRemoveExperience(index)}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Company Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Position</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Job Title"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="MM/YYYY"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">End Date</label>
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="MM/YYYY or Present"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="block text-sm font-medium text-gray-200">
                          Description
                        </label>
                        <textarea
                          value={exp.description}
                          onChange={(e) =>
                            handleExperienceChange(index, 'description', e.target.value)
                          }
                          rows={4}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="Describe your responsibilities and achievements..."
                        />
                        <div className="flex justify-end">
                          <OptimizeExperienceButton
                            text={exp.description}
                            role={exp.position}
                            company={exp.company}
                            onOptimized={(optimizedText) =>
                              handleExperienceChange(index, 'description', optimizedText)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Section */}
          {activeSection === 'skills' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Skills</h2>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add a skill..."
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddSkill((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add a skill..."]') as HTMLInputElement;
                      handleAddSkill(input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill: string, index: number) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 text-blue-400 hover:text-blue-300"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Resume Builder</h1>
        <div className="flex space-x-4">
          <UploadResumeButton
            onUploadComplete={(data) => {
              // Update form data with parsed resume data
              // setFormData(data);
              onUpdateResume('all', data);
            }}
          />
          {/* <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Export PDF
          </button> */}
        </div>
      </div>
    </div>
  );
}
