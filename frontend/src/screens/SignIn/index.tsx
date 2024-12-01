import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { useDispatch } from 'react-redux';

import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import type { RootStackNavigationProp } from '../../navigation/types';

const Container = styled(KeyboardAvoidingView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Content = styled(View)`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl}px;
  justify-content: center;
`;

const Title = styled(Text)`
  font-size: ${({ theme }) => theme.typography.h1.fontSize}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const Footer = styled(View)`
  flex-direction: row;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

const FooterText = styled(Text)`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SignUpLink = styled(Text)`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.primary};
  margin-left: ${({ theme }) => theme.spacing.xs}px;
`;

export const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<RootStackNavigationProp>();
  const { login, isLoading } = useAuth();

  const handleSignIn = async () => {
    try {
      await login({ email, password });
      // Navigation to main app is handled by AuthNavigator
    } catch (error) {
      Alert.alert('Error', 'Invalid email or password');
    }
  };

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Content>
        <Title>Welcome Back</Title>

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />

        <Button
          title="Sign In"
          onPress={handleSignIn}
          loading={isLoading}
          disabled={!email || !password}
          fullWidth
        />

        <Footer>
          <FooterText>Don't have an account?</FooterText>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <SignUpLink>Sign Up</SignUpLink>
          </TouchableOpacity>
        </Footer>
      </Content>
    </Container>
  );
};