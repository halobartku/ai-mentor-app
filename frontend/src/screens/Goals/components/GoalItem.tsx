import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { MoreVertical, CheckCircle, Circle, Trash2 } from 'lucide-react-native';
import { format } from 'date-fns';

interface GoalItemProps {
  goal: {
    id: string;
    title: string;
    description?: string;
    status: string;
    deadline?: string;
  };
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

const Container = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const Header = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const Title = styled(Text)`
  font-size: ${({ theme }) => theme.typography.h3.fontSize}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const Description = styled(Text)`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const Footer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Deadline = styled(Text)`
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ActionsContainer = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const ActionButton = styled(TouchableOpacity)`
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

export const GoalItem: React.FC<GoalItemProps> = ({ goal, onStatusChange, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  const toggleStatus = () => {
    const newStatus = goal.status === 'completed' ? 'in_progress' : 'completed';
    onStatusChange(goal.id, newStatus);
  };

  return (
    <Container
      onLongPress={() => setShowActions(!showActions)}
      activeOpacity={0.7}
    >
      <Header>
        <Title>{goal.title}</Title>
        <TouchableOpacity onPress={() => setShowActions(!showActions)}>
          <MoreVertical size={20} color="#666" />
        </TouchableOpacity>
      </Header>

      {goal.description && (
        <Description>{goal.description}</Description>
      )}

      <Footer>
        {goal.deadline && (
          <Deadline>
            Due: {format(new Date(goal.deadline), 'MMM d, yyyy')}
          </Deadline>
        )}
        
        <ActionsContainer>
          {showActions && (
            <ActionButton onPress={() => onDelete(goal.id)}>
              <Trash2 size={20} color="#FF3B30" />
            </ActionButton>
          )}
          <ActionButton onPress={toggleStatus}>
            {goal.status === 'completed' ? (
              <CheckCircle size={20} color="#34C759" />
            ) : (
              <Circle size={20} color="#666" />
            )}
          </ActionButton>
        </ActionsContainer>
      </Footer>
    </Container>
  );
};