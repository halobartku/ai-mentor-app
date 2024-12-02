import React, { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { AnalysisPanel } from './AnalysisPanel';

export function ChatInterface() {
  const [message, setMessage] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const { messages, sendMessage, isLoading } = useChat();
  const lastAiMessage = messages.findLast(m => m.role === 'assistant');

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))}
        </div>
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 rounded-md border p-2"
              placeholder="Type your message..."
            />
            <button
              onClick={() => setShowAnalysis(!showAnalysis)}
              className="px-3 py-2 rounded-md bg-gray-100"
            >
              {showAnalysis ? 'Hide' : 'Show'} Analysis
            </button>
          </div>
        </div>
      </div>
      {showAnalysis && lastAiMessage?.analysis && (
        <div className="w-80 border-l p-4 overflow-y-auto">
          <AnalysisPanel
            rational={lastAiMessage.analysis.rational}
            process={lastAiMessage.analysis.process}
          />
        </div>
      )}
    </div>
  );
}