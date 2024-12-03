import React from 'react';
import { cn } from '@/utils';

interface ChatBubbleProps {
  content: string;
  isUser: boolean;
  timestamp?: string;
}

export function ChatBubble({ content, isUser, timestamp }: ChatBubbleProps) {
  return (
    <div
      className={cn(
        'flex max-w-[80%] flex-col rounded-lg p-4',
        isUser ? 'ml-auto bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'
      )}
    >
      <div className="break-words">{content}</div>
      {timestamp && (
        <div
          className={cn(
            'mt-1 text-xs',
            isUser ? 'text-blue-100' : 'text-gray-500'
          )}
        >
          {timestamp}
        </div>
      )}
    </div>
  );
}