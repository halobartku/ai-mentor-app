import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import styled from 'styled-components/native';

const Container = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const Dot = styled(Animated.View)`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.primary};
  margin: 0 4px;
`;

export const LoadingDots = () => {
  const animations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]);

  useEffect(() => {
    const createAnimation = (value: Animated.Value, delay: number) => {
      return Animated.sequence([
        Animated.delay(delay),
        Animated.loop(
          Animated.sequence([
            Animated.timing(value, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true
            }),
            Animated.timing(value, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true
            })
          ])
        )
      ]);
    };

    animations.current.forEach((value, index) => {
      createAnimation(value, index * 150).start();
    });

    return () => {
      animations.current.forEach(value => {
        value.stopAnimation();
      });
    };
  }, []);

  return (
    <Container>
      {animations.current.map((value, index) => (
        <Dot
          key={index}
          style={{
            opacity: value,
            transform: [{
              scale: value.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1.2]
              })
            }]
          }}
        />
      ))}
    </Container>
  );
};