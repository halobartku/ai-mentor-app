import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import styled from 'styled-components/native';

const Container = styled(ScrollView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled(View)`
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const Title = styled(Text)`
  font-size: ${({ theme }) => theme.typography.h2.fontSize}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const Subtitle = styled(Text)`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Content = styled(View)`
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

export const HomeScreen = () => {
  return (
    <Container>
      <Header>
        <Title>Welcome back, [Name]</Title>
        <Subtitle>Let's continue your growth journey</Subtitle>
      </Header>
      <Content>
        {/* Add your content here */}
      </Content>
    </Container>
  );
};
