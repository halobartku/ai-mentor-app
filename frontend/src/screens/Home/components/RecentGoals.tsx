import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { ChevronRight } from 'lucide-react-native';

interface Goal {
  id: string;
  title: string;
  status: string;
}

interface RecentGoalsProps {
  goals: Goal[];
}

const Container = styled(View)`
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  overflow: hidden;
`;

const GoalItem = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

const GoalTitle = styled(Text)`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
`;

const StatusIndicator = styled(View)<{ status: string }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ theme, status }) => 
    status === 'completed' ? theme.colors.success : 
    status === 'in_progress' ? theme.colors.warning : 
    theme.colors.border
  };
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const EmptyState = styled(View)`
  padding: ${({ theme }) => theme.spacing.lg}px;
  align-items: center;
`;

const EmptyText = styled(Text)`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const RecentGoals: React.FC<RecentGoalsProps> = ({ goals }) => {
  if (goals.length === 0) {
    return (
      <Container>
        <EmptyState>
          <EmptyText>No goals yet. Start by creating one!</EmptyText>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      {goals.map((goal, index) => (
        <GoalItem 
          key={goal.id}
          activeOpacity={0.7}
          style={index === goals.length - 1 ? { borderBottomWidth: 0 } : {}}
        >
          <StatusIndicator status={goal.status} />
          <GoalTitle numberOfLines={1}>{goal.title}</GoalTitle>
          <ChevronRight size={20} color="#999" />
        </GoalItem>
      ))}
    </Container>
  );
};