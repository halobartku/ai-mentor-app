import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { socketService } from '../services/socket';

export const useSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    socketService.connect();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const subscribe = useCallback(<T>(event: string, callback: (data: T) => void) => {
    return socketService.subscribe(event, callback);
  }, []);

  const emit = useCallback(<T>(event: string, data?: T) => {
    socketService.emit(event, data);
  }, []);

  return {
    subscribe,
    emit
  };
};