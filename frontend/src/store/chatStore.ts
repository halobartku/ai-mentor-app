import { create } from 'zustand';
import { Message, ChatState } from '@/types/chat';

interface ChatStore extends ChatState {
  addMessage: (message: Message) => void;
  setTyping: (isTyping: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isTyping: false,
  isLoading: false,
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  setTyping: (isTyping) => set({ isTyping }),
  setLoading: (isLoading) => set({ isLoading }),
  clearMessages: () => set({ messages: [] })
}));