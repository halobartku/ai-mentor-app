import React from 'react';
import { View, Animated, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  style?: any;
}

const Container = styled(Animated.View)<{ elevation: 'none' | 'sm' | 'md' | 'lg' }>`
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  ${({ theme, elevation }) => elevation !== 'none' && theme.shadows[elevation]};
`;

export const Card: React.FC<CardProps> = ({ 
  children, 
  onPress, 
  elevation = 'sm',
  style 
}) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!onPress) return;
    
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4
    }).start();
  };

  const handlePressOut = () => {
    if (!onPress) return;

    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4
    }).start();
  };

  const content = (
    <Container 
      elevation={elevation}
      style={[{ transform: [{ scale }] }, style]}
    >
      {children}
    </Container>
  );

  if (onPress) {
    return (
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        {content}
      </TouchableWithoutFeedback>
    );
  }

  return content;
};