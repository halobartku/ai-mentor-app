import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  Animated, 
  LayoutAnimation, 
  Platform, 
  UIManager 
} from 'react-native';
import styled from 'styled-components/native';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  multiline?: boolean;
  maxLength?: number;
}

const Container = styled(View)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const InputContainer = styled(View)<{ isFocused: boolean; hasError: boolean }>`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-width: 2px;
  border-color: ${({ theme, isFocused, hasError }) => 
    hasError 
      ? theme.colors.danger
      : isFocused 
        ? theme.colors.primary 
        : theme.colors.background.secondary};
`;

const StyledInput = styled(TextInput)`
  font-size: ${({ theme }) => theme.typography.sizes.body}px;
  color: ${({ theme }) => theme.colors.text.primary};
  padding: ${({ theme }) => theme.spacing.xs}px 0;
  min-height: ${({ multiline }) => multiline ? '100px' : '40px'};
`;

const Label = styled(Animated.Text)`
  font-size: ${({ theme }) => theme.typography.sizes.caption1}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const Error = styled(Text)`
  font-size: ${({ theme }) => theme.typography.sizes.caption1}px;
  color: ${({ theme }) => theme.colors.danger};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  autoCapitalize = 'none',
  keyboardType = 'default',
  multiline = false,
  maxLength
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedLabelValue = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    animateLabelIn();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      animateLabelOut();
    }
  };

  const animateLabelIn = () => {
    Animated.timing(animatedLabelValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true
    }).start();
  };

  const animateLabelOut = () => {
    Animated.timing(animatedLabelValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start();
  };

  React.useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [error]);

  const labelStyle = {
    transform: [
      {
        scale: animatedLabelValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.85]
        })
      },
      {
        translateY: animatedLabelValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -8]
        })
      }
    ]
  };

  return (
    <Container>
      <Label style={labelStyle}>{label}</Label>
      <InputContainer isFocused={isFocused} hasError={!!error}>
        <StyledInput
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          multiline={multiline}
          maxLength={maxLength}
        />
      </InputContainer>
      {error && <Error>{error}</Error>}
    </Container>
  );
};