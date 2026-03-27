import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { IJob } from '@/types/job';

const API_BASE_URL = 'https://hirehub-server-ydm5.onrender.com/api'; // Targeting deployed server

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
      return {
        jobs: response.data.data as IJob[],
        total: response.data.meta?.total || 0,
        page: response.data.meta?.page || 1,
        limit: response.data.meta?.limit || 10,
        totalPages: Math.ceil((response.data.meta?.total || 0) / (response.data.meta?.limit || 10)) || 1,
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
      return response.data.data as IJob[];
    },
    enabled: !!category,
  });
};
