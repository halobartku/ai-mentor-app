import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { api } from '../services/api';
import { setCredentials } from '../store/slices/authSlice';
import { setToken, setUser } from '../services/storage';

interface AuthCredentials {
  email: string;
  password: string;
  name?: string;
}

export const useAuth = () => {
  const dispatch = useDispatch();

  const loginMutation = useMutation({
    mutationFn: async (credentials: AuthCredentials) => {
      const response = await api.post('/auth/login', credentials);
      return response.data.data;
    },
    onSuccess: async (data) => {
      await setToken(data.token);
      await setUser(data.user);
      dispatch(setCredentials(data));
    }
  });

  const signupMutation = useMutation({
    mutationFn: async (credentials: AuthCredentials) => {
      const response = await api.post('/auth/signup', credentials);
      return response.data.data;
    },
    onSuccess: async (data) => {
      await setToken(data.token);
      await setUser(data.user);
      dispatch(setCredentials(data));
    }
  });

  return {
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    isLoading: loginMutation.isPending || signupMutation.isPending,
    error: loginMutation.error || signupMutation.error
  };
};