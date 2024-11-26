import { ResumeUpload } from "@/components/resume/ResumeUpload";

export default function ResumePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Upload Your Resume</h1>
      <ResumeUpload />
    </div>
  );
}
