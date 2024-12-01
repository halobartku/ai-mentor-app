import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components/native';

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
}

const Container = styled(TouchableOpacity)`
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.light};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  width: 30%;
`;

const Title = styled(Text)`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.text};
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  text-align: center;
`;

export const QuickAction: React.FC<QuickActionProps> = ({
  icon,
  title,
  onPress
}) => {
  return (
    <Container onPress={onPress} activeOpacity={0.7}>
      {icon}
      <Title>{title}</Title>
    </Container>
  );
};