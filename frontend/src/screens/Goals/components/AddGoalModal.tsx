import React, { useState } from 'react';
import { Modal, View } from 'react-native';
import styled from 'styled-components/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';

interface AddGoalModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description?: string; deadline?: Date }) => void;
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

export const AddGoalModal: React.FC<AddGoalModalProps> = ({
  visible,
  onClose,
  onSubmit
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = () => {
    if (title.trim()) {
      onSubmit({
        title: title.trim(),
        description: description.trim(),
        deadline
      });
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDeadline(undefined);
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
            label="Goal Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter your goal"
          />

          <Input
            label="Description (optional)"
            value={description}
            onChangeText={setDescription}
            placeholder="Add details about your goal"
            multiline
          />

          <Button
            title={deadline ? deadline.toLocaleDateString() : 'Set Deadline (optional)'}
            onPress={() => setShowDatePicker(true)}
            variant="outline"
          />

          {showDatePicker && (
            <DateTimePicker
              value={deadline || new Date()}
              mode="date"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDeadline(selectedDate);
                }
              }}
            />
          )}

          <ButtonContainer>
            <Button
              title="Cancel"
              onPress={onClose}
              variant="outline"
            />
            <Button
              title="Add Goal"
              onPress={handleSubmit}
              disabled={!title.trim()}
            />
          </ButtonContainer>
        </ModalContent>
      </Container>
    </Modal>
  );
};