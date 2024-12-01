import React, { useState } from 'react';
import { Modal, View, Alert } from 'react-native';
import styled from 'styled-components/native';

import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string }) => void;
  initialData: {
    name: string;
    email: string;
  };
}

const Container = styled(View)`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const ModalContent = styled(View)`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const ButtonContainer = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData
}) => {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);

  const handleSubmit = () => {
    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    onSubmit({ name, email });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Container>
        <ModalContent>
          <Input
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <ButtonContainer>
            <Button
              title="Cancel"
              onPress={onClose}
              variant="outline"
            />
            <Button
              title="Save"
              onPress={handleSubmit}
              disabled={!email.trim()}
            />
          </ButtonContainer>
        </ModalContent>
      </Container>
    </Modal>
  );
};