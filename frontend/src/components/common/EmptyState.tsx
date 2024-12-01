import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import {
  Target,
  MessageCircle,
  Award,
  AlertCircle
} from 'lucide-react-native';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: 'target' | 'message' | 'award' | 'alert';
}

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const IconContainer = styled(View)`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const Title = styled(Text)`
  font-size: ${({ theme }) => theme.typography.h2.fontSize}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  text-align: center;
`;

const Message = styled(Text)`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;

const getIcon = (iconName: string) => {
  const props = { size: 48, color: '#007AFF' };
  
  switch (iconName) {
    case 'target':
      return <Target {...props} />;
    case 'message':
      return <MessageCircle {...props} />;
    case 'award':
      return <Award {...props} />;
    default:
      return <AlertCircle {...props} />;
  }
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon = 'alert'
}) => {
  return (
    <Container>
      <IconContainer>
        {getIcon(icon)}
      </IconContainer>
      <Title>{title}</Title>
      <Message>{message}</Message>
    </Container>
  );
};