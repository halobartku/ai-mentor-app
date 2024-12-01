import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import { LineChart } from 'recharts';

interface ProgressChartProps {
  goalStats: {
    total: number;
    completed: number;
    inProgress: number;
    completion_rate: number;
  };
  chatStats: {
    total_sessions: number;
    total_messages: number;
    avg_messages_per_session: number;
  };
}

const Container = styled(View)`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  elevation: 3;
`;

const Title = styled(Text)`
  font-size: ${({ theme }) => theme.typography.h3.fontSize}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StatsGrid = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const StatItem = styled(View)`
  width: 48%;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StatValue = styled(Text)`
  font-size: ${({ theme }) => theme.typography.h2.fontSize}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const StatLabel = styled(Text)`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ChartContainer = styled(View)`
  height: 200px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export const ProgressChart: React.FC<ProgressChartProps> = ({
  goalStats,
  chatStats
}) => {
  return (
    <Container>
      <Title>Progress Overview</Title>

      <StatsGrid>
        <StatItem>
          <StatValue>{goalStats.completion_rate.toFixed(1)}%</StatValue>
          <StatLabel>Goal Completion Rate</StatLabel>
        </StatItem>

        <StatItem>
          <StatValue>{goalStats.inProgress}</StatValue>
          <StatLabel>Goals in Progress</StatLabel>
        </StatItem>

        <StatItem>
          <StatValue>{chatStats.total_sessions}</StatValue>
          <StatLabel>Mentoring Sessions</StatLabel>
        </StatItem>

        <StatItem>
          <StatValue>{chatStats.avg_messages_per_session.toFixed(1)}</StatValue>
          <StatLabel>Avg. Messages/Session</StatLabel>
        </StatItem>
      </StatsGrid>

      <ChartContainer>
        <LineChart
          data={[
            { name: 'Goals', value: goalStats.completion_rate },
            { name: 'Sessions', value: chatStats.total_sessions }
          ]}
          width={300}
          height={200}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Line type="monotone" dataKey="value" stroke="#007AFF" />
        </LineChart>
      </ChartContainer>
    </Container>
  );
};