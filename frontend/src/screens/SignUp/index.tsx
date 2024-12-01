import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';

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

const SignInLink = styled(Text)`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.primary};
  margin-left: ${({ theme }) => theme.spacing.xs}px;
`;

export const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<RootStackNavigationProp>();
  const { signup, isLoading } = useAuth();

  const handleSignUp = async () => {
    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    try {
      await signup({ name, email, password });
      // Navigation to main app is handled by AuthNavigator
    } catch (error) {
      Alert.alert('Error', 'Failed to create account');
    }
  };

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Content>
        <Title>Create Account</Title>

        <Input
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />

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
          title="Sign Up"
          onPress={handleSignUp}
          loading={isLoading}
          disabled={!email || !password || !name}
          fullWidth
        />

        <Footer>
          <FooterText>Already have an account?</FooterText>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <SignInLink>Sign In</SignInLink>
          </TouchableOpacity>
        </Footer>
      </Content>
    </Container>
  );
};