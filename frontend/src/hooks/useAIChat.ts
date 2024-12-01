import { useMutation } from '@tanstack/react-query';
import { api } from '../services/api';

export const useAIChat = () => {
  const mutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await api.post('/ai/chat', { message });
      return response.data.data;
    }
  });

  return {
    sendMessage: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error
  };
};