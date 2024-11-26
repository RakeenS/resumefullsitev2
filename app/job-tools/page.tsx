'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

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
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Email Generator States
  const [emailJobInfo, setEmailJobInfo] = useState('');
  const [emailJobStage, setEmailJobStage] = useState('');
  const [emailTone, setEmailTone] = useState('');
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState('');

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        if (session?.user) {
          fetchSavedItems(session.user.id);
        }
      } catch (error) {
        console.error('Error checking user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        await fetchSavedItems(session.user.id);
      } else {
        setSavedItems([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const fetchSavedItems = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('saved_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedItems(data || []);
    } catch (error) {
      console.error('Error fetching saved items:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch saved items.',
        variant: 'destructive',
      });
    }
  };

  const handleSaveCoverLetter = async () => {
    if (!generatedCoverLetter || !user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save cover letters.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      // First check if we can access the table
      const { data: testData, error: testError } = await supabase
        .from('saved_items')
        .select('id')
        .limit(1);

      if (testError) {
        console.error('Error accessing saved_items table:', testError);
        throw new Error('Database access error');
      }

      // Now try to insert
      const { data, error } = await supabase
        .from('saved_items')
        .insert({
          user_id: user.id,
          content: generatedCoverLetter,
          type: 'cover_letter',
          metadata: {
            name,
            jobUrl,
            jobDescription,
          },
        })
        .select()
        .single();

      if (error) {
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
        });
        throw error;
      }

      console.log('Successfully saved cover letter:', data);

      toast({
        title: 'Success',
        description: 'Cover letter saved successfully!',
      });

      // Fetch updated saved items
      await fetchSavedItems(user.id);
    } catch (error: any) {
      console.error('Full error object:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save cover letter. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEmail = async () => {
    if (!generatedEmail || !user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save emails.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      // First check if we can access the table
      const { data: testData, error: testError } = await supabase
        .from('saved_items')
        .select('id')
        .limit(1);

      if (testError) {
        console.error('Error accessing saved_items table:', testError);
        throw new Error('Database access error');
      }

      // Now try to insert
      const { data, error } = await supabase
        .from('saved_items')
        .insert({
          user_id: user.id,
          content: generatedEmail,
          type: 'email',
          metadata: {
            jobInfo: emailJobInfo,
            stage: emailJobStage,
            tone: emailTone,
          },
        })
        .select()
        .single();

      if (error) {
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
        });
        throw error;
      }

      console.log('Successfully saved email:', data);

      toast({
        title: 'Success',
        description: 'Email saved successfully!',
      });

      // Fetch updated saved items
      await fetchSavedItems(user.id);
    } catch (error: any) {
      console.error('Full error object:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!name) {
      toast({
        title: "Name Required",
        description: "Please enter your name to generate a cover letter.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      
      const response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          jobDescription: jobDescription || 'General cover letter',
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Job Tools</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
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
              
              <DialogContent className="sm:max-w-[800px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Generate Cover Letter
                  </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-4">
                    <div className="group">
                      <label className="text-sm font-medium text-gray-300 mb-2 block group-hover:text-blue-400 transition-colors">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 transition-all duration-200 focus:ring-2 focus:ring-blue-500 hover:border-gray-600"
                      />
                    </div>
                    <div className="group">
                      <label className="text-sm font-medium text-gray-300 mb-2 block group-hover:text-blue-400 transition-colors">
                        Job URL <span className="text-gray-500">(Optional)</span>
                      </label>
                      <Input
                        value={jobUrl}
                        onChange={(e) => setJobUrl(e.target.value)}
                        placeholder="https://example.com/job-posting"
                        className="bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 transition-all duration-200 focus:ring-2 focus:ring-blue-500 hover:border-gray-600"
                      />
                    </div>
                    <div className="group">
                      <label className="text-sm font-medium text-gray-300 mb-2 block group-hover:text-blue-400 transition-colors">
                        Job Description <span className="text-gray-500">(Optional)</span>
                      </label>
                      <Textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description here for a more tailored cover letter..."
                        className="h-[200px] bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 transition-all duration-200 focus:ring-2 focus:ring-blue-500 hover:border-gray-600"
                      />
                    </div>
                    <Button
                      onClick={handleGenerateCoverLetter}
                      disabled={isGenerating || !name}
                      className={`w-full relative overflow-hidden group ${
                        isGenerating ? 'bg-blue-600/50' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                      } hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        initial={{ x: '-100%' }}
                        animate={isGenerating ? { x: '100%' } : { x: '-100%' }}
                        transition={{ 
                          duration: 1.5,
                          repeat: isGenerating ? Infinity : 0,
                          ease: 'linear'
                        }}
                      />
                      <div className="flex items-center justify-center space-x-2">
                        {isGenerating ? (
                          <>
                            <svg
                              className="animate-spin h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-5 h-5 text-white transform group-hover:scale-110 transition-transform duration-200"
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
                            <span className="font-medium">Generate Cover Letter</span>
                          </>
                        )}
                      </div>
                    </Button>
                  </div>
                  
                  <div>
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-white mb-2">Generated Cover Letter</h3>
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg" />
                        <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 h-[400px] overflow-y-auto text-gray-100 custom-scrollbar border border-gray-700">
                          {generatedCoverLetter ? (
                            <div className="whitespace-pre-wrap">{generatedCoverLetter}</div>
                          ) : (
                            <div className="text-gray-500 italic">
                              Your generated cover letter will appear here...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {generatedCoverLetter && (
                      <div className="mt-4 flex items-center space-x-4">
                        <Button
                          onClick={handleSaveCoverLetter}
                          disabled={isSaving}
                          variant="secondary"
                          className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                        >
                          {isSaving ? (
                            <div className="flex items-center space-x-2">
                              <svg
                                className="animate-spin h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              <span>Saving...</span>
                            </div>
                          ) : (
                            'Save Cover Letter'
                          )}
                        </Button>
                        <Button
                          onClick={() => {
                            navigator.clipboard.writeText(generatedCoverLetter);
                            toast({
                              title: 'Copied!',
                              description: 'Cover letter copied to clipboard.',
                            });
                          }}
                          variant="outline"
                          className="flex-1 border-gray-700 hover:bg-gray-700/50 text-gray-100 transition-all duration-300"
                        >
                          Copy to Clipboard
                        </Button>
                      </div>
                    )}
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
              
              <DialogContent className="sm:max-w-[800px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Generate Email Response
                  </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-4">
                    <div className="group">
                      <label className="text-sm font-medium text-gray-300 mb-2 block group-hover:text-blue-400 transition-colors">
                        Job Information <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        value={emailJobInfo}
                        onChange={(e) => setEmailJobInfo(e.target.value)}
                        placeholder="Enter relevant job information (e.g., company name, position, interview details)..."
                        className="h-[120px] bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 transition-all duration-200 focus:ring-2 focus:ring-blue-500 hover:border-gray-600"
                      />
                    </div>
                    <div className="group">
                      <label className="text-sm font-medium text-gray-300 mb-2 block group-hover:text-blue-400 transition-colors">
                        Job Stage <span className="text-red-500">*</span>
                      </label>
                      <Select value={emailJobStage} onValueChange={setEmailJobStage}>
                        <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-100 hover:border-gray-600 focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="Select job stage" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {JOB_STAGES.map((stage) => (
                            <SelectItem 
                              key={stage.value} 
                              value={stage.value}
                              className="text-gray-100 focus:bg-blue-500 focus:text-white hover:bg-blue-500/20"
                            >
                              {stage.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="group">
                      <label className="text-sm font-medium text-gray-300 mb-2 block group-hover:text-blue-400 transition-colors">
                        Email Tone <span className="text-red-500">*</span>
                      </label>
                      <Select value={emailTone} onValueChange={setEmailTone}>
                        <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-100 hover:border-gray-600 focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="Select email tone" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {EMAIL_TONES.map((tone) => (
                            <SelectItem 
                              key={tone.value} 
                              value={tone.value}
                              className="text-gray-100 focus:bg-blue-500 focus:text-white hover:bg-blue-500/20"
                            >
                              {tone.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleGenerateEmail}
                      disabled={isGeneratingEmail || !emailJobInfo || !emailJobStage || !emailTone}
                      className={`w-full relative overflow-hidden group ${
                        isGeneratingEmail ? 'bg-blue-600/50' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                      } hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        initial={{ x: '-100%' }}
                        animate={isGeneratingEmail ? { x: '100%' } : { x: '-100%' }}
                        transition={{ 
                          duration: 1.5,
                          repeat: isGeneratingEmail ? Infinity : 0,
                          ease: 'linear'
                        }}
                      />
                      <div className="flex items-center justify-center space-x-2">
                        {isGeneratingEmail ? (
                          <>
                            <svg
                              className="animate-spin h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-5 h-5 text-white transform group-hover:scale-110 transition-transform duration-200"
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
                            <span className="font-medium">Generate Email</span>
                          </>
                        )}
                      </div>
                    </Button>
                  </div>
                  
                  <div>
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-white mb-2">Generated Email</h3>
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg" />
                        <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 h-[400px] overflow-y-auto text-gray-100 custom-scrollbar border border-gray-700">
                          {generatedEmail ? (
                            <div className="whitespace-pre-wrap">{generatedEmail}</div>
                          ) : (
                            <div className="text-gray-500 italic">
                              Your generated email will appear here...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {generatedEmail && (
                      <div className="mt-4 flex items-center space-x-4">
                        <Button
                          onClick={handleSaveEmail}
                          disabled={isSaving}
                          variant="secondary"
                          className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                        >
                          {isSaving ? (
                            <div className="flex items-center space-x-2">
                              <svg
                                className="animate-spin h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              <span>Saving...</span>
                            </div>
                          ) : (
                            'Save Email'
                          )}
                        </Button>
                        <Button
                          onClick={() => {
                            navigator.clipboard.writeText(generatedEmail);
                            toast({
                              title: 'Copied!',
                              description: 'Email copied to clipboard.',
                            });
                          }}
                          variant="outline"
                          className="flex-1 border-gray-700 hover:bg-gray-700/50 text-gray-100 transition-all duration-300"
                        >
                          Copy to Clipboard
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Saved Items Section */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Saved Items</h3>
                {!user && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/login')}
                  >
                    Login to Save Items
                  </Button>
                )}
              </div>
              {savedItems.length === 0 ? (
                <p className="text-gray-400">
                  {!user 
                    ? "Login to view and save your generated content."
                    : "No saved items yet. Generate and save a cover letter or email to see it here."}
                </p>
              ) : (
                <div className="space-y-4">
                  {savedItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-gray-700/50 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">
                          {item.type === 'cover_letter' ? 'Cover Letter' : 'Email'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2">{item.content}</p>
                      <div className="mt-3 flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(item.content);
                            toast({
                              title: 'Copied!',
                              description: 'Content copied to clipboard.',
                            });
                          }}
                        >
                          Copy
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={async () => {
                            try {
                              const { error } = await supabase
                                .from('saved_items')
                                .delete()
                                .eq('id', item.id);
                              
                              if (error) throw error;
                              
                              toast({
                                title: 'Deleted!',
                                description: 'Item deleted successfully.',
                              });
                              
                              fetchSavedItems(user.id);
                            } catch (error) {
                              console.error('Error deleting item:', error);
                              toast({
                                title: 'Error',
                                description: 'Failed to delete item.',
                                variant: 'destructive',
                              });
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
