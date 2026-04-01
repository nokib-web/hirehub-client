import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

export const useReviews = (companyId: string) => {
  return useQuery({
    queryKey: ['reviews', companyId],
    queryFn: async () => {
      const response = await api.get(`/reviews/company/${companyId}`);
      return response.data.data;
    },
    enabled: !!companyId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/reviews', data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', data.companyId] });
      toast.success('Review submitted! Thank you!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to submit review';
      toast.error(message);
    }
  });
};

export const useReviewSummary = () => {
  return useMutation({
    mutationFn: async (reviews: any[]) => {
      const response = await api.post('/ai/review-summary', { reviews });
      return response.data.data;
    }
  });
};
