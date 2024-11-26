import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ExportOptions } from "@/components/resume/ExportOptions";

interface ResumePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: {
    content: string;
    fileName: string;
  } | null;
  onSave?: () => Promise<void>;
  resumeId?: string;
}

export function ResumePreviewModal({
  isOpen,
  onClose,
  resumeData,
  onSave,
  resumeId,
}: ResumePreviewModalProps) {
  if (!resumeData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <DialogTitle className="text-xl font-bold">
                Resume Preview: {resumeData.fileName}
              </DialogTitle>
              <DialogDescription>
                AI-powered resume analysis
              </DialogDescription>
            </div>
            <div className="flex-shrink-0">
              <ExportOptions resumeId={resumeId} onSave={onSave} />
            </div>
          </div>
        </DialogHeader>
        
        <div className="mt-6 space-y-4 text-sm leading-relaxed overflow-x-auto">
          <div 
            id="resume-preview" 
            className="bg-white dark:bg-gray-900 p-4 sm:p-8 rounded-lg shadow-sm w-full sm:w-[210mm] mx-auto"
            style={{
              minWidth: 'min(210mm, 100%)',
              maxWidth: '100%',
              overflowX: 'auto'
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: resumeData.content }} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
