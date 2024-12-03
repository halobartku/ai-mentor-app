import { auth } from '@clerk/nextjs';
import { StreamingTextResponse } from 'ai';
import { processMessage } from '@/lib/ai-pipeline';

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  try {
    const { messages, context } = await req.json();
    const lastMessage = messages[messages.length - 1];

    const response = await processMessage(lastMessage.content, {
      userId,
      previousMessages: messages.slice(0, -1)
    });

    return response;
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}