export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  layout: 'modern' | 'classic' | 'minimal' | 'professional';
}

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'modern-1',
    name: 'Modern Professional',
    description: 'A clean and modern design with a sidebar for skills and contact information.',
    preview: '/templates/modern-1-preview.png',
    layout: 'modern'
  },
  {
    id: 'classic-1',
    name: 'Classic Elegant',
    description: 'Traditional layout with a timeless design, perfect for conservative industries.',
    preview: '/templates/classic-1-preview.png',
    layout: 'classic'
  },
  {
    id: 'minimal-1',
    name: 'Minimal Impact',
    description: 'Minimalist design focusing on content with subtle design elements.',
    preview: '/templates/minimal-1-preview.png',
    layout: 'minimal'
  },
  {
    id: 'professional-1',
    name: 'Executive Pro',
    description: 'Professional template with a bold header and structured sections.',
    preview: '/templates/professional-1-preview.png',
    layout: 'professional'
  }
];
