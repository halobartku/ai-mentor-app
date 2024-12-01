import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export interface Preferences {
  learningStyle?: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  communicationStyle?: 'formal' | 'casual' | 'direct' | 'supportive';
  interests?: string[];
  focusAreas?: string[];
}

export const usePreferences = () => {
  const queryClient = useQueryClient();

  const { data: preferences, isLoading: isLoadingPreferences } = useQuery({
    queryKey: ['preferences'],
    queryFn: async () => {
      const response = await api.get('/users/preferences');
      return response.data.data;
    }
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (data: Preferences) => {
      const response = await api.patch('/users/preferences', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
    }
  });

  return {
    preferences,
    isLoading: isLoadingPreferences || updatePreferencesMutation.isPending,
    updatePreferences: updatePreferencesMutation.mutate
  };
};