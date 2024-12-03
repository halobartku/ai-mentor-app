import { supabase } from './supabase';
import { getFromEdge } from './edge-config';
import { Message } from 'ai';

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export async function getCachedResponse(userId: string, input: string): Promise<string | null> {
  const cacheKey = `cache:${userId}:${Buffer.from(input).toString('base64')}`;
  return getFromEdge<string>(cacheKey);
}

export async function createChatSession(userId: string, title: string): Promise<ChatSession | null> {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert([{
      user_id: userId,
      title
    }])
    .select()
    .single();

  if (error) {
    console.error('Create Chat Session Error:', error);
    return null;
  }

  return data;
}

export async function saveChatMessage(sessionId: string, message: Message): Promise<ChatMessage | null> {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([{
      session_id: sessionId,
      role: message.role,
      content: message.content
    }])
    .select()
    .single();

  if (error) {
    console.error('Save Chat Message Error:', error);
    return null;
  }

  return data;
}

export async function getChatHistory(sessionId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Get Chat History Error:', error);
    return [];
  }

  return data;
}

export async function getUserSessions(userId: string): Promise<ChatSession[]> {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Get User Sessions Error:', error);
    return [];
  }

  return data;
}