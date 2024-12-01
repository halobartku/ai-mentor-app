import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import RootNavigator from './RootNavigator';
import { MainNavigator } from './MainNavigator';
import { RootState } from '../store';
import { LoadingScreen } from '../screens/Loading';

export const AuthNavigator = () => {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <RootNavigator />}
    </NavigationContainer>
  );
};