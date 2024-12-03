import React from 'react';
import { ChatBubble } from './ChatBubble';
import { Message } from 'ai';

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="flex flex-1 flex-col space-y-4 overflow-y-auto p-4">
      {messages.map((message, index) => (
        <ChatBubble
          key={index}
          content={message.content}
          isUser={message.role === 'user'}
          timestamp={message.createdAt?.toLocaleString()}
        />
      ))}
    </div>
  );
}