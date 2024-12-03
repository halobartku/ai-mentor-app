"use client";

import React from 'react';
import { format } from 'date-fns';

interface UserPresenceProps {
  username: string;
  lastActive?: Date;
  isOnline?: boolean;
}

export function UserPresence({ username, lastActive, isOnline = false }: UserPresenceProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <div className="h-2 w-2 rounded-full bg-gray-300">
          {isOnline && (
            <div className="absolute -right-0.5 -top-0.5 h-3 w-3 animate-ping rounded-full bg-green-400 opacity-75" />
          )}
          <div className={`absolute inset-0 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{username}</span>
        {lastActive && !isOnline && (
          <span className="text-xs text-gray-500">
            Last seen {format(lastActive, 'MMM d, h:mm a')}
          </span>
        )}
      </div>
    </div>
  );
}