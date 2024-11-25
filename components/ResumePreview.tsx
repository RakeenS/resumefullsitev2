'use client';

interface ResumePreviewProps {
  resumeData: {
    personalInfo: {
      fullName: string;
      email: string;
      phone: string;
      location: string;
      title: string;
      summary: string;
    };
    experience: Array<{
      company: string;
      position: string;
      startDate: string;
      endDate: string;
      description: string;
    }>;
    education: Array<any>;
    skills: string[];
  };
}

export default function ResumePreview({ resumeData }: ResumePreviewProps) {
  return (
    <div
      id="resume-preview"
      className="bg-white p-8 min-h-[29.7cm] w-full shadow-lg"
    >
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {resumeData.personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-lg text-gray-600 mt-1">
          {resumeData.personalInfo.title || 'Professional Title'}
        </p>
        <div className="flex items-center justify-center gap-4 mt-2 text-sm text-gray-600">
          {resumeData.personalInfo.email && (
            <span>{resumeData.personalInfo.email}</span>
          )}
          {resumeData.personalInfo.phone && (
            <>
              <span>•</span>
              <span>{resumeData.personalInfo.phone}</span>
            </>
          )}
          {resumeData.personalInfo.location && (
            <>
              <span>•</span>
              <span>{resumeData.personalInfo.location}</span>
            </>
          )}
        </div>
      </div>

      {/* Summary Section */}
      {resumeData.personalInfo.summary && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">
            Professional Summary
          </h2>
          <p className="text-gray-700 whitespace-pre-line">
            {resumeData.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Experience Section */}
      {resumeData.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">
            Work Experience
          </h2>
          <div className="space-y-6">
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{exp.position}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {exp.startDate} - {exp.endDate}
                  </p>
                </div>
                <p className="text-gray-700 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {resumeData.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
