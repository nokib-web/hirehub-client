export type UserRole = 'jobseeker' | 'employer' | 'admin';

export interface IUser {
  id: string;
  _id?: string;
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

import { IJob } from './job';
export * from './job';

export interface IApplication {
  id: string;
  _id?: string;
  jobId: string;
  userId: string | IUser;
  job?: IJob;
  user?: IUser;
  applicant?: IUser;
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
