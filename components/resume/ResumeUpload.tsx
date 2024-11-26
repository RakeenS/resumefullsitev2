"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ResumePreviewModal } from "@/components/modals/ResumePreviewModal";
import { toast } from "react-hot-toast";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function ResumeUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [resumeData, setResumeData] = useState<{
    content: string;
    fileName: string;
    id?: string;
  } | null>(null);
  const supabase = createClientComponentClient();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.includes('pdf')) {
      toast.error('Please upload a PDF file');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Uploading file:', file.name);
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload resume');
      }

      if (!data.success || !data.resumeData) {
        throw new Error('Invalid response format from server');
      }

      console.log('Upload successful:', data);
      setResumeData({
        ...data.resumeData,
        id: data.resumeId // If the API returns a resume ID
      });
      setShowPreview(true);
      toast.success('Resume uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload resume');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!resumeData) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to save your resume');
        return;
      }

      const { data, error } = await supabase
        .from('resumes')
        .upsert({
          id: resumeData.id,
          user_id: user.id,
          content: resumeData.content,
          file_name: resumeData.fileName,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setResumeData({ ...resumeData, id: data.id });
      return data;
    } catch (error) {
      console.error('Save error:', error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <label className="block">
          <span className="sr-only">Choose resume file</span>
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileUpload}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
            disabled={isUploading}
          />
        </label>

        <div className="mt-4 text-center text-sm text-gray-600">
          {isUploading ? 'Processing resume...' : 'Upload your resume (PDF only, max 10MB)'}
        </div>
      </div>

      <ResumePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        resumeData={resumeData}
        onSave={handleSave}
        resumeId={resumeData?.id}
      />
    </div>
  );
}
