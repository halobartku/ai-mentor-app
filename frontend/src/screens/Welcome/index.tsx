import React from 'react';
import { View, Text, Image } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { Button } from '../../components/common/Button';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Title = styled(Text)`
  font-size: ${({ theme }) => theme.typography.h1.fontSize}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  text-align: center;
`;

const Subtitle = styled(Text)`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
  text-align: center;
`;

const ButtonContainer = styled(View)`
  width: 100%;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

export const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <Container>
      <Title>Welcome to AI Mentor</Title>
      <Subtitle>
        Your personal AI-powered mentor to help you achieve your goals and grow personally
        and professionally.
      </Subtitle>
      <ButtonContainer>
        <Button 
          title="Get Started" 
          onPress={() => navigation.navigate('SignUp')} 
          variant="primary"
          fullWidth
        />
        <Button 
          title="I already have an account" 
          onPress={() => navigation.navigate('SignIn')} 
          variant="outline"
          fullWidth
        />
      </ButtonContainer>
    </Container>
  );
};
