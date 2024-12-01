import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components/native';

interface SelectButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const Button = styled(TouchableOpacity)<{ selected: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.sm}px ${theme.spacing.md}px`};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.primary : theme.colors.light};
  border: 1px solid ${({ theme, selected }) =>
    selected ? theme.colors.primary : theme.colors.border};
`;

const ButtonText = styled(Text)<{ selected: boolean }>`
  color: ${({ theme, selected }) =>
    selected ? 'white' : theme.colors.text};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  font-weight: ${({ selected }) => selected ? 'bold' : 'normal'};
`;

export const SelectButton: React.FC<SelectButtonProps> = ({
  label,
  selected,
  onPress
}) => {
  return (
    <Button
      selected={selected}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <ButtonText selected={selected}>{label}</ButtonText>
    </Button>
  );
};