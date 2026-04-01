import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

export const useCheckApplication = (jobId: string) => {
  return useQuery({
    queryKey: ['application-check', jobId],
    queryFn: async () => {
      try {
        const response = await api.get(`/applications/check/${jobId}`);
        return response.data.data;
      } catch (error) {
        return null; // Prob means not applied
      }
    },
    enabled: !!jobId,
    retry: false,
  });
};

export const useSubmitApplication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/applications', data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['application-check', data.jobId] });
      toast.success('Application submitted! Good luck! 🎉');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Submission failed';
      toast.error(message);
    }
  });
};
