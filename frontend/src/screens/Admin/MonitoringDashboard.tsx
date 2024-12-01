import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import styled from 'styled-components/native';

import { MetricsCard } from './components/MetricsCard';
import { PerformanceChart } from './components/PerformanceChart';
import { ErrorsTable } from './components/ErrorsTable';
import { useMonitoring } from '../../hooks/useMonitoring';

const Container = styled(ScrollView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Section = styled(View)`
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const SectionTitle = styled(Text)`
  font-size: ${({ theme }) => theme.typography.h2.fontSize}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const Grid = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

export const MonitoringDashboard = () => {
  const { systemHealth, aiMetrics, isLoading, refetch } = useMonitoring();

  if (!systemHealth) return null;

  return (
    <Container>
      <Section>
        <SectionTitle>System Health</SectionTitle>
        <Grid>
          <MetricsCard
            title="AI Performance"
            metrics={[
              {
                label: 'Avg Response Time',
                value: `${systemHealth.aiPerformance.averageResponseTime.toFixed(2)}ms`
              },
              {
                label: 'Total Requests',
                value: systemHealth.aiPerformance.totalRequests.toString()
              }
            ]}
          />
          <MetricsCard
            title="User Activity"
            metrics={[
              {
                label: 'Total Messages',
                value: systemHealth.userActivity.totalMessages.toString()
              },
              {
                label: 'Avg Session',
                value: `${(systemHealth.userActivity.averageSessionDuration / 60).toFixed(1)}m`
              }
            ]}
          />
          <MetricsCard
            title="Error Rate"
            metrics={[
              {
                label: 'Total Errors',
                value: systemHealth.errorRate.total.toString()
              },
              {
                label: 'Errors/Hour',
                value: systemHealth.errorRate.perHour.toFixed(1)
              }
            ]}
          />
        </Grid>
      </Section>

      <Section>
        <SectionTitle>AI Performance Trends</SectionTitle>
        <PerformanceChart data={aiMetrics} />
      </Section>

      <Section>
        <SectionTitle>Recent Errors</SectionTitle>
        <ErrorsTable />
      </Section>
    </Container>
  );
};