import { useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    setIsLoading(true);
    try {
      // Add user message
      const userMessage: Message = { role: 'user', content };
      setMessages(prev => [...prev, userMessage]);

      // Mock AI response - replace with actual API call
      const response = await new Promise<string>(resolve => 
        setTimeout(() => resolve('Thank you for your message. I'm your AI mentor - how can I help you today?'), 1000)
      );

      // Add AI response
      const aiMessage: Message = { role: 'assistant', content: response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
  };
}