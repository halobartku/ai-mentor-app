import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../hooks/useTheme';

interface ChatBubbleProps {
  message: string;
  isAI: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

const BubbleContainer = styled.View<{ isAI: boolean }>`
  flex-direction: ${({ isAI }) => (isAI ? 'row' : 'row-reverse')};
  margin: 4px 8px;
  max-width: 85%;
  align-self: ${({ isAI }) => (isAI ? 'flex-start' : 'flex-end')};
`;

const Avatar = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  margin: 0 8px;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
`;

const AvatarText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: bold;
`;

const MessageContainer = styled.View<{ isAI: boolean }>`
  background-color: ${({ isAI, theme }) =>
    isAI ? theme.colors.aiMessage : theme.colors.userMessage};
  padding: 12px 16px;
  border-radius: 20px;
  border-top-left-radius: ${({ isAI }) => (isAI ? '4px' : '20px')};
  border-top-right-radius: ${({ isAI }) => (isAI ? '20px' : '4px')};
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 2px;
  elevation: 2;
`;

const MessageText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  line-height: 22px;
`;

const TimeText = styled.Text`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 12px;
  margin-top: 4px;
  align-self: flex-end;
`;

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isAI,
  timestamp,
  isTyping = false,
}) => {
  const theme = useTheme();

  return (
    <BubbleContainer isAI={isAI}>
      <Avatar>
        <AvatarText>{isAI ? 'AI' : 'Me'}</AvatarText>
      </Avatar>
      <MessageContainer isAI={isAI}>
        <MessageText>{message}</MessageText>
        <TimeText>
          {timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </TimeText>
      </MessageContainer>
    </BubbleContainer>
  );
};
