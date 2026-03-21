export type ILocationType = 'Remote' | 'On-site' | 'Hybrid';
export type IJobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance';
export type IJobCategory = 'Technology' | 'Marketing' | 'Design' | 'Finance' | 'Healthcare' | 'Education' | 'Sales' | 'Engineering' | 'HR' | 'Legal';
export type IExperienceLevel = 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Executive';
export type IJobStatus = 'active' | 'closed' | 'draft';

export interface IJob {
  _id: string; // From MongoDB
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  locationType: ILocationType;
  type: IJobType;
  category: IJobCategory;
  salary: {
    min: number;
    max: number;
    currency: string;
    period: 'hourly' | 'monthly' | 'yearly';
  };
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  benefits?: string[];
  experience: IExperienceLevel;
  deadline: string; // Stored as ISO/Date string in client
  status: IJobStatus;
  applicantsCount: number;
  views: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type IImproveCoverLetterRequest = {
  coverLetter: string;
  jobTitle: string;
  jobDescription: string;
};

export type IApplyJobRequest = {
  jobId: string;
  resumeUrl: string;
  coverLetter: string;
  portfolioUrl?: string;
  expectedSalary?: string;
};
