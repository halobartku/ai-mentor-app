import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import { format } from 'date-fns';

interface UserPresenceProps {
  isOnline: boolean;
  lastSeen?: Date;
}

const Container = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const StatusDot = styled(View)<{ isOnline: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ theme, isOnline }) =>
    isOnline ? theme.colors.success : theme.colors.textSecondary};
  margin-right: ${({ theme }) => theme.spacing.xs}px;
`;

const StatusText = styled(Text)`
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const UserPresence: React.FC<UserPresenceProps> = ({ isOnline, lastSeen }) => {
  const getStatusText = () => {
    if (isOnline) return 'Online';
    if (lastSeen) return `Last seen ${format(lastSeen, 'h:mm a')}`;
    return 'Offline';
  };

  return (
    <Container>
      <StatusDot isOnline={isOnline} />
      <StatusText>{getStatusText()}</StatusText>
    </Container>
  );
};