import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import { format } from 'date-fns';

interface Activity {
  date: string;
  completedGoals: number;
  messages: number;
}

interface ActivityTimelineProps {
  activities: Activity[];
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

const TimelineContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  height: 150px;
  align-items: flex-end;
`;

const DayContainer = styled(View)`
  align-items: center;
  width: ${100 / 7}%;
`;

const ActivityBar = styled(View)<{ height: number; type: 'goals' | 'messages' }>`
  width: 6px;
  height: ${({ height }) => height}px;
  background-color: ${({ theme, type }) =>
    type === 'goals' ? theme.colors.primary : theme.colors.secondary};
  margin: 0 2px;
  border-radius: 3px;
`;

const DateLabel = styled(Text)`
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const Legend = styled(View)`
  flex-direction: row;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

const LegendItem = styled(View)`
  flex-direction: row;
  align-items: center;
  margin: 0 ${({ theme }) => theme.spacing.sm}px;
`;

const LegendDot = styled(View)<{ type: 'goals' | 'messages' }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ theme, type }) =>
    type === 'goals' ? theme.colors.primary : theme.colors.secondary};
  margin-right: ${({ theme }) => theme.spacing.xs}px;
`;

const LegendLabel = styled(Text)`
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  const maxGoals = Math.max(...activities.map(a => a.completedGoals));
  const maxMessages = Math.max(...activities.map(a => a.messages));

  const getBarHeight = (value: number, max: number) => {
    if (max === 0) return 0;
    return (value / max) * 100;
  };

  const recentActivities = activities.slice(-7);

  return (
    <Container>
      <Title>Weekly Activity</Title>

      <TimelineContainer>
        {recentActivities.map((activity, index) => (
          <DayContainer key={activity.date}>
            <ActivityBar
              type="goals"
              height={getBarHeight(activity.completedGoals, maxGoals)}
            />
            <ActivityBar
              type="messages"
              height={getBarHeight(activity.messages, maxMessages)}
            />
            <DateLabel>
              {format(new Date(activity.date), 'EEE')}
            </DateLabel>
          </DayContainer>
        ))}
      </TimelineContainer>

      <Legend>
        <LegendItem>
          <LegendDot type="goals" />
          <LegendLabel>Goals</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendDot type="messages" />
          <LegendLabel>Messages</LegendLabel>
        </LegendItem>
      </Legend>
    </Container>
  );
};