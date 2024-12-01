import React from 'react';
import { 
  TouchableWithoutFeedback, 
  Animated, 
  ActivityIndicator,
  Text 
} from 'react-native';
import styled from 'styled-components/native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Container = styled(Animated.View)<{
  variant: string;
  size: string;
  disabled: boolean;
  fullWidth: boolean;
}>`
  background-color: ${({ theme, variant, disabled }) => {
    if (disabled) return theme.colors.text.tertiary;
    switch (variant) {
      case 'primary': return theme.colors.primary;
      case 'secondary': return theme.colors.secondary;
      case 'outline': return 'transparent';
      case 'text': return 'transparent';
      default: return theme.colors.primary;
    }
  }};
  padding: ${({ theme, size }) => {
    switch (size) {
      case 'small': return `${theme.spacing.sm}px ${theme.spacing.md}px`;
      case 'large': return `${theme.spacing.lg}px ${theme.spacing.xl}px`;
      default: return `${theme.spacing.md}px ${theme.spacing.lg}px`;
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  align-items: center;
  justify-content: center;
  flex-direction: row;
  ${({ variant, theme }) => 
    variant === 'outline' && `
      border-width: 1px;
      border-color: ${theme.colors.primary};
    `
  }
`;

const ButtonText = styled(Text)<{ variant: string; size: string }>`
  color: ${({ theme, variant }) => 
    variant === 'outline' || variant === 'text' 
      ? theme.colors.primary 
      : theme.colors.text.inverse
  };
  font-size: ${({ theme, size }) => {
    switch (size) {
      case 'small': return theme.typography.sizes.subhead;
      case 'large': return theme.typography.sizes.headline;
      default: return theme.typography.sizes.body;
    }
  }}px;
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  margin-left: ${({ theme }) => theme.spacing.xs}px;
`;

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
}) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
    >
      <Container
        variant={variant}
        size={size}
        disabled={disabled}
        fullWidth={fullWidth}
        style={{ transform: [{ scale }] }}
      >
        {loading ? (
          <ActivityIndicator 
            color={variant === 'outline' || variant === 'text' 
              ? '#007AFF' 
              : '#FFFFFF'} 
          />
        ) : (
          <>
            {icon}
            <ButtonText variant={variant} size={size}>
              {title}
            </ButtonText>
          </>
        )}
      </Container>
    </TouchableWithoutFeedback>
  );
};