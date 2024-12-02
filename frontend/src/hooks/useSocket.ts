import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

export function useSocket() {
  const socketRef = useRef<Socket>();

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001');

    socketRef.current.on('typing_start', () => {
      // Handle typing indicator
    });

    socketRef.current.on('typing_end', () => {
      // Handle typing end
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return socketRef.current!;
}