import { kv } from '@vercel/kv'
import { Message } from 'ai'
import { nanoid } from 'nanoid'

export interface Chat {
  id: string
  userId: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export async function getChat(id: string, userId: string): Promise<Chat | null> {
  const chat = await kv.hgetall<Chat>(`chat:${id}`)
  if (!chat || chat.userId !== userId) return null
  return chat
}

export async function getChats(userId: string): Promise<Chat[]> {
  const keys = await kv.keys(`chat:*`)
  const chats = await Promise.all(
    keys.map(key => kv.hgetall<Chat>(key))
  )
  return chats
    .filter(chat => chat && chat.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function createChat(userId: string): Promise<Chat> {
  const id = nanoid()
  const chat: Chat = {
    id,
    userId,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
  await kv.hset(`chat:${id}`, chat)
  return chat
}

export async function addMessage(chatId: string, message: Message): Promise<void> {
  await kv.hset(`chat:${chatId}`, {
    messages: await kv.rpush(`chat:${chatId}:messages`, message),
    updatedAt: new Date()
  })
}

export async function updateChat(chat: Chat): Promise<void> {
  await kv.hset(`chat:${chat.id}`, {
    ...chat,
    updatedAt: new Date()
  })
}