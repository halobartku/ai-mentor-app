import { useAuth } from '@clerk/nextjs';
import { Message, useChat as useVercelChat } from 'ai';
import { useCallback } from 'react';

export function useChat() {
  const { userId } = useAuth();
  
  const { messages, append, reload, stop, isLoading, input, setInput } =
    useVercelChat({
      api: '/api/chat',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        userId,
      },
      onResponse: (response) => {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
      },
      onError: (error) => {
        console.error('Chat Error:', error);
      },
    });

  const sendMessage = useCallback(
    async (content: string) => {
      try {
        await append({
          content,
          role: 'user',
          createdAt: new Date(),
        });
      } catch (error) {
        console.error('Send Message Error:', error);
        throw error;
      }
    },
    [append]
  );

  return {
    messages,
    sendMessage,
    reload,
    stop,
    isLoading,
    input,
    setInput,
  };
}