import { useCallback } from 'react';
import { useChatStore } from '@/store/chatStore';

export function useChat() {
  const { messages, addMessage, updateLastMessage, setLoading } = useChatStore();

  const sendMessage = useCallback(async (content: string) => {
    setLoading(true);
    addMessage({ role: 'user', content, timestamp: new Date() });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content })
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      const reader = response.body?.getReader();
      let partialResponse = '';

      addMessage({
        role: 'assistant',
        content: '',
        timestamp: new Date()
      });

      while (reader) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const text = new TextDecoder().decode(value);
        partialResponse += text;
        
        updateLastMessage({
          role: 'assistant',
          content: partialResponse,
          timestamp: new Date()
        });
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addMessage, updateLastMessage, setLoading]);

  return { messages, sendMessage };
}