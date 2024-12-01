import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { Target, MessageCircle, Award } from 'lucide-react-native';

import { ProgressCard } from './components/ProgressCard';
import { QuickAction } from './components/QuickAction';
import { RecentGoals } from './components/RecentGoals';
import { useProfile } from '../../hooks/useProfile';
import { useGoals } from '../../hooks/useGoals';
import type { MainTabNavigationProp } from '../../navigation/types';

const Container = styled(ScrollView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled(View)`
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const WelcomeText = styled(Text)`
  font-size: ${({ theme }) => theme.typography.h2.fontSize}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const SubText = styled(Text)`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const Section = styled(View)`
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const SectionTitle = styled(Text)`
  font-size: ${({ theme }) => theme.typography.h3.fontSize}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const QuickActions = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

export const HomeScreen = () => {
  const navigation = useNavigation<MainTabNavigationProp>();
  const { profile, isLoading: isProfileLoading } = useProfile();
  const { goals, isLoading: isGoalsLoading } = useGoals();

  const completedGoals = goals.filter(goal => goal.status === 'completed').length;
  const totalGoals = goals.length;
  const progress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  return (
    <Container
      refreshControl={
        <RefreshControl
          refreshing={isProfileLoading || isGoalsLoading}
          onRefresh={() => {
            // Refresh data
          }}
        />
      }
    >
      <Header>
        <WelcomeText>Welcome back, {profile?.name || 'User'}!</WelcomeText>
        <SubText>Let's continue your growth journey</SubText>

        <ProgressCard
          progress={progress}
          completedGoals={completedGoals}
          totalGoals={totalGoals}
        />
      </Header>

      <QuickActions>
        <QuickAction
          icon={<Target size={24} color="#007AFF" />}
          title="New Goal"
          onPress={() => navigation.navigate('Goals')}
        />
        <QuickAction
          icon={<MessageCircle size={24} color="#007AFF" />}
          title="Chat"
          onPress={() => navigation.navigate('Chat')}
        />
        <QuickAction
          icon={<Award size={24} color="#007AFF" />}
          title="Progress"
          onPress={() => navigation.navigate('Goals')}
        />
      </QuickActions>

      <Section>
        <SectionTitle>Recent Goals</SectionTitle>
        <RecentGoals goals={goals.slice(0, 3)} />
      </Section>
    </Container>
  );
};