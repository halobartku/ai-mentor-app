import React from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import styled from 'styled-components/native';

interface TypingIndicatorProps {
  isVisible: boolean;
  name?: string;
}

const Container = styled(View)<{ isVisible: boolean }>`
  opacity: ${({ isVisible }) => isVisible ? 1 : 0};
  padding: ${({ theme }) => theme.spacing.sm}px;
  flex-direction: row;
  align-items: center;
`;

const TypingText = styled(Text)`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const DotsContainer = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const Dot = styled(Animated.View)`
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.colors.primary};
  margin: 0 2px;
`;

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isVisible, name }) => {
  const animations = React.useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]);

  React.useEffect(() => {
    const createAnimation = (value: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          })
        ])
      );
    };

    if (isVisible) {
      animations.current.forEach((value, index) => {
        createAnimation(value, index * 150).start();
      });
    }

    return () => {
      animations.current.forEach(value => value.stopAnimation());
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Container isVisible={isVisible}>
      <TypingText>{name || 'Someone'} is typing</TypingText>
      <DotsContainer>
        {animations.current.map((value, index) => (
          <Dot
            key={index}
            style={{
              transform: [{
                scale: value.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.5]
                })
              }],
              opacity: value
            }}
          />
        ))}
      </DotsContainer>
    </Container>
  );
};