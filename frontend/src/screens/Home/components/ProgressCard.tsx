import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import { CircularProgress } from '../../../components/common/CircularProgress';

interface ProgressCardProps {
  progress: number;
  completedGoals: number;
  totalGoals: number;
}

const Container = styled(View)`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const InfoContainer = styled(View)`
  flex: 1;
  margin-right: ${({ theme }) => theme.spacing.lg}px;
`;

const Title = styled(Text)`
  font-size: ${({ theme }) => theme.typography.h3.fontSize}px;
  font-weight: bold;
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StatsText = styled(Text)`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: rgba(255, 255, 255, 0.8);
`;

export const ProgressCard: React.FC<ProgressCardProps> = ({
  progress,
  completedGoals,
  totalGoals
}) => {
  return (
    <Container>
      <InfoContainer>
        <Title>Your Progress</Title>
        <StatsText>
          {completedGoals} of {totalGoals} goals completed
        </StatsText>
      </InfoContainer>
      <CircularProgress
        progress={progress}
        size={60}
        strokeWidth={6}
        progressColor="white"
        backgroundColor="rgba(255, 255, 255, 0.2)"
      />
    </Container>
  );
};