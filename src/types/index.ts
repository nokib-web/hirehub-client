export type UserRole = 'jobseeker' | 'employer' | 'admin';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  headline?: string;
  location?: string;
  createdAt: string;
}

export interface IJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  category: string;
  description: string;
  requirements: string[];
  skills: string[];
  deadline: string;
  status: 'open' | 'closed';
  createdBy: string;
  createdAt: string;
}

export interface IApplication {
  id: string;
  jobId: string;
  userId: string;
  resume: string;
  coverLetter: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
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
