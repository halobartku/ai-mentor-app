import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getToken, getUser } from '../services/storage';
import { setCredentials, setLoading } from '../store/slices/authSlice';

export const useInitialRoute = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const [token, user] = await Promise.all([
          getToken(),
          getUser()
        ]);

        if (token && user) {
          dispatch(setCredentials({ token, user }));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkAuth();
  }, [dispatch]);
};