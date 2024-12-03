import { auth } from '@clerk/nextjs';
import { processMessage } from '@/lib/ai-pipeline';
import { createChatSession, saveChatMessage } from '@/lib/chat-storage';
import { nanoid } from 'nanoid';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  try {
    const { message, sessionId, createNewSession } = await req.json();
    
    let activeSessionId = sessionId;
    if (createNewSession) {
      const session = await createChatSession(userId, message.slice(0, 50));
      if (!session) throw new Error('Failed to create chat session');
      activeSessionId = session.id;
    }

    await saveChatMessage(activeSessionId, {
      id: nanoid(),
      role: 'user',
      content: message,
      createdAt: new Date()
    });

    const response = await processMessage(message, {
      userId,
      sessionId: activeSessionId,
      previousMessages: []
    });

    return response;
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}