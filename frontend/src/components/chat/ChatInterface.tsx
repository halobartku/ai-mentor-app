"use client";

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Message } from 'ai';
import { nanoid } from 'nanoid';

export function ChatInterface() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3/4 rounded-lg p-4 ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border p-2"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}