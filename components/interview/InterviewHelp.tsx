'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { User2, BookOpen, Sparkles } from 'lucide-react';

const INDUSTRIES = [
  { value: 'tech', label: 'Technology' },
  { value: 'finance', label: 'Finance' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'retail', label: 'Retail' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'education', label: 'Education' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'other', label: 'Other' }
];

interface InterviewResponse {
  question: string;
  answer: string;
  feedback: string;
  score: number;
}

export default function InterviewHelp() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'select' | 'mock' | 'knowledge'>('select');
  const [industry, setIndustry] = useState('');
  const [position, setPosition] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [responses, setResponses] = useState<InterviewResponse[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const resetInterview = () => {
    setMode('select');
    setIndustry('');
    setPosition('');
    setCurrentQuestion('');
    setUserAnswer('');
    setResponses([]);
    setIsGenerating(false);
  };

  const startMockInterview = async () => {
    console.log('Starting mock interview with:', { industry, position });
    
    if (!industry || !position) {
      console.log('Missing required fields:', { industry, position });
      toast({
        title: 'Error',
        description: 'Please select an industry and enter a position.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      console.log('Sending request to /api/interview');
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industry,
          position,
          isFirstQuestion: true
        }),
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        throw new Error(responseText || 'Failed to start interview');
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Invalid response format from server');
      }

      console.log('Parsed response data:', data);

      if (!data.question) {
        throw new Error('Invalid response format from server - missing question');
      }

      setCurrentQuestion(data.question);
    } catch (error) {
      console.error('Interview start error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to start the interview.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide an answer.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industry,
          position,
          currentQuestion,
          userAnswer,
          isFirstQuestion: false
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to process answer');
      }

      const data = await response.json();
      if (!data.feedback || !data.score || !data.nextQuestion) {
        throw new Error('Invalid response format from server');
      }

      setResponses([...responses, {
        question: currentQuestion,
        answer: userAnswer,
        feedback: data.feedback,
        score: data.score
      }]);

      setCurrentQuestion(data.nextQuestion);
      setUserAnswer('');
    } catch (error) {
      console.error('Answer submission error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process your answer.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        resetInterview();
      }
    }}>
      <DialogTrigger asChild>
        <Card className="bg-gray-800 hover:bg-gray-700 transition-colors duration-300 cursor-pointer border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <User2 className="w-5 h-5" />
              Interview Help
            </CardTitle>
            <CardDescription className="text-gray-400">
              Practice interviews and get AI-powered feedback
            </CardDescription>
          </CardHeader>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Interview Help</DialogTitle>
        </DialogHeader>

        {mode === 'select' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Card 
              className="bg-gray-700/50 hover:bg-gray-700 transition-colors duration-300 cursor-pointer border-gray-600"
              onClick={() => setMode('mock')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Sparkles className="w-5 h-5" />
                  Mock AI Interview
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Practice with our AI interviewer tailored to your industry and position
                </CardDescription>
              </CardHeader>
            </Card>
            <Card 
              className="bg-gray-700/50 hover:bg-gray-700 transition-colors duration-300 cursor-pointer border-gray-600"
              onClick={() => setMode('knowledge')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BookOpen className="w-5 h-5" />
                  Interview Knowledge Base
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Access common interview questions and expert answers
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        )}

        {mode === 'mock' && !currentQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="bg-gray-700/50 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Setup Your Interview</CardTitle>
                <CardDescription className="text-gray-300">
                  Choose your industry and position to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger className="bg-gray-800 border-gray-600">
                    <SelectValue placeholder="Select Industry" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {INDUSTRIES.map((industry) => (
                      <SelectItem 
                        key={industry.value} 
                        value={industry.value}
                        className="text-white hover:bg-gray-700"
                      >
                        {industry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Enter Position (e.g., Software Engineer)"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
                <Button 
                  onClick={startMockInterview} 
                  disabled={isGenerating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isGenerating ? 'Starting Interview...' : 'Start Mock Interview'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {mode === 'mock' && currentQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="bg-gray-700/50 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Question {responses.length + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white mb-4">{currentQuestion}</p>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full h-32 p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button 
                  onClick={submitAnswer}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isGenerating || !userAnswer.trim()}
                >
                  {isGenerating ? 'Processing...' : 'Submit Answer'}
                </Button>
              </CardContent>
            </Card>

            {responses.length > 0 && (
              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Previous Responses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {responses.map((response, index) => (
                    <div key={index} className="border-t border-gray-600 pt-4 first:border-t-0 first:pt-0">
                      <h4 className="font-semibold text-white mb-2">Question {index + 1}</h4>
                      <p className="text-gray-300 mb-2">{response.question}</p>
                      <h4 className="font-semibold text-white mb-2">Your Answer</h4>
                      <p className="text-gray-300 mb-2">{response.answer}</p>
                      <h4 className="font-semibold text-white mb-2">Feedback</h4>
                      <p className="text-gray-300 mb-2">{response.feedback}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-white">Score:</span>
                        <span className="text-blue-400">{response.score}/10</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {mode === 'knowledge' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <p className="text-gray-300">Coming Soon!</p>
            <Button 
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setMode('select')}
            >
              Go Back
            </Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
