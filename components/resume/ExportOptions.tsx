'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { exportToPdf } from '@/utils/pdfExport';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Save,
  Share2,
  MoreHorizontal 
} from 'lucide-react';

interface ExportOptionsProps {
  resumeId?: string;
  onSave?: () => Promise<void>;
}

export function ExportOptions({ resumeId, onSave }: ExportOptionsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      // Add a small delay to ensure the resume preview is fully rendered
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a filename with date and time
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `resume-${timestamp}.pdf`;
      
      console.log('Starting PDF export with filename:', fileName);
      const element = document.getElementById('resume-preview');
      if (!element) {
        throw new Error('Resume preview element not found');
      }

      // Temporarily modify the element for better export
      const originalStyle = element.style.cssText;
      element.style.width = '210mm';
      element.style.minHeight = '297mm';
      element.style.height = 'auto';
      element.style.margin = '0';
      element.style.padding = '20mm';
      element.style.backgroundColor = '#ffffff';
      element.style.color = '#000000';

      try {
        await exportToPdf('resume-preview', fileName);
        console.log('PDF export completed');
        toast.success('Resume exported as PDF');
      } finally {
        // Restore original styles
        element.style.cssText = originalStyle;
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export resume');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = async () => {
    if (!onSave) {
      toast.error('Save functionality not available');
      return;
    }

    try {
      setIsSaving(true);
      await onSave();
      toast.success('Resume saved successfully');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save resume');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      if (!resumeId) {
        toast.error('Please save your resume first');
        return;
      }

      // Generate a shareable link
      const shareUrl = `${window.location.origin}/resume/share/${resumeId}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard');
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to generate share link');
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="default"
        size="sm"
        onClick={handleExport}
        disabled={isExporting}
        className="gap-2 w-full sm:w-auto"
      >
        {isExporting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Export PDF
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleSave}
        disabled={isSaving || !onSave}
        className="gap-2 w-full sm:w-auto"
      >
        {isSaving ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Save
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        className="gap-2 w-full sm:w-auto"
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>
    </div>
  );
}
