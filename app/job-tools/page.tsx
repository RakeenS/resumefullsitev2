'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const JOB_STAGES = [
  { value: 'application-followup', label: 'Application Follow-up' },
  { value: 'interview-followup', label: 'Interview Follow-up' },
  { value: 'offer-negotiation', label: 'Offer Negotiation' },
  { value: 'rejection-response', label: 'Rejection Response' },
  { value: 'general-inquiry', label: 'General Inquiry' }
];

const EMAIL_TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'formal', label: 'Formal' },
  { value: 'enthusiastic', label: 'Enthusiastic' },
  { value: 'grateful', label: 'Grateful' }
];

export default function JobTools() {
  // Cover Letter States
  const [name, setName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState('');

  // Email Generator States
  const [emailJobInfo, setEmailJobInfo] = useState('');
  const [emailJobStage, setEmailJobStage] = useState('');
  const [emailTone, setEmailTone] = useState('');
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState('');
  
  const { toast } = useToast();

  const handleGenerateCoverLetter = async () => {
    try {
      setIsGenerating(true);
      
      const response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          jobDescription,
          jobUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate cover letter');
      }

      setGeneratedCoverLetter(data.coverLetter);
      toast({
        title: "Success!",
        description: "Your cover letter has been generated.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate cover letter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateEmail = async () => {
    if (!emailJobInfo || !emailJobStage || !emailTone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGeneratingEmail(true);
      
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobInfo: emailJobInfo,
          stage: emailJobStage,
          tone: emailTone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate email');
      }

      setGeneratedEmail(data.email);
      toast({
        title: "Success!",
        description: "Your email has been generated.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Job Tools</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cover Letter Generator Card */}
          <Dialog>
            <DialogTrigger asChild>
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 cursor-pointer hover:border-blue-500 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Cover Letter Generator</h3>
                  <div className="text-blue-500 bg-blue-500/10 p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-400">Generate a personalized cover letter using AI based on the job description.</p>
              </motion.div>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Generate Cover Letter</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Your Full Name</label>
                    <Input
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Job URL (Optional)</label>
                    <Input
                      placeholder="https://example.com/job-posting"
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Job Description</label>
                    <Textarea
                      placeholder="Paste the job description here..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="h-40"
                    />
                  </div>
                  <button
                    onClick={handleGenerateCoverLetter}
                    disabled={isGenerating || !name || !jobDescription}
                    className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Cover Letter'}
                  </button>
                </div>
                
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Generated Cover Letter</label>
                  <div className="bg-gray-800 rounded-lg p-4 h-[400px] overflow-y-auto">
                    {generatedCoverLetter ? (
                      <div className="whitespace-pre-wrap text-gray-300">{generatedCoverLetter}</div>
                    ) : (
                      <div className="text-gray-500 italic">
                        Your generated cover letter will appear here...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Email Generator Card */}
          <Dialog>
            <DialogTrigger asChild>
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 cursor-pointer hover:border-blue-500 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Email Generator</h3>
                  <div className="text-blue-500 bg-blue-500/10 p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-400">Generate professional email responses for different job application stages.</p>
              </motion.div>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Generate Email Response</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Job Information</label>
                    <Textarea
                      placeholder="Paste the job description, details, or relevant information..."
                      value={emailJobInfo}
                      onChange={(e) => setEmailJobInfo(e.target.value)}
                      className="h-40"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Job Stage</label>
                    <Select value={emailJobStage} onValueChange={setEmailJobStage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_STAGES.map((stage) => (
                          <SelectItem key={stage.value} value={stage.value}>
                            {stage.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Email Tone</label>
                    <Select value={emailTone} onValueChange={setEmailTone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select email tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {EMAIL_TONES.map((tone) => (
                          <SelectItem key={tone.value} value={tone.value}>
                            {tone.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <button
                    onClick={handleGenerateEmail}
                    disabled={isGeneratingEmail || !emailJobInfo || !emailJobStage || !emailTone}
                    className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isGeneratingEmail ? 'Generating...' : 'Generate Email'}
                  </button>
                </div>
                
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Generated Email</label>
                  <div className="bg-gray-800 rounded-lg p-4 h-[400px] overflow-y-auto">
                    {generatedEmail ? (
                      <div className="whitespace-pre-wrap text-gray-300">{generatedEmail}</div>
                    ) : (
                      <div className="text-gray-500 italic">
                        Your generated email will appear here...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
