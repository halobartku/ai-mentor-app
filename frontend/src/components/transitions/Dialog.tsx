import React from 'react';
import { View, TouchableWithoutFeedback, Animated, StyleSheet } from 'react-native';
import styled from 'styled-components/native';

interface DialogProps {
  children: React.ReactNode;
  isVisible: boolean;
  onClose: () => void;
  position?: 'center' | 'bottom';
}

const Container = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: ${({ position }) => position === 'center' ? 'center' : 'flex-end'};
`;

const Content = styled(Animated.View)`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme, position }) => 
    position === 'bottom' 
      ? `${theme.borderRadius.xl}px ${theme.borderRadius.xl}px 0 0`
      : `${theme.borderRadius.xl}px`
  };
  margin: ${({ theme, position }) => 
    position === 'bottom' ? '0' : `0 ${theme.spacing.lg}px`
  };
  overflow: hidden;
`;

export const Dialog: React.FC<DialogProps> = ({
  children,
  isVisible,
  onClose,
  position = 'center'
}) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const scale = React.useRef(new Animated.Value(0.95)).current;
  const translateY = React.useRef(new Animated.Value(100)).current;

  React.useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        }),
        position === 'center'
          ? Animated.spring(scale, {
              toValue: 1,
              useNativeDriver: true,
              damping: 20,
              mass: 0.8
            })
          : Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
              damping: 20,
              mass: 0.8
            })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        }),
        position === 'center'
          ? Animated.spring(scale, {
              toValue: 0.95,
              useNativeDriver: true,
              damping: 20,
              mass: 0.8
            })
          : Animated.spring(translateY, {
              toValue: 100,
              useNativeDriver: true,
              damping: 20,
              mass: 0.8
            })
      ]).start();
    }
  }, [isVisible]);

  const contentStyle = position === 'center'
    ? { transform: [{ scale }] }
    : { transform: [{ translateY }] };

  if (!isVisible) return null;

  return (
    <Container
      position={position}
      style={{
        opacity
      }}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>
      <Content position={position} style={contentStyle}>
        {children}
      </Content>
    </Container>
  );
};