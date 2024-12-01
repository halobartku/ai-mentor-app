import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Send } from 'lucide-react-native';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const Container = styled(View)`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const Input = styled(TextInput)`
  flex: 1;
  min-height: 40px;
  max-height: 120px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.text};
`;

const SendButton = styled(TouchableOpacity)<{ disabled: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm}px;
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
`;

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  disabled = false
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <Container>
      <Input
        multiline
        placeholder="Type your message..."
        value={message}
        onChangeText={setMessage}
        editable={!disabled}
      />
      <SendButton
        onPress={handleSend}
        disabled={!message.trim() || disabled}
      >
        <Send
          size={24}
          color={message.trim() && !disabled ? '#007AFF' : '#999'}
        />
      </SendButton>
    </Container>
  );
};