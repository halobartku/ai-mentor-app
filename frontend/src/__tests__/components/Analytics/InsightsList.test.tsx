import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import { InsightsList } from '../../../screens/Analytics/components/InsightsList';
import { theme } from '../../../theme';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

const mockInsights = [
  {
    type: 'goal',
    category: 'improvement',
    message: 'Try breaking down goals into smaller tasks'
  },
  {
    type: 'interaction',
    category: 'achievement',
    message: 'Great job maintaining regular sessions!'
  }
];

describe('InsightsList', () => {
  it('renders all insights', () => {
    const { getByText } = render(
      <InsightsList insights={mockInsights} />,
      { wrapper }
    );

    expect(getByText('Try breaking down goals into smaller tasks')).toBeTruthy();
    expect(getByText('Great job maintaining regular sessions!')).toBeTruthy();
  });

  it('displays the title', () => {
    const { getByText } = render(
      <InsightsList insights={mockInsights} />,
      { wrapper }
    );

    expect(getByText('Insights & Recommendations')).toBeTruthy();
  });

  it('renders empty list gracefully', () => {
    const { getByText } = render(
      <InsightsList insights={[]} />,
      { wrapper }
    );

    expect(getByText('Insights & Recommendations')).toBeTruthy();
  });
});