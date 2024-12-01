import React, { useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { Plus } from 'lucide-react-native';

import { Button } from '../../components/common/Button';
import { GoalItem } from './components/GoalItem';
import { AddGoalModal } from './components/AddGoalModal';
import { useGoals } from '../../hooks/useGoals';
import { EmptyState } from '../../components/common/EmptyState';

const Container = styled(View)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled(View)`
  padding: ${({ theme }) => theme.spacing.lg}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ContentContainer = styled(ScrollView)`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md}px;
`;

export const GoalsScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const { goals, isLoading, refetch, addGoal, updateGoalStatus, deleteGoal } = useGoals();

  const handleAddGoal = async (goalData: { title: string; description?: string; deadline?: Date }) => {
    await addGoal(goalData);
    setModalVisible(false);
  };

  return (
    <Container>
      <Header>
        <Button
          title="Add New Goal"
          onPress={() => setModalVisible(true)}
          icon={<Plus size={20} color="#FFF" />}
        />
      </Header>

      <ContentContainer
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
          />
        }
      >
        {goals.length === 0 ? (
          <EmptyState
            title="No Goals Yet"
            message="Start by adding your first goal"
            icon="target"
          />
        ) : (
          goals.map(goal => (
            <GoalItem
              key={goal.id}
              goal={goal}
              onStatusChange={updateGoalStatus}
              onDelete={deleteGoal}
            />
          ))
        )}
      </ContentContainer>

      <AddGoalModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddGoal}
      />
    </Container>
  );
};