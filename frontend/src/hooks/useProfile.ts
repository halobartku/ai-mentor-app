import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { api } from '../services/api';
import { updateUser } from '../store/slices/authSlice';
import { removeToken, removeUser } from '../services/storage';

export const useProfile = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get('/users/profile');
      return response.data.data;
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name?: string; email?: string }) => {
      const response = await api.patch('/users/profile', data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      dispatch(updateUser(data));
    }
  });

  const logout = async () => {
    await removeToken();
    await removeUser();
  };

  return {
    profile,
    isLoading,
    updateProfile: updateProfileMutation.mutate,
    logout
  };
};