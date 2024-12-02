import ChatInterface from '@/src/components/chat/ChatInterface';

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-shrink-0 border-b border-gray-200 py-4 px-6 bg-white">
        <h1 className="text-2xl font-semibold text-gray-900">Chat with AI Mentor</h1>
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}