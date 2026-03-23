export type UserRole = 'jobseeker' | 'employer' | 'admin';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  headline?: string;
  location?: string;
  company?: string;
  bio?: string;
  skills?: string[];
  isActive: boolean;
  createdAt: string;
}

export interface IJob {
  id: string;
  _id?: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  locationType: 'Remote' | 'On-site' | 'Hybrid';
  type: string;
  category: string;
  salary: {
    min: number;
    max: number;
    currency: string;
    period: 'hourly' | 'monthly' | 'yearly';
  };
  description: string;
  requirements: string[];
  responsibilities?: string[];
  skills: string[];
  benefits?: string[];
  experience: string;
  deadline: string;
  status: 'active' | 'closed' | 'draft';
  applicantsCount: number;
  views: number;
  isFeatured: boolean;
  createdBy: string | IUser;
  createdAt: string;
}

export interface IApplication {
  id: string;
  _id?: string;
  jobId: string;
  userId: string | IUser;
  job?: IJob;
  user?: IUser;
  resumeUrl: string;
  coverLetter: string;
  portfolioUrl?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  appliedAt: string;
  createdAt: string;
}

export interface IReview {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  companyId: string;
  createdAt: string;
}

export interface IMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: IMeta;
}
