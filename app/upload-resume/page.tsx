'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useSupabaseAuth } from '@/components/providers/supabase-auth-provider';

interface ParsedData {
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

interface PreviewData {
  text: string;
  pageCount: number;
  info: any;
}

export default function UploadResume() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { user, isLoading } = useSupabaseAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type || (!file.type.toLowerCase().includes('pdf') && !file.type.toLowerCase().includes('application/pdf'))) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF document.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.parsedData || !data.preview) {
        throw new Error('Invalid response data from server');
      }

      setParsedData(data.parsedData);
      setPreviewData(data.preview);
      setShowPreview(true);

      toast({
        title: "Upload successful",
        description: "Your resume has been uploaded and parsed.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "There was an error uploading your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    router.push('/builder');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div
          className={`border-2 border-dashed rounded-lg p-8 transition-all duration-200 ${
            isDragging
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-gray-600 hover:border-blue-500/50 hover:bg-gray-800/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="p-4 bg-blue-500/10 rounded-full">
              <Upload className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Upload your resume
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Drag and drop your PDF resume here, or click to select a file
              </p>
            </div>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={isUploading}
            />
            <Button
              variant="outline"
              className="cursor-pointer"
              disabled={isUploading}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <FileText className="w-4 h-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Select PDF file'}
            </Button>
            <p className="text-gray-500 text-xs">
              Maximum file size: 10MB
            </p>
          </div>
        </div>
      </div>

      <Dialog open={showPreview} onOpenChange={handleClosePreview}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Resume Preview</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="preview" className="flex-1">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="parsed">Parsed Data</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="flex-1">
              <ScrollArea className="h-[60vh]">
                <div className="whitespace-pre-wrap font-mono text-sm">
                  {previewData?.text}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="parsed" className="flex-1">
              <ScrollArea className="h-[60vh]">
                <pre className="text-sm">
                  {JSON.stringify(parsedData, null, 2)}
                </pre>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </main>
  );
}
