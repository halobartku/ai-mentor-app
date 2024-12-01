import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import styled from 'styled-components/native';
import { useMutation } from '@tanstack/react-query';

import { ChatMessage } from './components/ChatMessage';
import { MessageInput } from './components/MessageInput';
import { LoadingDots } from '../../components/common/LoadingDots';
import { useAIChat } from '../../hooks/useAIChat';

const Container = styled(KeyboardAvoidingView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const MessageList = styled(ScrollView)`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const InputContainer = styled(View)`
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
`;

export const ChatScreen = () => {
  const [messages, setMessages] = useState<Array<{
    id: string;
    content: string;
    role: 'user' | 'assistant';
  }>>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const { sendMessage, isLoading } = useAIChat();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content,
      role: 'user' as const
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await sendMessage(content);
      // Add AI response
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        role: 'assistant' as const
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
    }
  };

  return (
    <Container
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <MessageList
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(message => (
          <ChatMessage
            key={message.id}
            content={message.content}
            isUser={message.role === 'user'}
          />
        ))}
        {isLoading && <LoadingDots />}
      </MessageList>
      <InputContainer>
        <MessageInput
          onSend={handleSendMessage}
          disabled={isLoading}
        />
      </InputContainer>
    </Container>
  );
};