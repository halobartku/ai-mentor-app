import axios from 'axios';
import { useAuth } from '@clerk/nextjs';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Create a hook for using the authenticated API
export const useApi = () => {
  const { getToken } = useAuth();

  const authApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  authApi.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  authApi.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        // Clerk handles token refresh automatically
        // Just reject the promise and let the UI handle the error
      }
      return Promise.reject(error);
    }
  );

  return authApi;
};
