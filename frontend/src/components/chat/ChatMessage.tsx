interface ChatMessageProps {
  message: string;
  isAI: boolean;
  timestamp: Date;
}

export default function ChatMessage({ message, isAI, timestamp }: ChatMessageProps) {
  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 ${isAI
          ? 'bg-gray-100 text-gray-900'
          : 'bg-blue-600 text-white'
          }`}
      >
        <p className="text-sm">{message}</p>
        <time className={`text-xs mt-1 block ${isAI ? 'text-gray-500' : 'text-blue-100'}`}>
          {timestamp.toLocaleTimeString()}
        </time>
      </div>
    </div>
  );
}