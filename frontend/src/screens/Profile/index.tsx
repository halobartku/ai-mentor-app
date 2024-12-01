import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useDispatch } from 'react-redux';

import { Button } from '../../components/common/Button';
import { ProfileSection } from './components/ProfileSection';
import { EditProfileModal } from './components/EditProfileModal';
import { SubscriptionCard } from './components/SubscriptionCard';
import { useProfile } from '../../hooks/useProfile';
import { clearCredentials } from '../../store/slices/authSlice';

const Container = styled(ScrollView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled(View)`
  padding: ${({ theme }) => theme.spacing.lg}px;
  align-items: center;
`;

const Content = styled(View)`
  padding: ${({ theme }) => theme.spacing.lg}px;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

export const ProfileScreen = () => {
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const dispatch = useDispatch();
  const { profile, isLoading, updateProfile, logout } = useProfile();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            dispatch(clearCredentials());
          }
        }
      ]
    );
  };

  const handleUpdateProfile = async (data: any) => {
    try {
      await updateProfile(data);
      setEditModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <Container>
      <Header>
        <ProfileSection
          name={profile?.name}
          email={profile?.email}
          onEdit={() => setEditModalVisible(true)}
        />
      </Header>

      <Content>
        <SubscriptionCard
          tier={profile?.subscription?.tier || 'free'}
          expiresAt={profile?.subscription?.endDate}
        />

        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          fullWidth
        />
      </Content>

      <EditProfileModal
        visible={isEditModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSubmit={handleUpdateProfile}
        initialData={{
          name: profile?.name || '',
          email: profile?.email || ''
        }}
      />
    </Container>
  );
};