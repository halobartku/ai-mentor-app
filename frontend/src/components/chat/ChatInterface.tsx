import React, { useState, useRef, useEffect } from 'react';
import { Animated, View, TextInput, ScrollView, Platform } from 'react-native';
import styled from 'styled-components/native';
import { TypingIndicator } from './TypingIndicator';
import { UserPresence } from './UserPresence';
import { useAIContext } from '../../hooks/useAIContext';
import { SendIcon, MicIcon, ImageIcon } from '../common/Icons';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ChatContainer = styled.View`
  flex: 1;
  padding: 16px;
`;

const MessageBubble = styled.View<{ isAI: boolean }>`
  background-color: ${({ isAI, theme }) =>
    isAI ? theme.colors.aiMessage : theme.colors.userMessage};
  padding: 12px 16px;
  border-radius: 18px;
  max-width: 80%;
  align-self: ${({ isAI }) => (isAI ? 'flex-start' : 'flex-end')};
  margin-bottom: 8px;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 2px;
  elevation: 2;
`;

const MessageText = styled.Text<{ isAI: boolean }>`
  color: ${({ isAI, theme }) =>
    isAI ? theme.colors.aiMessageText : theme.colors.userMessageText};
  font-size: 16px;
  line-height: 22px;
`;

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.colors.inputBackground};
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
`;

const Input = styled.TextInput`
  flex: 1;
  font-size: 16px;
  margin: 0 12px;
  padding: ${Platform.OS === 'ios' ? '12px' : '8px'};
  background-color: ${({ theme }) => theme.colors.inputField};
  border-radius: 20px;
  color: ${({ theme }) => theme.colors.text};
`;

const IconButton = styled.TouchableOpacity`
  padding: 8px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 20px;
  justify-content: center;
  align-items: center;
`;

const TimeStamp = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  align-self: center;
  margin: 8px 0;
`;

interface Message {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: Date;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const { sendMessage } = useAIContext();

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputText.trim(),
      isAI: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await sendMessage(inputText);
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: response,
        isAI: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      // Handle error
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <Container>
      <ChatContainer>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {messages.map((message) => (
            <React.Fragment key={message.id}>
              <MessageBubble isAI={message.isAI}>
                <MessageText isAI={message.isAI}>{message.content}</MessageText>
              </MessageBubble>
              <TimeStamp>
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </TimeStamp>
            </React.Fragment>
          ))}
          {isTyping && <TypingIndicator />}
        </ScrollView>
      </ChatContainer>

      <InputContainer>
        <IconButton onPress={() => {/* Handle image upload */}}>
          <ImageIcon />
        </IconButton>
        <Input
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          multiline
          maxLength={1000}
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />
        {inputText.trim() ? (
          <IconButton onPress={handleSend}>
            <SendIcon />
          </IconButton>
        ) : (
          <IconButton onPress={() => {/* Handle voice input */}}>
            <MicIcon />
          </IconButton>
        )}
      </InputContainer>
    </Container>
  );
};
