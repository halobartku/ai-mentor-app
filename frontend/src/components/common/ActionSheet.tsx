import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { Dialog } from '../transitions/Dialog';

interface ActionSheetOption {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

interface ActionSheetProps {
  isVisible: boolean;
  onClose: () => void;
  options: ActionSheetOption[];
  title?: string;
}

const Title = styled(Text)`
  font-size: ${({ theme }) => theme.typography.sizes.subhead}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const OptionContainer = styled(ScrollView)`
  max-height: 70%;
`;

const Option = styled(TouchableOpacity)<{ isDestructive?: boolean }>`
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.separator};
`;

const OptionText = styled(Text)<{ isDestructive?: boolean }>`
  font-size: ${({ theme }) => theme.typography.sizes.body}px;
  color: ${({ theme, isDestructive }) => 
    isDestructive ? theme.colors.danger : theme.colors.text.primary};
  text-align: center;
`;

const CancelButton = styled(TouchableOpacity)`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
`;

const CancelText = styled(Text)`
  font-size: ${({ theme }) => theme.typography.sizes.body}px;
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
`;

export const ActionSheet: React.FC<ActionSheetProps> = ({
  isVisible,
  onClose,
  options,
  title
}) => {
  return (
    <Dialog isVisible={isVisible} onClose={onClose} position="bottom">
      {title && <Title>{title}</Title>}
      <OptionContainer>
        {options.map((option, index) => (
          <Option
            key={index}
            onPress={() => {
              onClose();
              option.onPress();
            }}
            isDestructive={option.destructive}
          >
            <OptionText isDestructive={option.destructive}>
              {option.label}
            </OptionText>
          </Option>
        ))}
      </OptionContainer>
      <CancelButton onPress={onClose}>
        <CancelText>Cancel</CancelText>
      </CancelButton>
    </Dialog>
  );
};