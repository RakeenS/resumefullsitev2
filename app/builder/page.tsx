'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Wand2, Plus, Trash2, User, Briefcase, GraduationCap, Lightbulb, FileDown, FileType2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ResumePreview from '@/components/ResumePreview';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { optimizeText } from '@/lib/openai';

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    company: string;
    title: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    graduationDate: string;
  }>;
  skills: string[];
}

interface OptimizationDialog {
  isOpen: boolean;
  originalText: string;
  optimizedText: string;
  section: 'summary' | 'experience';
  experienceIndex: number | null;
}

const initialResumeData: ResumeData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    summary: ''
  },
  experience: [{
    company: '',
    title: '',
    startDate: '',
    endDate: '',
    description: ''
  }],
  education: [{
    school: '',
    degree: '',
    field: '',
    graduationDate: ''
  }],
  skills: []
};

export default function BuilderPage() {
  const { toast } = useToast();
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [optimizationDialog, setOptimizationDialog] = useState<OptimizationDialog>({
    isOpen: false,
    originalText: '',
    optimizedText: '',
    section: 'summary',
    experienceIndex: null,
  });

  const handlePersonalInfoChange = (field: keyof ResumeData['personalInfo'], value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const handleExperienceChange = (index: number, field: keyof ResumeData['experience'][0], value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const handleEducationChange = (index: number, field: keyof ResumeData['education'][0], value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        title: '',
        startDate: '',
        endDate: '',
        description: ''
      }]
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        school: '',
        degree: '',
        field: '',
        graduationDate: ''
      }]
    }));
  };

  const removeExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const removeEducation = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !resumeData.skills.includes(newSkill.trim())) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleOptimize = async (text: string, section: 'summary' | 'experience', experienceIndex?: number) => {
    try {
      setIsOptimizing(true);
      const prompt = section === 'summary'
        ? `Please optimize this professional summary to be more impactful and ATS-friendly. Focus on highlighting key achievements, skills, and career goals. Make it concise but comprehensive. Here's the current summary:\n\n"${text}"`
        : `Please optimize this work experience description to be more impactful and ATS-friendly. Focus on quantifiable achievements, leadership, and specific skills. Use strong action verbs and highlight measurable results. Here's the current description:\n\n"${text}"`;

      const optimizedText = await optimizeText(text, prompt);
      setOptimizationDialog({
        isOpen: true,
        originalText: text,
        optimizedText,
        section,
        experienceIndex: experienceIndex ?? null,
      });
    } catch (error) {
      console.error('Error optimizing content:', error);
      toast({
        variant: "destructive",
        title: "Optimization Failed",
        description: "There was an error optimizing your content. Please try again.",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleOptimizeFurther = async () => {
    try {
      setIsOptimizing(true);
      const { optimizedText: currentText, section } = optimizationDialog;
      
      const prompt = section === 'summary'
        ? `Please further enhance this professional summary. Make it even more impactful while maintaining its authenticity. Focus on making it more concise, powerful, and ATS-friendly. Here's the current version:\n\n"${currentText}"`
        : `Please further enhance this work experience description. Make it even more impactful while maintaining its authenticity. Focus on strengthening action verbs, adding more measurable results, and making it more ATS-friendly. Here's the current version:\n\n"${currentText}"`;
      
      const furtherOptimizedText = await optimizeText(currentText, prompt);
      setOptimizationDialog(prev => ({
        ...prev,
        optimizedText: furtherOptimizedText,
      }));
    } catch (error) {
      console.error('Error optimizing content further:', error);
      toast({
        variant: "destructive",
        title: "Further Optimization Failed",
        description: "There was an error optimizing your content further. Please try again.",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApplyOptimization = () => {
    const { section, optimizedText, experienceIndex } = optimizationDialog;
    
    if (section === 'summary') {
      setResumeData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          summary: optimizedText
        }
      }));
    } else if (section === 'experience' && experienceIndex !== null) {
      setResumeData(prev => ({
        ...prev,
        experience: prev.experience.map((exp, idx) =>
          idx === experienceIndex
            ? { ...exp, description: optimizedText }
            : exp
        )
      }));
    }
    
    setOptimizationDialog(prev => ({ ...prev, isOpen: false }));
  };

  const handleExport = async (format: 'pdf' | 'docx') => {
    // TODO: Implement actual export functionality
    console.log(`Exporting as ${format}`);
    // This will be implemented to generate and download the resume in the selected format
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                Resume Builder
              </h1>
              <p className="text-gray-300">Create your professional resume with AI assistance</p>
            </div>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
                    <FileDown className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    <FileType2 className="w-4 h-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('docx')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export as Word
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link 
                href="/upload-resume" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Resume
              </Link>
            </div>
          </div>
        </div>

        {/* Split View Container */}
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Form Section - Left Side */}
          <div className="w-full lg:w-1/2">
            <div className="sticky top-8 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 overflow-hidden"
              >
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="w-full bg-gray-800/50 p-0 h-14 border-b border-gray-700 grid grid-cols-4">
                    <TabsTrigger
                      value="personal"
                      className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-700/50 data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none h-full"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Personal
                    </TabsTrigger>
                    <TabsTrigger
                      value="experience"
                      className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-700/50 data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none h-full"
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      Experience
                    </TabsTrigger>
                    <TabsTrigger
                      value="education"
                      className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-700/50 data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none h-full"
                    >
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Education
                    </TabsTrigger>
                    <TabsTrigger
                      value="skills"
                      className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-700/50 data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none h-full"
                    >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Skills
                    </TabsTrigger>
                  </TabsList>

                  <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto custom-scrollbar">
                    <TabsContent value="personal" className="space-y-4 focus:outline-none">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Full Name"
                          value={resumeData.personalInfo.name}
                          onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                        />
                        <Input
                          placeholder="Email"
                          type="email"
                          value={resumeData.personalInfo.email}
                          onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                        />
                        <Input
                          placeholder="Phone"
                          value={resumeData.personalInfo.phone}
                          onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                        />
                        <Input
                          placeholder="Location"
                          value={resumeData.personalInfo.location}
                          onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                        />
                      </div>
                      <div className="space-y-4">
                        <Label htmlFor="summary">Professional Summary</Label>
                        <Textarea
                          id="summary"
                          value={resumeData.personalInfo.summary}
                          onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                          className="h-32"
                          placeholder="Write a professional summary that highlights your key achievements and career goals..."
                        />
                        <Button 
                          onClick={() => handleOptimize(resumeData.personalInfo.summary, 'summary')}
                          disabled={isOptimizing}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <Wand2 className="w-4 h-4 mr-2" />
                          {isOptimizing ? 'Optimizing Summary...' : 'AI Optimize Summary'}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="experience" className="space-y-4 focus:outline-none">
                      <div className="flex justify-end mb-4">
                        <Button onClick={addExperience} variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Experience
                        </Button>
                      </div>
                      <AnimatePresence>
                        {resumeData.experience.map((exp, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4 mb-6 pb-6 border-b last:border-b-0"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                  placeholder="Company"
                                  value={exp.company}
                                  onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                />
                                <Input
                                  placeholder="Job Title"
                                  value={exp.title}
                                  onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                                />
                                <Input
                                  placeholder="Start Date"
                                  type="month"
                                  value={exp.startDate}
                                  onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                                />
                                <Input
                                  placeholder="End Date"
                                  type="month"
                                  value={exp.endDate}
                                  onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeExperience(index)}
                                className="ml-4 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="space-y-4">
                              <Label htmlFor={`description-${index}`}>Description</Label>
                              <Textarea
                                id={`description-${index}`}
                                value={exp.description}
                                onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                className="h-32"
                                placeholder="Describe your responsibilities and achievements..."
                              />
                              <Button 
                                onClick={() => handleOptimize(exp.description, 'experience', index)}
                                disabled={isOptimizing}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                              >
                                <Wand2 className="w-4 h-4 mr-2" />
                                {isOptimizing ? 'Optimizing Description...' : 'AI Optimize Description'}
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </TabsContent>

                    <TabsContent value="education" className="space-y-4 focus:outline-none">
                      <div className="flex justify-end mb-4">
                        <Button onClick={addEducation} variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Education
                        </Button>
                      </div>
                      <AnimatePresence>
                        {resumeData.education.map((edu, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4 mb-6 pb-6 border-b last:border-b-0"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                  placeholder="School"
                                  value={edu.school}
                                  onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                                />
                                <Input
                                  placeholder="Degree"
                                  value={edu.degree}
                                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                />
                                <Input
                                  placeholder="Field of Study"
                                  value={edu.field}
                                  onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                                />
                                <Input
                                  placeholder="Graduation Date"
                                  type="month"
                                  value={edu.graduationDate}
                                  onChange={(e) => handleEducationChange(index, 'graduationDate', e.target.value)}
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeEducation(index)}
                                className="ml-4 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </TabsContent>

                    <TabsContent value="skills" className="space-y-4 focus:outline-none">
                      <div className="flex gap-2 mb-4">
                        <Input
                          placeholder="Add a skill"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                        />
                        <Button onClick={addSkill} variant="outline">Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 group hover:bg-gray-200"
                          >
                            {skill}
                            <button
                              onClick={() => removeSkill(skill)}
                              className="w-4 h-4 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </motion.div>
            </div>
          </div>

          {/* Preview Section - Right Side */}
          <div className="w-full lg:w-1/2">
            <div className="sticky top-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 overflow-hidden"
              >
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <h2 className="text-lg font-semibold">Live Preview</h2>
                </div>
                <div className="p-6 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
                  <ResumePreview resumeData={{
                    personalInfo: {
                      fullName: resumeData.personalInfo.name,
                      email: resumeData.personalInfo.email,
                      phone: resumeData.personalInfo.phone,
                      location: resumeData.personalInfo.location,
                      title: '', // Add a title field if needed
                      summary: resumeData.personalInfo.summary,
                    },
                    experience: resumeData.experience.map(exp => ({
                      company: exp.company,
                      position: exp.title,
                      startDate: exp.startDate,
                      endDate: exp.endDate,
                      description: exp.description,
                    })),
                    education: resumeData.education,
                    skills: resumeData.skills,
                  }} />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Optimization Dialog */}
      <Dialog open={optimizationDialog.isOpen} onOpenChange={(open) => setOptimizationDialog(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>AI-Optimized Content</DialogTitle>
            <DialogDescription>
              Review the AI-optimized version of your content. You can apply these changes, optimize further, or keep your original text.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Original Text</Label>
              <div className="p-3 rounded-md bg-gray-800/50 text-gray-300">
                {optimizationDialog.originalText}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Optimized Text</Label>
              <div className="p-3 rounded-md bg-gray-800/50 text-gray-300">
                {optimizationDialog.optimizedText}
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setOptimizationDialog(prev => ({ ...prev, isOpen: false }))}
              className="bg-gray-800 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleOptimizeFurther}
              disabled={isOptimizing}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isOptimizing ? 'Optimizing...' : 'Optimize Further'}
            </Button>
            <Button
              onClick={handleApplyOptimization}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Apply Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(107, 114, 128, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }
      `}</style>
    </main>
  );
}
