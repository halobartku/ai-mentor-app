import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import { Crown } from 'lucide-react-native';

const Container = styled(View)`
  flex-direction: row;
  align-items: center;
  background-color: #FFD700;
  padding: ${({ theme }) => `${theme.spacing.xs}px ${theme.spacing.sm}px`};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
`;

const BadgeText = styled(Text)`
  color: #000;
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
  font-weight: bold;
  margin-left: ${({ theme }) => theme.spacing.xs}px;
`;

export const PremiumBadge = () => {
  return (
    <Container>
      <Crown size={16} color="#000" />
      <BadgeText>PREMIUM</BadgeText>
    </Container>
  );
};