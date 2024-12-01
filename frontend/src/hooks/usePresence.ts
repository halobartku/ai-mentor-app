import { useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';
import { useAppDispatch } from '../store';
import { updateUserPresence } from '../store/slices/userSlice';

export const usePresence = () => {
  const { socket, isConnected } = useSocket();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isConnected) return;

    socket?.on('presence:update', ({ userId, isOnline, timestamp }) => {
      dispatch(updateUserPresence({ userId, isOnline, lastSeen: new Date(timestamp) }));
    });

    return () => {
      socket?.off('presence:update');
    };
  }, [isConnected, socket, dispatch]);

  const updateStatus = useCallback((status: 'online' | 'away' | 'offline') => {
    if (!isConnected) return;
    socket?.emit('presence:update', status);
  }, [isConnected, socket]);

  return {
    updateStatus
  };
};