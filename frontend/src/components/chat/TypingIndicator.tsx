"use client";

import React from 'react';

export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2 p-4">
      <div className="flex space-x-1">
        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '600ms' }} />
      </div>
      <span className="text-sm text-gray-500">AI is typing...</span>
    </div>
  );
}