import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { IJob } from '@/types/job';

const API_BASE_URL = 'http://localhost:5000/api'; // Assuming server runs on 5000

export const useJobs = () => {
  const searchParams = useSearchParams();
  
  // Construct search query
  const query = Object.fromEntries(searchParams.entries());

  return useQuery({
    queryKey: ['jobs', query],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/jobs`, {
        params: query,
      });
      return response.data.data as {
        jobs: IJob[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    },
  });
};

export const useJob = (id: string) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/jobs/${id}`);
      return response.data.data as IJob;
    },
    enabled: !!id,
  });
};

export const useRelatedJobs = (category: string, currentJobId: string) => {
  return useQuery({
    queryKey: ['related-jobs', category, currentJobId],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/jobs`, {
        params: { category, limit: 4 }, // We'll filter out current job in UI
      });
      return response.data.data.jobs as IJob[];
    },
    enabled: !!category,
  });
};
