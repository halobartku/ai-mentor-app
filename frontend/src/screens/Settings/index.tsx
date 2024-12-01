import React from 'react';
import { View, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { PreferencesForm } from './components/PreferencesForm';
import { NotificationsSettings } from './components/NotificationsSettings';
import { AccountSettings } from './components/AccountSettings';

const Tab = createMaterialTopTabNavigator();

const Container = styled(View)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const SettingsScreen = () => {
  return (
    <Container>
      <Tab.Navigator>
        <Tab.Screen
          name="Preferences"
          component={PreferencesForm}
          options={{ title: 'Preferences' }}
        />
        <Tab.Screen
          name="Notifications"
          component={NotificationsSettings}
          options={{ title: 'Notifications' }}
        />
        <Tab.Screen
          name="Account"
          component={AccountSettings}
          options={{ title: 'Account' }}
        />
      </Tab.Navigator>
    </Container>
  );
};