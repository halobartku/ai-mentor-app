"use client";

import { useChat } from '@/hooks/useChat';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';

export function Chat() {
  const { messages, sendMessage, isLoading, input, setInput } = useChat();

  return (
    <div className="flex flex-col h-full">
      <ChatMessages messages={messages} />
      <ChatInput
        onSubmit={sendMessage}
        isLoading={isLoading}
        input={input}
        setInput={setInput}
      />
    </div>
  );
}