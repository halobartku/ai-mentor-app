import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
}

const MessageContainer = styled(View)<{ isUser: boolean }>`
  max-width: 80%;
  align-self: ${({ isUser }) => isUser ? 'flex-end' : 'flex-start'};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const MessageBubble = styled(View)<{ isUser: boolean }>`
  background-color: ${({ theme, isUser }) =>
    isUser ? theme.colors.primary : theme.colors.light};
  padding: ${({ theme }) => `${theme.spacing.sm}px ${theme.spacing.md}px`};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  border-bottom-right-radius: ${({ theme, isUser }) =>
    isUser ? 4 : theme.borderRadius.lg}px;
  border-bottom-left-radius: ${({ theme, isUser }) =>
    isUser ? theme.borderRadius.lg : 4}px;
`;

const MessageText = styled(Text)<{ isUser: boolean }>`
  color: ${({ isUser }) => isUser ? '#FFFFFF' : '#000000'};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
`;

export const ChatMessage: React.FC<ChatMessageProps> = ({ content, isUser }) => {
  return (
    <MessageContainer isUser={isUser}>
      <MessageBubble isUser={isUser}>
        <MessageText isUser={isUser}>{content}</MessageText>
      </MessageBubble>
    </MessageContainer>
  );
};