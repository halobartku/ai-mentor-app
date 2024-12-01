import React from 'react';
import { View, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { LineChart } from 'recharts';

interface PerformanceData {
  model: string;
  averageResponseTime: number;
  averageTokenCount: number;
  totalRequests: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

const ChartContainer = styled(View)`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  elevation: 3;
`;

const screenWidth = Dimensions.get('window').width - 40; // 40 = padding

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  return (
    <ChartContainer>
      <LineChart
        data={data}
        width={screenWidth}
        height={300}
      >
        <XAxis dataKey="model" />
        <YAxis yAxisId="time" label="Response Time (ms)" />
        <YAxis yAxisId="tokens" orientation="right" label="Token Count" />
        
        <Line
          type="monotone"
          dataKey="averageResponseTime"
          stroke="#007AFF"
          yAxisId="time"
        />
        <Line
          type="monotone"
          dataKey="averageTokenCount"
          stroke="#34C759"
          yAxisId="tokens"
        />
      </LineChart>
    </ChartContainer>
  );
};