import { Message } from 'ai';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import Markdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <Card
      className={cn(
        'flex flex-col space-y-2 p-4',
        message.role === 'user' ? 'bg-muted' : 'bg-background'
      )}
    >
      <div className="text-sm font-semibold">
        {message.role === 'user' ? 'You' : 'AI Mentor'}
      </div>
      <div className="prose prose-sm max-w-none">
        <Markdown>{message.content}</Markdown>
      </div>
    </Card>
  );
}