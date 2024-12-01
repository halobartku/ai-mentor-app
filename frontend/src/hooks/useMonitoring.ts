import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export const useMonitoring = () => {
  const { data: systemHealth, isLoading: isHealthLoading } = useQuery({
    queryKey: ['systemHealth'],
    queryFn: async () => {
      const response = await api.get('/monitoring/health');
      return response.data.data;
    },
    refetchInterval: 60000 // Refresh every minute
  });

  const { data: aiMetrics, isLoading: isMetricsLoading } = useQuery({
    queryKey: ['aiMetrics'],
    queryFn: async () => {
      const response = await api.get('/monitoring/ai-metrics?timeRange=day');
      return response.data.data;
    },
    refetchInterval: 300000 // Refresh every 5 minutes
  });

  return {
    systemHealth,
    aiMetrics,
    isLoading: isHealthLoading || isMetricsLoading,
    refetch: () => {
      return Promise.all([
        systemHealth.refetch(),
        aiMetrics.refetch()
      ]);
    }
  };
};