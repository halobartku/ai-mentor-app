import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const StyledButton = styled(TouchableOpacity)<{
  variant: string;
  size: string;
  disabled: boolean;
  fullWidth: boolean;
}>`
  background-color: ${({ theme, variant, disabled }) => 
    disabled ? theme.colors.light 
    : variant === 'primary' ? theme.colors.primary
    : variant === 'secondary' ? theme.colors.secondary
    : 'transparent'};
  padding: ${({ size }) => 
    size === 'small' ? '8px 16px'
    : size === 'large' ? '16px 32px'
    : '12px 24px'};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  align-items: center;
  justify-content: center;
  ${({ variant, theme }) => 
    variant === 'outline' && `
      border: 1px solid ${theme.colors.primary};
    `}
`;

const ButtonText = styled(Text)<{ variant: string }>`
  color: ${({ theme, variant }) => 
    variant === 'outline' ? theme.colors.primary : '#FFFFFF'};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  font-weight: 600;
`;

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
}) => {
  return (
    <StyledButton
      onPress={onPress}
      variant={variant}
      size={size}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#007AFF' : '#FFFFFF'} />
      ) : (
        <ButtonText variant={variant}>{title}</ButtonText>
      )}
    </StyledButton>
  );
};
