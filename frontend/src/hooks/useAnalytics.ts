import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export const useAnalytics = () => {
  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await api.get('/analytics/user');
      return response.data.data;
    }
  });

  const { data: insights, isLoading: isInsightsLoading } = useQuery({
    queryKey: ['insights'],
    queryFn: async () => {
      const response = await api.get('/analytics/insights');
      return response.data.data;
    }
  });

  return {
    analytics,
    insights,
    isLoading: isAnalyticsLoading || isInsightsLoading,
    refetch: () => {
      // Refetch both queries
      return Promise.all([
        analytics.refetch(),
        insights.refetch()
      ]);
    }
  };
};