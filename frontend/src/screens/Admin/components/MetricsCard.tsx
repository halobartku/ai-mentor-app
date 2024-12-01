import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';

interface Metric {
  label: string;
  value: string;
}

interface MetricsCardProps {
  title: string;
  metrics: Metric[];
}

const Card = styled(View)`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  flex: 1;
  min-width: 200px;
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

const MetricContainer = styled(View)`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const MetricValue = styled(Text)`
  font-size: ${({ theme }) => theme.typography.h2.fontSize}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const MetricLabel = styled(Text)`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const MetricsCard: React.FC<MetricsCardProps> = ({ title, metrics }) => {
  return (
    <Card>
      <Title>{title}</Title>
      {metrics.map((metric, index) => (
        <MetricContainer key={index}>
          <MetricValue>{metric.value}</MetricValue>
          <MetricLabel>{metric.label}</MetricLabel>
        </MetricContainer>
      ))}
    </Card>
  );
};