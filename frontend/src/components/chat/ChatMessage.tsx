import React from 'react';
import { Message } from '@/types/chat';
import { EmotionalFeedback } from './EmotionalFeedback';

interface ChatMessageProps {
  message: Message;
  className?: string;
}

export function ChatMessage({ message, className = '' }: ChatMessageProps) {
  const isAI = message.role === 'assistant';

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} ${className}`}>
      <div className={`max-w-[80%] ${isAI ? 'bg-white' : 'bg-blue-500 text-white'} rounded-lg p-3 shadow`}>
        <div className="text-sm">{message.content}</div>
        {isAI && message.emotionalState && (
          <EmotionalFeedback 
            emotionalState={message.emotionalState} 
            className="mt-2"
          />
        )}
        <div className="text-xs text-gray-500 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}