import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import { ProgressChart } from '../../../screens/Analytics/components/ProgressChart';
import { theme } from '../../../theme';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

const mockGoalStats = {
  total: 10,
  completed: 7,
  inProgress: 3,
  completion_rate: 70
};

const mockChatStats = {
  total_sessions: 15,
  total_messages: 150,
  avg_messages_per_session: 10
};

describe('ProgressChart', () => {
  it('renders all stats correctly', () => {
    const { getByText } = render(
      <ProgressChart
        goalStats={mockGoalStats}
        chatStats={mockChatStats}
      />,
      { wrapper }
    );

    expect(getByText('70.0%')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
    expect(getByText('15')).toBeTruthy();
    expect(getByText('10.0')).toBeTruthy();
  });

  it('displays correct labels', () => {
    const { getByText } = render(
      <ProgressChart
        goalStats={mockGoalStats}
        chatStats={mockChatStats}
      />,
      { wrapper }
    );

    expect(getByText('Goal Completion Rate')).toBeTruthy();
    expect(getByText('Goals in Progress')).toBeTruthy();
    expect(getByText('Mentoring Sessions')).toBeTruthy();
    expect(getByText('Avg. Messages/Session')).toBeTruthy();
  });
});