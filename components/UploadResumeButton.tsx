'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';

interface UploadResumeButtonProps {
  onUploadComplete?: (data: any) => void;
}

export default function UploadResumeButton({ onUploadComplete }: UploadResumeButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);
    setIsUploading(true);
    setUploadedFile(null);

    // Validate file type
    if (!file.type.includes('pdf')) {
      setError('Please upload a PDF file');
      setIsUploading(false);
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      setIsUploading(false);
      return;
    }

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Upload file
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Set uploaded file info
      setUploadedFile({
        name: file.name,
        size: file.size,
      });

      // Call the onUploadComplete callback if provided
      if (onUploadComplete) {
        onUploadComplete(data);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload resume');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          disabled={isUploading}
          className={`px-4 py-2 rounded-md font-medium text-sm ${
            isUploading
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          onClick={() => document.getElementById('resume-upload')?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload Resume'}
          <input
            id="resume-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-500">
          {error}
        </div>
      )}

      {uploadedFile && (
        <div className="text-sm text-green-600">
          Successfully uploaded: {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)}MB)
        </div>
      )}
    </div>
  );
}
