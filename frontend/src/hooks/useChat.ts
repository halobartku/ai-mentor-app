import { useSocket } from './useSocket';
import { useChatStore } from '@/store/chatStore';
import { v4 as uuidv4 } from 'uuid';

export function useChat() {
  const socket = useSocket();
  const { messages, isLoading, addMessage, setLoading } = useChatStore();

  const sendMessage = async (content: string) => {
    setLoading(true);
    const messageId = uuidv4();

    try {
      const userMessage = {
        id: messageId,
        role: 'user',
        content,
        timestamp: new Date()
      };
      addMessage(userMessage);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, messageId })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      const aiMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: data.response.content,
        emotionalState: data.response.emotionalState,
        timestamp: new Date()
      };

      addMessage(aiMessage);
      socket.emit('message_read', { messageId });

    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading
  };
}