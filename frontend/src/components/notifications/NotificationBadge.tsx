import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';

interface NotificationBadgeProps {
  count: number;
  size?: 'small' | 'medium';
}

const Badge = styled(View)<{ size: 'small' | 'medium' }>`
  background-color: ${({ theme }) => theme.colors.danger};
  border-radius: 12px;
  min-width: ${({ size }) => size === 'small' ? '16px' : '20px'};
  height: ${({ size }) => size === 'small' ? '16px' : '20px'};
  padding: 0 4px;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -8px;
  right: -8px;
`;

const Count = styled(Text)<{ size: 'small' | 'medium' }>`
  color: white;
  font-size: ${({ size }) => size === 'small' ? '10px' : '12px'};
  font-weight: bold;
`;

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count, size = 'medium' }) => {
  if (count <= 0) return null;
  
  return (
    <Badge size={size}>
      <Count size={size}>{count > 99 ? '99+' : count}</Count>
    </Badge>
  );
};