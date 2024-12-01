import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Edit2 } from 'lucide-react-native';

interface ProfileSectionProps {
  name?: string;
  email: string;
  onEdit: () => void;
}

const Container = styled(View)`
  align-items: center;
`;

const Avatar = styled(View)`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const AvatarText = styled(Text)`
  font-size: 36px;
  font-weight: bold;
  color: white;
`;

const Name = styled(Text)`
  font-size: ${({ theme }) => theme.typography.h2.fontSize}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const Email = styled(Text)`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const EditButton = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm}px;
`;

const EditText = styled(Text)`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.primary};
  margin-left: ${({ theme }) => theme.spacing.xs}px;
`;

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  name,
  email,
  onEdit
}) => {
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Container>
      <Avatar>
        <AvatarText>{getInitials(name)}</AvatarText>
      </Avatar>
      <Name>{name || 'User'}</Name>
      <Email>{email}</Email>
      <EditButton onPress={onEdit}>
        <Edit2 size={20} color="#007AFF" />
        <EditText>Edit Profile</EditText>
      </EditButton>
    </Container>
  );
};