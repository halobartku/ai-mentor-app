import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const LoadingScreen = () => {
  return (
    <Container>
      <ActivityIndicator size="large" color="#007AFF" />
    </Container>
  );
};