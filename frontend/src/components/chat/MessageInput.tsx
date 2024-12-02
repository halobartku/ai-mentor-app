import React, { useState } from 'react';
import { Platform, TextInput } from 'react-native';
import styled from 'styled-components/native';
import { SendIcon, MicIcon, ImageIcon } from '../common/Icons';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.colors.inputBackground};
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
`;

const Input = styled.TextInput`
  flex: 1;
  min-height: 40px;
  max-height: 120px;
  font-size: 16px;
  margin: 0 12px;
  padding: ${Platform.OS === 'ios' ? '12px' : '8px'};
  background-color: ${({ theme }) => theme.colors.inputField};
  border-radius: 20px;
  color: ${({ theme }) => theme.colors.text};
`;

const IconButton = styled.TouchableOpacity<{ primary?: boolean }>`
  padding: 8px;
  background-color: ${({ theme, primary }) =>
    primary ? theme.colors.primary : 'transparent'};
  border-radius: 20px;
  justify-content: center;
  align-items: center;
`;

interface MessageInputProps {
  onSend: (message: string) => void;
  onImageSelect?: () => void;
  onVoiceRecord?: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onImageSelect,
  onVoiceRecord,
}) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <Container>
      <IconButton onPress={onImageSelect}>
        <ImageIcon size={24} color="#666" />
      </IconButton>
      <Input
        value={text}
        onChangeText={setText}
        placeholder="Type your message..."
        placeholderTextColor="#999"
        multiline
        maxLength={1000}
        onSubmitEditing={handleSend}
        blurOnSubmit={false}
      />
      {text.trim() ? (
        <IconButton primary onPress={handleSend}>
          <SendIcon size={24} color="#fff" />
        </IconButton>
      ) : (
        <IconButton onPress={onVoiceRecord}>
          <MicIcon size={24} color="#666" />
        </IconButton>
      )}
    </Container>
  );
};
