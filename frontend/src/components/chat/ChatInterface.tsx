"use client";

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Message } from 'ai';
import { nanoid } from 'nanoid';
import { MessageInput } from './MessageInput';
import { ChatBubble } from './ChatBubble';

export function ChatInterface() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          createNewSession: messages.length === 0,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      setMessages(prev => [
        ...prev,
        { 
          id: nanoid(),
          role: 'user',
          content: input,
          createdAt: new Date()
        },
        { 
          id: nanoid(),
          role: 'assistant',
          content: data.content,
          createdAt: new Date() 
        },
      ]);
      setInput('');
    } catch (error) {
      console.error('Chat Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            content={message.content}
            isUser={message.role === 'user'}
            timestamp={message.createdAt?.toLocaleString()}
          />
        ))}
      </div>
      <MessageInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}