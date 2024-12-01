import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Bell, MessageCircle, Target, Award } from 'lucide-react-native';
import { format } from 'date-fns';

interface Notification {
  id: string;
  type: 'message' | 'goal' | 'achievement' | 'system';
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

interface NotificationsListProps {
  notifications: Notification[];
  onPress?: (notification: Notification) => void;
  onMarkAsRead?: (notificationId: string) => void;
}

const Container = styled(View)`
  flex: 1;
`;

const NotificationItem = styled(TouchableOpacity)<{ read: boolean }>`
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme, read }) => read ? theme.colors.background : theme.colors.light};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
  flex-direction: row;
  align-items: center;
`;

const IconContainer = styled(View)`
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const Content = styled(View)`
  flex: 1;
`;

const Title = styled(Text)`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const Body = styled(Text)`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const Time = styled(Text)`
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const getIcon = (type: string) => {
  const props = { size: 24, color: '#007AFF' };
  switch (type) {
    case 'message':
      return <MessageCircle {...props} />;
    case 'goal':
      return <Target {...props} />;
    case 'achievement':
      return <Award {...props} />;
    default:
      return <Bell {...props} />;
  }
};

export const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  onPress,
  onMarkAsRead
}) => {
  const handlePress = (notification: Notification) => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    if (onPress) {
      onPress(notification);
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <NotificationItem 
      read={item.read}
      onPress={() => handlePress(item)}
      activeOpacity={0.7}
    >
      <IconContainer>
        {getIcon(item.type)}
      </IconContainer>
      <Content>
        <Title>{item.title}</Title>
        <Body numberOfLines={2}>{item.body}</Body>
        <Time>{format(new Date(item.createdAt), 'MMM d, h:mm a')}</Time>
      </Content>
    </NotificationItem>
  );

  return (
    <Container>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </Container>
  );
};