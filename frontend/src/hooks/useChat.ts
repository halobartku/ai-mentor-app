import { useState } from 'react';
import { useSocket } from './useSocket';

interface EmotionalState {
  currentMood: number;
  stressLevel: number;
  engagementScore: number;
  confidenceLevel: number;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  emotionalState?: EmotionalState;
  timestamp: Date;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const socket = useSocket();

  const sendMessage = async (content: string) => {
    setIsLoading(true);
    try {
      const userMessage: Message = {
        role: 'user',
        content,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      const aiMessage: Message = {
        role: 'assistant',
        content: data.response.content,
        emotionalState: data.response.emotionalState,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      socket.emit('message_read', { messageId: data.messageId });

    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading
  };
}