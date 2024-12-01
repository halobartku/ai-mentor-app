import { useMutation } from '@tanstack/react-query';
import { api } from '../services/api';

export const useSubscription = () => {
  const createSubscriptionMutation = useMutation({
    mutationFn: async (priceId: string) => {
      const response = await api.post('/subscriptions/create', { priceId });
      return response.data.data;
    }
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async (subscriptionId: string) => {
      const response = await api.post(`/subscriptions/${subscriptionId}/cancel`);
      return response.data.data;
    }
  });

  return {
    createSubscription: createSubscriptionMutation.mutate,
    cancelSubscription: cancelSubscriptionMutation.mutate,
    isLoading: createSubscriptionMutation.isPending || cancelSubscriptionMutation.isPending,
    error: createSubscriptionMutation.error || cancelSubscriptionMutation.error
  };
};